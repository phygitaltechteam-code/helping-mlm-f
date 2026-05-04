import { useAuthContext } from '@/context/AuthContext';
import { useFetchCustomerHome} from '@/lib/react-query/Customer/home';
import { assignEpin } from '@/lib/api/updateCustomer';
import React, { useState, useEffect } from 'react';
import { 
  FaBriefcase, 
  FaUsers, 
  FaShoppingBag, 
  FaUser, 
  FaSuitcase, 
  FaSeedling, 
  FaMoneyBillWave, 
  FaWallet,
  FaCopy,
  FaCheckCircle,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaKey,
  FaNetworkWired
} from 'react-icons/fa';
import { GiTakeMyMoney } from 'react-icons/gi';
import { HiOutlineRefresh } from 'react-icons/hi';
import { boolean } from 'zod';
import { useGetProduct } from '@/lib/react-query/Admin/Product/products';
import { useCheckEpin } from '@/lib/react-query/Admin/Epin/epin';
import Logo from '../../public/logo.png';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const { user, setUser } = useAuthContext();
const { data: product, isLoading: isProductLoading } = useGetProduct();

console.log('product', product?.map(element => {
  console.log('element', element.name);
}));

  let isActive = user?.isActive;

  
  const {
    data: dashboardData,
    isPending,
    isError,
    refetch,
    isSuccess,
  } = useFetchCustomerHome();

  console.log('dashboardData', dashboardData);

  const [copied, setCopied] = useState<string | null>(null);
  const [showInactivePopup, setShowInactivePopup] = useState(true);

  // Activation Form State
  const [epinInput, setEpinInput] = useState('');
  const [epinPrice, setEpinPrice] = useState<number | null>(null);
  const [isCheckingEpin, setIsCheckingEpin] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState('');

  const { mutate: checkEpinMutate } = useCheckEpin();

  useEffect(() => {
    if (!epinInput.trim()) {
      setEpinPrice(null);
      setActivationError('');
      return;
    }

    const verifyEpin = () => {
      setIsCheckingEpin(true);
      checkEpinMutate(epinInput, {
        onSuccess: (data: any) => {
          // Some APIs return the price directly as a number, others in an object
          const price = typeof data === 'object' ? data.price : data;
          if (price) {
            setEpinPrice(Number(price));
            setActivationError('');
          } else {
            setEpinPrice(null);
            setActivationError('Invalid E-pin or value not found.');
          }
          setIsCheckingEpin(false);
        },
        onError: (err: any) => {
          setEpinPrice(null);
          setActivationError(err?.response?.data?.message || 'Invalid E-pin');
          setIsCheckingEpin(false);
        }
      });
    };

    const timeoutId = setTimeout(() => {
      if (epinInput.trim().length >= 4) {
        verifyEpin();
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [epinInput, checkEpinMutate]);

  const filteredProducts = product?.filter((prod: any) => {
    if (epinPrice === null) return false;
    // Prioritize discountedPrice for filtering
    const prodPrice = Number(prod.discountedPrice || prod.price || 0);
    return prodPrice <= epinPrice;
  });

  const handleActivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epinInput.trim() || !selectedProductId) {
      setActivationError('Please provide both E-pin and select a product.');
      return;
    }
    
    setIsActivating(true);
    setActivationError('');
    
    try {
      await assignEpin(epinInput, selectedProductId);
      // On success, update user context to reflect active state
      if (user) {
        setUser({ ...user, isActive: true });
      }
      setShowInactivePopup(false);
      refetch(); // Refetch dashboard data
    } catch (err: any) {
      setActivationError(err?.response?.data?.message || err.message || 'Failed to activate account. Please try again.');
    } finally {
      setIsActivating(false);
    }
  };

  // Prepare referral links
  const fullname = user?.fullname
    ? user.fullname.replace(/\s/g, '_')
    : 'unknown_user';

  const crnNo = user?.crnNo || 'CRN0000000';

  const baseUrl = import.meta.env.VITE_LIVE_URL || 'https://f5z16x7l-5173.inc1.devtunnels.ms';
  const RegistrationLink = `${baseUrl}/register/${fullname}/${crnNo}`;
  
   const copyLink = (key:string) => {
    navigator.clipboard.writeText(RegistrationLink);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  // Helper to format currency
  const formatCurrency = (value: number | undefined) =>
    value != null ? `${value.toLocaleString('en-US')}` : '$0';

  const formatCount = (value: number | undefined) => value?.toLocaleString() ?? '0';

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <HiOutlineRefresh className="animate-spin text-4xl text-blue-600 mr-3" />
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center gap-4">
        <div className="text-xl text-red-600">Failed to load dashboard data</div>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <HiOutlineRefresh className="text-lg" />
          Retry
        </button>
      </div>
    );
  }

  // Use fallback values if data is missing
  const stats = {
    myPackage: dashboardData?.myPackage ?? 0,
    directTeam: dashboardData?.directTeam ?? 0,
    leftTeam: dashboardData?.leftTeam ?? 0,
    rightTeam: dashboardData?.rightTeam ?? 0,
    roiIncome: dashboardData?.roiIncome ?? 0,
    binaryIncome: dashboardData?.Binaryincome ?? 0, // note: API has inconsistent casing
    totalEarning: dashboardData?.totalEarning ?? 0,
    totalWithdrawal: dashboardData?.totalWithdrawal ?? 0,
    walletBalance: dashboardData?.WalletBalance ?? 0,
    // New cards
    customerTeam: dashboardData?.customerTeam ?? 0,
    activePin: dashboardData?.activePin ?? 0,
    inactivePin: dashboardData?.inactivePin ?? 0,
    generationCommission: dashboardData?.generationCommission ?? 0,
    autopullCommission: dashboardData?.autopullCommission ?? 0,
  };

  return (
    <div className="min-h-screen bg-gray-100 md:p-6 font-sans relative">
      {/* Inactive Account Popup */}
      {!isActive && showInactivePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl transform transition-all animate-slideIn">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-amber-600 text-3xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">Account Inactive</h3>
            <p className="text-gray-600 text-center mb-6">
              Your account is not Active. Please enter your E-pin and select a package to activate your account.
            </p>

            <form onSubmit={handleActivateAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Pin Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={epinInput}
                    onChange={(e) => setEpinInput(e.target.value)}
                    placeholder="Enter E-pin"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    disabled={isActivating}
                  />
                  {isCheckingEpin && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <HiOutlineRefresh className="animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
                {epinPrice !== null && (
                  <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    E-pin Value: ${epinPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product / Package {epinPrice !== null && `(Max: $${epinPrice})`}
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  disabled={isActivating || isProductLoading || epinPrice === null}
                >
                  <option value="">
                    {epinPrice === null ? '-- Verify E-pin first --' : '-- Select Product --'}
                  </option>
                  {filteredProducts?.map((prod: any) => (
                    <option key={prod._id || prod.id} value={prod._id || prod.id}>
                      {prod.name} - ${prod.discountedPrice || prod.price}
                    </option>
                  ))}
                </select>
                {epinPrice !== null && filteredProducts?.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No products found within this E-pin's price range.</p>
                )}
              </div>

              {activationError && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  {activationError}
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowInactivePopup(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                  disabled={isActivating}
                >
                  Later
                </button>
                <button
                  type="submit"
                  disabled={isActivating || !epinInput || !selectedProductId}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                  {isActivating ? (
                    <HiOutlineRefresh className="animate-spin text-xl" />
                  ) : (
                    'Purchase'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
     
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 font-medium">Welcome To ARC International</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <FaNetworkWired className="text-2xl" />
            </div>
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Your Registration Link</p>
              <p className="font-mono text-sm break-all opacity-95">
                {RegistrationLink}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => copyLink('registration')}
            className={`${
              copied === 'registration' ? 'bg-green-500' : 'bg-white text-indigo-700 hover:bg-blue-50'
            } px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap`}
          >
            {copied === 'registration' ? (
              <>
                <FaCheckCircle /> Copied!
              </>
            ) : (
              <>
                <FaCopy /> Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* First Row - Team & Package Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
            { 
            title: 'Bonus Income', 
            value: 1000, 
            gradient: 'from-orange-400 to-red-500', 
            icon: <FaShoppingBag />,
            remaining: Math.max(0, 5 - (dashboardData?.directTeam ?? 0))
          },
                    { title: 'Total Team', value: formatCount(stats.directTeam), gradient: 'from-purple-500 to-pink-600', icon: <FaUsers /> },

         // { title: 'My Package', value: formatCurrency(stats.myPackage), gradient: 'from-cyan-400 to-teal-500', icon: <FaBriefcase /> ,dollor:'$' },
        
        ].filter(card => card.title !== 'Bonus Income' || (card.remaining ?? 0) > 0).map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.gradient} rounded-lg shadow-lg p-4 text-white min-h-[120px] flex flex-col justify-between transition-transform hover:scale-[1.02]`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium opacity-90 uppercase tracking-wider">{card.title}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold opacity-80">{card.dollor}</span>
                  <span className="text-3xl font-bold">{card.value}</span>
                </div>
                {card.remaining !== undefined && card.remaining > 0 && (
                  <div className="mt-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                      {card.remaining} more to connect
                    </span>
                  </div>
                )}
              </div>
              <div className="text-3xl opacity-40 bg-black/10 p-2 rounded-lg">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row - Income & Wallet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        {[
           { title: 'Active Pin', value: formatCount(stats.activePin), gradient: 'from-green-400 to-emerald-500', icon: <FaKey /> },
          { title: 'Inactive Pin', value: formatCount(stats.inactivePin), gradient: 'from-red-400 to-rose-500', icon: <FaKey /> },
   { title: 'Genarational Income', value: formatCurrency(stats.binaryIncome), gradient: 'from-blue-600 to-purple-700', icon: <FaSeedling />, dollor: '$' },
          { title: 'Helping Income', value: formatCurrency(stats.binaryIncome), gradient: 'from-blue-600 to-purple-700', icon: <FaSeedling /> ,dollor:'$' },
          { title: 'Rent Helping Income', value: formatCount(stats.customerTeam), gradient: 'from-blue-400 to-indigo-500', icon: <FaUsers /> },

          { title: 'ROI Income', value: formatCurrency(stats.roiIncome), gradient: 'from-amber-400 to-orange-600', icon: <GiTakeMyMoney /> ,dollor:'$' },
          // { title: 'Total Withdrawal', value: formatCurrency(stats.totalWithdrawal), gradient: 'from-purple-500 to-pink-600', icon: <FaMoneyBillWave /> ,dollor:'$' },
         // { title: 'Wallet Balance', value: formatCurrency(stats.walletBalance), gradient: 'from-pink-500 to-purple-700', icon: <FaWallet /> ,dollor:'$' },
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.gradient} rounded-md shadow-lg p-3 text-white h-24 flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-base font-semibold">{card.title}</p>
                <p className="text-3xl font-bold mt-1"> {card.dollor} {card.value}</p>
              </div>
              <div className="text-2xl opacity-90">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Third Row - New Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        {[
                    { title: 'Remaining Member for helping Income', value: formatCount(stats.customerTeam), gradient: 'from-blue-400 to-indigo-500', icon: <FaUsers /> },
                    { title: 'Total Earning', value: formatCount(stats.customerTeam), gradient: 'from-blue-400 to-indigo-500', icon: <FaUsers /> },
                    { title: 'Total Sales', value: formatCount(stats.customerTeam), gradient: 'from-blue-400 to-indigo-500', icon: <FaUsers /> },

          // { title: 'Customer Team', value: formatCount(stats.customerTeam), gradient: 'from-blue-400 to-indigo-500', icon: <FaUsers /> },
         
        ].map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.gradient} rounded-md shadow-lg p-3 text-white h-24 flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-base font-semibold">{card.title}</p>
                <p className="text-3xl font-bold mt-1"> {card.dollor ? card.dollor : ''} {card.value}</p>
              </div>
              <div className="text-2xl opacity-90">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default CustomerDashboard;