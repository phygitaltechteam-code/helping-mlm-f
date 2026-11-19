import {useAuthContext} from '@/context/AuthContext';
import {useFetchCustomerHome} from '@/lib/react-query/Customer/home';
import {assignEpin} from '@/lib/api/updateCustomer';
import React, {useState, useEffect} from 'react';
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
import {GiTakeMyMoney, GiDiamondRing, GiLaurelCrown} from 'react-icons/gi';
import {HiOutlineRefresh} from 'react-icons/hi';
import {boolean} from 'zod';
import {useGetProduct} from '@/lib/react-query/Admin/Product/products';
import {useCheckEpin} from '@/lib/react-query/Admin/Epin/epin';
import {useGetNetwotkTree} from '@/lib/react-query/network';
import Logo from '../../public/logo.png';
import toast from 'react-hot-toast';
import {getCustomerRank} from '@/lib/react-query/Customer/ranking';

// ─── Rank System ────────────────────────────────────────────────────────────

// ─── Rank Badge Strip Component ──────────────────────────────────────────────
const RankBadgeStrip: React.FC<{
  rank: string;
  teamSize: number;
}> = ({rank, teamSize}) => {
  const rankData = getCustomerRank(rank);
  const isStarRank = rankData.type === 'star';

  return (
    <div
      style={{
        background: rankData.gradient,
        boxShadow: `0 4px 24px ${rankData.glow}`,
      }}
      className="mb-4 flex items-center justify-between gap-4 rounded-xl p-4 transition-all duration-500"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl"
          style={{
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(6px)',
          }}
        >
          {isStarRank ? (
            <span className="flex gap-0.5">
              {Array.from({length: rankData.starCount ?? 1}).map((_, i) => (
                <FaStar
                  key={i}
                  style={{
                    color: '#f59e0b',
                    filter: 'drop-shadow(0 0 4px #fde68a)',
                  }}
                />
              ))}
            </span>
          ) : (
            <span style={{lineHeight: 1}}>{rankData.emoji}</span>
          )}
        </div>
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest opacity-70"
            style={{color: rankData.textColor}}
          >
            Your Current Rank
          </p>
          {isStarRank ? (
            <p
              className="flex items-center gap-2 text-xl font-extrabold"
              style={{color: rankData.textColor}}
            >
              {rankData.label}
            </p>
          ) : (
            <p
              className="text-xl font-extrabold tracking-wide"
              style={{color: rankData.textColor}}
            >
              {rankData.label}
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p
          className="text-xs font-semibold opacity-70"
          style={{color: rankData.textColor}}
        >
          {isStarRank ? 'Active Team' : 'Direct Team'}
        </p>
        <p className="text-lg font-bold" style={{color: rankData.textColor}}>
          {teamSize}
        </p>
      </div>
    </div>
  );
};
const CustomerDashboard = () => {
  const {user, setUser} = useAuthContext();
  const {data: product, isLoading: isProductLoading} = useGetProduct();

  console.log(
    'product',
    product?.map((element) => {
      console.log('element', element.name);
    }),
  );

  let isActive = user?.isActive;

  const {
    data: dashboardData,
    isPending,
    isError,
    refetch,
    isSuccess,
  } = useFetchCustomerHome();

  // console.log('dashboardData', dashboardData);

  const [copied, setCopied] = useState<string | null>(null);
  const [showInactivePopup, setShowInactivePopup] = useState(true);

  // Activation Form State
  const [epinInput, setEpinInput] = useState('');
  const [epinPrice, setEpinPrice] = useState<number | null>(null);
  const [isCheckingEpin, setIsCheckingEpin] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState('');

  const {mutate: checkEpinMutate} = useCheckEpin();

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
        },
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
        setUser({...user, isActive: true});
      }
      setShowInactivePopup(false);
      refetch(); // Refetch dashboard data
    } catch (err: any) {
      setActivationError(
        err?.response?.data?.message ||
          err.message ||
          'Failed to activate account. Please try again.',
      );
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

  const formatCount = (value: number | undefined) =>
    value?.toLocaleString() ?? '0';

  if (isPending) {
    return (
      <div className="bg-gray-100 flex min-h-screen items-center justify-center p-6">
        <HiOutlineRefresh className="mr-3 animate-spin text-4xl text-primary" />
        <div className="text-gray-600 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-100 flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <div className="text-xl text-red-600">
          Failed to load dashboard data
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded bg-secondary px-6 py-2 text-white hover:bg-secondary/90"
        >
          <HiOutlineRefresh className="text-lg" />
          Retry
        </button>
      </div>
    );
  }

  // Use fallback values if data is missing
  const stats = {
    rank: dashboardData?.rank ?? 'None',
    myPackage: dashboardData?.myPackage ?? 0,
    totalTeam: dashboardData?.totalTeam ?? 0,
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
    activeTeam: dashboardData?.activeTeam,
    inactiveTeam: dashboardData?.inactiveTeam,
    autoTeam: dashboardData?.autoTeam ?? 0,
    generationIncome: dashboardData?.genrationIncome ?? 0,
    helpingIncome: dashboardData?.helpingIncome ?? 0,
    totalSales: dashboardData?.totalSales ?? dashboardData?.TotalSales ?? 0,
    poolIncome: dashboardData?.poolIncome ?? 0,
  };

  return (
    <div className="bg-gray-100 font-sans relative min-h-screen md:p-6">
      {/* Inactive Account Popup */}
      {!isActive && showInactivePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="animate-slideIn w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all md:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <span className="text-3xl text-amber-600">⚠️</span>
            </div>
            <h3 className="text-gray-800 mb-2 text-center text-2xl font-bold">
              Account Inactive
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Your account is not Active. Please enter your E-pin and select a
              package to activate your account.
            </p>

            <form onSubmit={handleActivateAccount} className="space-y-4">
              <div>
                <label className="text-gray-700 mb-1 block text-sm font-medium">
                  E-Pin Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={epinInput}
                    onChange={(e) => setEpinInput(e.target.value)}
                    placeholder="Enter E-pin"
                    className="border-gray-300 w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    disabled={isActivating}
                  />
                  {isCheckingEpin && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <HiOutlineRefresh className="animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
                {epinPrice !== null && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    E-pin Value: Rs. {epinPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-700 mb-1 block text-sm font-medium">
                  Select Product / Package{' '}
                  {epinPrice !== null && `(Max: Rs. ${epinPrice})`}
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="border-gray-300 w-full rounded-lg border bg-white px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  disabled={
                    isActivating || isProductLoading || epinPrice === null
                  }
                >
                  <option value="">
                    {epinPrice === null
                      ? '-- Verify E-pin first --'
                      : '-- Select Product --'}
                  </option>
                  {filteredProducts?.map((prod: any) => (
                    <option
                      key={prod._id || prod.id}
                      value={prod._id || prod.id}
                    >
                      {prod.name} - Rs. {prod.discountedPrice || prod.price}
                    </option>
                  ))}
                </select>
                {epinPrice !== null && filteredProducts?.length === 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    No products found within this E-pin's price range.
                  </p>
                )}
              </div>

              {activationError && (
                <div className="rounded bg-red-50 p-2 text-center text-sm text-red-500">
                  {activationError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInactivePopup(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 flex-1 rounded-lg px-4 py-2 font-medium transition-colors"
                  disabled={isActivating}
                >
                  Later
                </button>
                <button
                  type="submit"
                  disabled={isActivating || !epinInput || !selectedProductId}
                  className="flex flex-1 items-center justify-center rounded-lg bg-secondary px-4 py-2 font-medium text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
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

      <div className="mb-6 flex items-center gap-4">
        <div>
          <h1 className="text-gray-800 text-2xl font-bold md:text-3xl">
            Dashboard
          </h1>
          <p className="text-gray-600 font-medium">Welcome To happily Life</p>
        </div>
      </div>

      {/* Rank Badge Strip */}
      {/* Rank Badge Strip */}
      <RankBadgeStrip rank={stats.rank} teamSize={stats.activeTeam} />

      {/* Referral Link */}
      <div className="mb-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-primary to-secondary p-4 text-white shadow-lg shadow-primary/20 sm:flex-row">
          <div className="flex w-full min-w-0 items-center gap-4 sm:w-auto">
            <div className="shrink-0 rounded-lg bg-white/20 p-3 backdrop-blur-sm">
              <FaNetworkWired className="text-xl md:text-2xl" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-xs font-bold uppercase tracking-widest opacity-80">
                Your Registration Link
              </p>
              <p
                className="font-mono truncate text-sm opacity-95"
                title={RegistrationLink}
              >
                {shortRegistrationLink}
              </p>
            </div>
          </div>

          <button
            onClick={() => copyLink('registration')}
            className={`${
              copied === 'registration'
                ? 'bg-white text-secondary'
                : 'border border-white/30 bg-white/20 text-white hover:bg-white/30'
            } flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 py-2.5 font-bold shadow-md transition-all active:scale-95 sm:w-auto`}
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

      {/* Bonus Income and Total Earning Section - Two column grid on all screens */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-3">
          {/* Bonus Income Card - Auto remove when completed (5 active members) */}
          {Math.max(0, 5 - stats.activeTeam) > 0 && (
            <div className="rounded-xl bg-gradient-to-r from-pink-50 to-pink-100/50 p-3 shadow-sm transition-all hover:shadow-md">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-200">
                  <FaShoppingBag className="text-sm text-pink-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-500 truncate text-xs font-medium">
                    Bonus Income
                  </p>
                  <p className="text-sm font-bold text-pink-600">Rs. 1,000</p>
                </div>
              </div>
              {/* Progress bar - only show when not completed */}
              {Math.max(0, 5 - stats.activeTeam) > 0 && (
                <div className="mt-2">
                  <div className="bg-gray-200 h-1.5 w-full rounded-full">
                    <div
                      className="h-1.5 rounded-full bg-pink-500 transition-all duration-500"
                      style={{width: `${(stats.activeTeam / 5) * 100}%`}}
                    ></div>
                  </div>
                  <p className="text-gray-400 mt-1 text-[10px]">
                    {stats.activeTeam}/5 active
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Total Earning Card - Always visible */}
          <div className="rounded-xl bg-gradient-to-r from-teal-50 to-teal-100/50 p-3 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-200">
                <FaMoneyBillWave className="text-sm text-teal-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 truncate text-xs font-medium">
                  Total Earning
                </p>
                <p className="truncate text-sm font-bold text-teal-600">
                  Rs. {formatCurrency(stats.totalEarning)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* All Dashboard Cards */}
      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {[
          // First Row Cards

          {
            title: 'Total Team',
            value: formatCount(stats.totalTeam),
            icon: <FaUsers className="text-2xl text-blue-500" />,
          },

          // Second Row Cards
          {
            title: 'Active Team',
            value: formatCount(stats.activeTeam),
            icon: <FaUsers className="text-2xl text-green-500" />,
          },

          {
            title: 'Inactive Team',
            value: formatCount(stats.inactiveTeam),
            icon: <FaUsers className="text-2xl text-red-500" />,
          },
          {
            title: 'Total Sales',
            value: formatCurrency(stats.totalSales),
            icon: <FaShoppingBag className="text-2xl text-emerald-500" />,
            dollor: 'Rs.',
          },
          {
            title: 'Total Earning',
            value: formatCurrency(stats.totalEarning),
            icon: <FaMoneyBillWave className="text-2xl text-teal-500" />,
            dollor: 'Rs.',
          },

          {
            title: 'Genarational Income',
            value: formatCurrency(stats.generationIncome),
            icon: <FaSeedling className="text-2xl text-indigo-500" />,
            dollor: 'Rs.',
          },
          {
            title: 'Bonus Income',
            value: 1000,
            icon: <FaShoppingBag className="text-2xl text-pink-500" />,
            remaining: Math.max(0, 5 - stats.activeTeam),
          },

          {
            title: 'Auto Income',
            value: formatCurrency(stats.helpingIncome),
            icon: <FaSeedling className="text-2xl text-yellow-500" />,
            dollor: 'Rs.',
          },
          {
            title: 'Pool Income',
            value: formatCurrency(stats.poolIncome),
            icon: <FaSeedling className="text-2xl text-yellow-500" />,
            dollor: 'Rs.',
          },
          {
            title: 'Next Auto Income',
            value: formatCurrency(stats.binaryIncome),
            icon: <GiTakeMyMoney className="text-2xl text-sky-500" />,
            dollor: 'Rs.',
          },

          // Third Row Cards
          {
            title: 'Auto Members',
            value: formatCount(stats.autoTeam),
            icon: <FaUsers className="text-2xl text-orange-500" />,
          },
        ]
          .filter(
            (card) =>
              card.title !== 'Bonus Income' || (card.remaining ?? 0) > 0,
          )
          .map((card, i) => (
            <div
              key={i}
              className="dark:bg-gray-800 flex h-[140px] flex-col justify-between bg-white p-4 shadow-default transition-transform hover:scale-[1.02] dark:bg-black"
            >
              <div className="flex items-center justify-between">
                <div className="dark:bg-gray-700 flex h-10 w-10 items-center justify-center rounded-full bg-gray dark:bg-primary">
                  {card.icon}
                </div>
                {card.remaining !== undefined && card.remaining > 0 && (
                  <span className="rounded-full border border-blue-100 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary dark:border-blue-800 dark:bg-blue-900/30 dark:text-primary/80">
                    {card.remaining} more
                  </span>
                )}
              </div>
              <div className="mt-2">
                <p className="text-gray-800 flex items-baseline gap-0.5 text-xl font-semibold dark:text-white">
                  {card.dollor && (
                    <span className="text-lg font-bold opacity-80">
                      {card.dollor}
                    </span>
                  )}
                  {card.value}
                </p>
                <div className="align-center flex flex-row justify-between">
                  <p
                    className="text-gray-500 dark:text-gray-400 truncate text-sm"
                    title={card.title}
                  >
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
