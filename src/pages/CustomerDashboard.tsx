import { useAuthContext } from '@/context/AuthContext';
import { useFetchCustomerHome } from '@/lib/react-query/Customer/home';
import React, { useState } from 'react';
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
  FaIdCard
} from 'react-icons/fa';
import { GiTakeMyMoney } from 'react-icons/gi';
import { HiOutlineRefresh } from 'react-icons/hi';

const CustomerDashboard = () => {
  const { user } = useAuthContext();
  const {
    data: dashboardData,
    isPending,
    isError,
    refetch,
    isSuccess,
  } = useFetchCustomerHome();

  console.log('dashboardData', dashboardData);

  const [copied, setCopied] = useState<'left' | 'right' | null>(null);

  // Prepare referral links
  const fullname = user?.fullname
    ? user.fullname.replace(/\s/g, '_')
    : 'unknown_user';

  const crnNo = user?.crnNo || 'CRN0000000';

  const baseUrl = import.meta.env.VITE_LIVE_URL || 'https://f5z16x7l-5173.inc1.devtunnels.ms';
  const leftRegistrationLink = `${baseUrl}/register/${fullname}/${crnNo}/LEFT`;
  const rightRegistrationLink = `${baseUrl}/register/${fullname}/${crnNo}/RIGHT`;
   const copyLink = (type: 'left' | 'right') => {
    const link = type === 'left' ? leftRegistrationLink : rightRegistrationLink;
    navigator.clipboard.writeText(link);
    setCopied(type);
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
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-sans">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome To ARC International</p>

      {/* Referral Links */}
   <div className="space-y-4 mb-8">
{[
  { label: 'Left', link: leftRegistrationLink, key: 'left' },
  { label: 'Right', link: rightRegistrationLink, key: 'right' },
].map(({ label, link, key }) => (
  <div
    key={key}
    className="bg-gradient-to-r from-blue-500 to-indigo-800 text-white px-3 py-2 rounded-md shadow flex items-center justify-between gap-2 text-xs"
  >
    {/* Link Section */}
    <div className="flex items-center gap-2 truncate">
      <span className="font-semibold">{label}:</span>
      <span className="opacity-90 truncate max-w-[180px] sm:max-w-[260px]">
        {link}
      </span>
    </div>

    {/* Button */}
    <button
      onClick={() => copyLink(key)}
      className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-white flex items-center gap-1 transition text-xs"
    >
      {copied === key ? (
        <>
          <FaCheckCircle className="text-xs" /> Copied
        </>
      ) : (
        <>
          <FaCopy className="text-xs" /> Copy
        </>
      )}
    </button>
  </div>
))}
</div>

      {/* First Row - Team & Package Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { title: 'My Package', value: formatCurrency(stats.myPackage), gradient: 'from-cyan-400 to-teal-500', icon: <FaBriefcase /> ,dollor:'$' },
          { title: 'Direct Team', value: formatCount(stats.directTeam), gradient: 'from-purple-500 to-pink-600', icon: <FaUsers /> },
          { title: 'Left Team', value: formatCount(stats.leftTeam), gradient: 'from-orange-400 to-red-500', icon: <FaShoppingBag /> },
          { title: 'Right Team', value: formatCount(stats.rightTeam), gradient: 'from-lime-400 to-green-500', icon: <FaUser /> },
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

      {/* Second Row - Income & Wallet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        {[
          { title: 'ROI Income', value: formatCurrency(stats.roiIncome), gradient: 'from-amber-400 to-orange-600', icon: <GiTakeMyMoney /> ,dollor:'$' },
          { title: 'Binary Income', value: formatCurrency(stats.binaryIncome), gradient: 'from-blue-600 to-purple-700', icon: <FaSeedling /> ,dollor:'$' },
          { title: 'Total Earning', value: formatCurrency(stats.totalEarning), gradient: 'from-green-400 via-teal-500 to-cyan-600', icon: <FaMoneyBillWave /> ,dollor:'$' },
          { title: 'Total Withdrawal', value: formatCurrency(stats.totalWithdrawal), gradient: 'from-purple-500 to-pink-600', icon: <FaMoneyBillWave /> ,dollor:'$' },
          { title: 'Wallet Balance', value: formatCurrency(stats.walletBalance), gradient: 'from-pink-500 to-purple-700', icon: <FaWallet /> ,dollor:'$' },
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

      {/* Profile Section – ideally also use real data from context / API */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main User Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaUserCircle className="text-blue-600" />
              User Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-600 flex items-center gap-2">
                  <FaUser className="text-blue-500" /> Full Name
                </span>
                <span className="font-semibold">{user?.fullname || dashboardData?.user?.fullname || '—'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-600 flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" /> Email
                </span>
                <span className="font-semibold break-all">{user?.email || dashboardData?.user?.email || '—'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-600 flex items-center gap-2">
                  <FaPhone className="text-blue-500" /> Phone Number
                </span>
                <span className="font-semibold">{dashboardData?.user?.phoneNumber || '—'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-600 flex items-center gap-2">
                  <FaIdCard className="text-blue-500" /> CRN / Sponsor ID
                </span>
                <span className="font-semibold">{dashboardData?.user?.sponcerId || user?.crnNo || crnNo || '—'}</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* You can add more profile fields here if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;