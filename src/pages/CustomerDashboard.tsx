import { useAuthContext } from '@/context/AuthContext';
import { useFetchCustomerHome } from '@/lib/react-query/Customer/home';
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
  FaNetworkWired,
  FaStar,
  FaGem,
  FaCrown,
  FaMedal,
  FaTrophy,
} from 'react-icons/fa';
import { GiTakeMyMoney, GiDiamondRing, GiLaurelCrown } from 'react-icons/gi';
import { HiOutlineRefresh } from 'react-icons/hi';
import { boolean } from 'zod';
import { useGetProduct } from '@/lib/react-query/Admin/Product/products';
import { useCheckEpin } from '@/lib/react-query/Admin/Epin/epin';
import { useGetNetwotkTree } from '@/lib/react-query/network';
import Logo from '../../public/logo.png';
import toast from 'react-hot-toast';
import { getCustomerRank } from '@/lib/react-query/Customer/ranking';

// ─── Rank System ────────────────────────────────────────────────────────────




// ─── Rank Badge Strip Component ──────────────────────────────────────────────
const RankBadgeStrip: React.FC<{ directTeam: number; totalEarning: number }> = ({ directTeam, totalEarning }) => {
  const rank = getCustomerRank(directTeam, totalEarning);

  return (
    <div
      style={{
        background: rank.gradient,
        boxShadow: `0 4px 24px ${rank.glow}`,
      }}
      className="mb-4 rounded-xl p-4 flex items-center justify-between gap-4 transition-all duration-500"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
          style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)' }}
        >
          {rank.type === 'star' ? (
            <span className="flex gap-0.5">
              {Array.from({ length: rank.starCount ?? 1 }).map((_, i) => (
                <FaStar key={i} style={{ color: '#f59e0b', filter: 'drop-shadow(0 0 4px #fde68a)' }} />
              ))}
            </span>
          ) : (
            <span style={{ lineHeight: 1 }}>{rank.emoji}</span>
          )}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-70" style={{ color: rank.textColor }}>
            Your Current Rank
          </p>
          {rank.type === 'star' ? (
            <p className="text-xl font-extrabold flex items-center gap-2" style={{ color: rank.textColor }}>
              {rank.label}
            </p>
          ) : (
            <p className="text-xl font-extrabold tracking-wide" style={{ color: rank.textColor }}>
              {rank.label}
            </p>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-xs opacity-70 font-semibold" style={{ color: rank.textColor }}>Direct Team</p>
        <p className="text-lg font-bold" style={{ color: rank.textColor }}>{directTeam}</p>
      </div>
    </div>
  );
};

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

  const { data: networkData } = useGetNetwotkTree();
  const children = networkData?.children || [];
  const activeTeamCount = children.filter((child: any) => child.data?.isActive).length;
  const inactiveTeamCount = children.filter((child: any) => !child.data?.isActive).length;

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

  const baseUrl = import.meta.env.VITE_LIVE_URL || 'https://happilylife.online';
  const RegistrationLink = `${baseUrl}/register/${fullname}/${crnNo}`;
  const shortRegistrationLink = `.../register/${fullname}/${crnNo}`;

  const copyLink = (key: string) => {
    navigator.clipboard.writeText(RegistrationLink);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  // Helper to format currency
  const formatCurrency = (value: number | undefined) =>
    value != null ? `${value.toLocaleString('en-US')}` : '0';

  const formatCount = (value: number | undefined) => value?.toLocaleString() ?? '0';

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <HiOutlineRefresh className="animate-spin text-4xl text-primary mr-3" />
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
          className="bg-secondary text-white px-6 py-2 rounded hover:bg-secondary/90 flex items-center gap-2"
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
    activeTeam: activeTeamCount,
    inactiveTeam: inactiveTeamCount,
    generationIncome: dashboardData?.genrationIncome ?? 0,
    helpingIncome: dashboardData?.helpCommission ?? 0,
    totalSales: dashboardData?.totalSales ?? dashboardData?.TotalSales ?? 0,
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
                    E-pin Value: Rs. {epinPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product / Package {epinPrice !== null && `(Max: Rs. ${epinPrice})`}
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
                      {prod.name} - Rs. {prod.discountedPrice || prod.price}
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
                  className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center"
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
          <p className="text-gray-600 font-medium">Welcome To happily Life</p>
        </div>
      </div>

      {/* Rank Badge Strip */}
      <RankBadgeStrip
        directTeam={stats.directTeam}
        totalEarning={stats.totalEarning}
      />

      {/* Referral Link */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-xl shadow-lg shadow-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm shrink-0">
              <FaNetworkWired className="text-xl md:text-2xl" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-0.5">Your Registration Link</p>
              <p className="font-mono text-sm opacity-95 truncate" title={RegistrationLink}>
                {shortRegistrationLink}
              </p>
            </div>
          </div>

          <button
            onClick={() => copyLink('registration')}
            className={`${
              copied === 'registration'
                ? 'bg-white text-secondary'
                : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
            } w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0`}
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

      {/* All Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
        {[
          // First Row Cards
         

          {
            title: 'Total Team',
            value: formatCount(stats.directTeam),
            icon: <FaUsers className="text-2xl text-blue-500" />
          },

          // Second Row Cards
          {
            title: 'Active Team',
            value: formatCount(stats.activeTeam),
            icon: <FaUsers className="text-2xl text-green-500" />
          },

          {
            title: 'Inactive Team',
            value: formatCount(stats.inactiveTeam),
            icon: <FaUsers className="text-2xl text-red-500" />
          },
               {
            title: 'Total Sales',
            value: formatCurrency(stats.totalSales),
            icon: <FaShoppingBag className="text-2xl text-emerald-500" />,
            dollor: 'Rs.'
          },
            {
            title: 'Total Earning',
            value: formatCurrency(stats.totalEarning),
            icon: <FaMoneyBillWave className="text-2xl text-teal-500" />,
            dollor: 'Rs.'
          },

          {
            title: 'Genarational Income',
            value: formatCurrency(stats.generationIncome),
            icon: <FaSeedling className="text-2xl text-indigo-500" />,
            dollor: 'Rs.'
          },
           {
            title: 'Bonus Income',
            value: 1000,
            icon: <FaShoppingBag className="text-2xl text-pink-500" />,
            remaining: Math.max(0, 5 - activeTeamCount)
          },

          {
            title: 'Upgrade Income',
            value: formatCurrency(stats.helpingIncome),
            icon: <FaSeedling className="text-2xl text-yellow-500" />,
            dollor: 'Rs.'
          },

          {
            title: 'Next Upgrade Income',
            value: formatCurrency(stats.binaryIncome),
            icon: <GiTakeMyMoney className="text-2xl text-sky-500" />,
            dollor: 'Rs.'
          },

          // Third Row Cards
          {
            title: 'Upgrade Members',
            value: formatCount(Math.max(0, 5 - activeTeamCount)),
            icon: <FaUsers className="text-2xl text-orange-500" />
          },


        ]
          .filter(card => card.title !== 'Bonus Income' || (card.remaining ?? 0) > 0)
          .map((card, i) => (
            <div
              key={i}
              className="dark:bg-gray-800 bg-white p-4 shadow-default dark:bg-black flex flex-col justify-between h-[140px] transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="dark:bg-gray-700 flex h-10 w-10 items-center justify-center rounded-full bg-gray dark:bg-primary">
                  {card.icon}
                </div>
                {card.remaining !== undefined && card.remaining > 0 && (
                  <span className="bg-primary/5 text-primary dark:bg-blue-900/30 dark:text-primary/80 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                    {card.remaining} more
                  </span>
                )}
              </div>
              <div className="mt-2">
                <p className="text-gray-800 text-xl font-semibold dark:text-white flex items-baseline gap-0.5">
                  {card.dollor && (
                    <span className="text-lg font-bold opacity-80">
                      {card.dollor}
                    </span>
                  )}
                  {card.value}
                </p>
                <div className="align-center flex flex-row justify-between">
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate" title={card.title}>
                    {card.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;