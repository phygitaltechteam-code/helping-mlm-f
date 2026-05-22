import React, { useEffect, useState } from 'react';
import {
  FaUserPlus,
  FaChartLine,
  FaAward,
  FaSitemap,
  FaHandHoldingUsd,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaCopy,
  FaCheckCircle,
  FaNetworkWired,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import { useFetchAdminHome } from '@/lib/react-query/Admin/Home/adminHome';
import Loader from '@/components/common/Loader';
import { FaKey, FaWallet } from 'react-icons/fa6';
import { useAuthContext } from '@/context/AuthContext';

interface StatCardProps {
  amount: string;
  title: string;
  icon: React.ReactNode;
}

const Home: React.FC = () => {
  const { user } = useAuthContext(); // Get user info for the link
  // const [fromDate, setFromDate] = useState<string>('');
  // const [toDate, setToDate] = useState<string>('');
  // const [appliedFrom, setAppliedFrom] = useState<string>('');
  // const [appliedTo, setAppliedTo] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const { data, isSuccess, isError, isPending } = useFetchAdminHome();
  // Generate registration link (same as customer dashboard)
  const fullname = user?.fullname
    ? user.fullname.replace(/\s/g, '_')
    : 'unknown_user';
  const crnNo = user?.crnNo || 'CRN0000000';
  const baseUrl = import.meta.env.VITE_LIVE_URL || 'https://happilylife.online';
  const registrationLink = `${baseUrl}/register/${fullname}/${crnNo}`;
  const shortRegistrationLink = `.../register/${fullname}/${crnNo}`;

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const copyLink = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const [statsData, setStatsData] = useState<StatCardProps[]>([]);

  useEffect(() => {
    if (isSuccess) {
      console.log('API DATA:', data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess && data) {
      // Sales
      const totalSales = data?.totalBuisness || 0;

      // Team — customerCount is total; active = total - inActive
      const totalTeam = data?.customerCount || 0;
      const inactiveTeam = data?.inActive || 0;
      const activeTeam = totalTeam - inactiveTeam;

      // Income & Commission
      const helpIncomeGivers = data?.autopoolIncome || 0;
      const totalBonusIncomeGivers = data?.bonusIncomeAchivers*1000 || 0;
      const totalGenerationIncomeGivers = data?.genrationIncome || 0;
      const totalCommission = data?.totalCommission || 0;

      // Pins
      const totalPinAlloted = data?.givenEpin || 0;
      const totalPinUsed = data?.usedEpin || 0;

      setStatsData([
        {
          title: 'Total Sales',
          amount: String(totalSales),
          icon: <FaWallet className="text-2xl text-emerald-500" />,
        },
        {
          title: 'Total Team',
          amount: String(totalTeam),
          icon: <FaUsers className="text-2xl text-blue-500" />,
        },
        {
          title: 'Active Team',
          amount: String(activeTeam),
          icon: <FaUserCheck className="text-2xl text-green-500" />,
        },
        {
          title: 'Inactive Team',
          amount: String(inactiveTeam),
          icon: <FaUserTimes className="text-2xl text-red-500" />,
        },
        {
          title: 'Upgrade Income Given',
          amount: String(helpIncomeGivers),
          icon: <FaHandHoldingUsd className="text-2xl text-yellow-500" />,
        },
        {
          title: 'Total Bonus Income Given',
          amount: String(totalBonusIncomeGivers),
          icon: <FaAward className="text-2xl text-pink-500" />,
        },
        {
          title: 'Total Generation Income Given',
          amount: String(totalGenerationIncomeGivers),
          icon: <FaSitemap className="text-2xl text-indigo-500" />,
        },
        {
          title: 'Total Commission',
          amount: String(totalCommission),
          icon: <FaChartLine className="text-2xl text-teal-500" />,
        },
        {
          title: 'Total Pin Alloted',
          amount: String(totalPinAlloted),
          icon: <FaKey className="text-2xl text-purple-500" />,
        },
        {
          title: 'Total Pin Used',
          amount: String(totalPinUsed),
          icon: <FaKey className="text-2xl text-orange-500" />,
        },
      ]);
    }
  }, [isSuccess, data]);

  // const handleApplyFilter = () => {
  //   setAppliedFrom(fromDate);
  //   setAppliedTo(toDate);
  // };

  // const handleResetFilter = () => {
  //   setFromDate('');
  //   setToDate('');
  //   setAppliedFrom('');
  //   setAppliedTo('');
  // };

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-red-50">
        <p className="text-lg text-red-500">
          Error fetching data. Please try again later.
        </p>
      </div>
    );
  }

  if (isPending) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6"
    >
      <div className="mb-4 flex justify-end">
        <div className="flex flex-col items-end gap-1">

        
        </div>
      </div>

      {/* ===== NEW: Registration Link Section (Same as Customer Dashboard) ===== */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-xl shadow-lg shadow-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm shrink-0">
              <FaNetworkWired className="text-xl md:text-2xl" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-0.5">
                Your Registration Link
              </p>
              <p
                className="font-mono text-sm opacity-95 truncate"
                title={registrationLink}
              >
                {shortRegistrationLink}
              </p>
            </div>
          </div>

          <button
            onClick={copyLink}
            className={`${
              copied
                ? 'bg-white text-secondary'
                : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
            } w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0`}
          >
            {copied ? (
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

      {/* Date Filter */}
      {/* <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleApplyFilter}
          className="rounded-lg bg-secondary px-5 py-2 text-sm font-medium text-white hover:bg-secondary/90 transition-colors"
        >
          Apply
        </button>

        <button
          onClick={handleResetFilter}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>

        {(appliedFrom || appliedTo) && (
          <span className="ml-auto text-xs text-gray-400">
            Showing:{' '}
            <span className="font-medium text-gray-600">
              {appliedFrom || '—'} → {appliedTo || '—'}
            </span>
          </span>
        )}
      </div> */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
          >
            <StatCard
              amount={stat.amount}
              icon={stat.icon}
              title={stat.title}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Home;