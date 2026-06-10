import React, { useEffect, useState } from 'react';
import GenericTable from '@/components/Forms/Table/GenericTable';
import { useGetCustomer } from '@/lib/react-query/Customer/commision';
import { Column } from '@/types';
import { useNavigate } from '@tanstack/react-router';
import { useFetchCustomerList } from '@/lib/react-query/Admin/Home/adminHome';
import Loader from '@/components/common/Loader';
import { useAdminLogin, useCustomerLogin } from '@/lib/react-query/Auth/auth';
import { QUERY_KEYS } from '@/lib/react-query/QueryKeys';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useAuthContext } from '@/context/AuthContext';
import { getCustomerRank } from '@/lib/react-query/Customer/ranking';

type CustomerData = {
  fullname: string;
  crnNo: string;
  phoneNumber: string;
  email: string;
  sponsorId: string;
  password: string;
  isActive: boolean;
  rank: string;
};

interface DecodedToken extends JwtPayload {
  user: {
    role: string;
  };
}

// ─── Rank Badge Cell ──────────────────────────────────────────────────────────
const RankCell = ({ value }: { value: string }) => {
  const rankColors: Record<string, { bg: string; text: string }> = {
    'Crown Ambassador': { bg: 'linear-gradient(135deg,#7c3aed,#ec4899)', text: '#fff' },
    'Crown Diamond':    { bg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', text: '#fff' },
    'Royal Diamond':    { bg: 'linear-gradient(135deg,#134e4a,#0d9488)', text: '#fff' },
    'Blue Diamond':     { bg: 'linear-gradient(135deg,#1d4ed8,#60a5fa)', text: '#fff' },
    'Diamond':          { bg: 'linear-gradient(135deg,#0ea5e9,#e0f2fe)', text: '#0c4a6e' },
    'Emerald':          { bg: 'linear-gradient(135deg,#065f46,#10b981)', text: '#fff' },
    'Sapphire':         { bg: 'linear-gradient(135deg,#1e3a8a,#2563eb)', text: '#fff' },
    'Ruby':             { bg: 'linear-gradient(135deg,#7f1d1d,#dc2626)', text: '#fff' },
    'Pearl':            { bg: 'linear-gradient(135deg,#e2e8f0,#f8fafc)', text: '#334155' },
    'Platinum':         { bg: 'linear-gradient(135deg,#374151,#d1d5db)', text: '#fff' },
    'Gold':             { bg: 'linear-gradient(135deg,#92400e,#f59e0b)', text: '#78350f' },
    'Silver':           { bg: 'linear-gradient(135deg,#475569,#e2e8f0)', text: '#1e293b' },
  };

  const matchedKey = Object.keys(rankColors).find((key) => value.includes(key));
  const isStarRank = value.includes('Star');

  const style = matchedKey
    ? rankColors[matchedKey]
    : isStarRank
    ? { bg: 'linear-gradient(135deg,#b45309,#fde68a)', text: '#78350f' }
    : { bg: 'linear-gradient(135deg,#374151,#9ca3af)', text: '#fff' };

  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        padding: '3px 10px',
        borderRadius: '999px',
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {value}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const columns: Column<CustomerData>[] = [
  { header: 'Name', accessor: 'fullname' },
  { header: 'Customer ID', accessor: 'crnNo' },
  { header: 'Mobile No', accessor: 'phoneNumber' },
  { header: 'Email', accessor: 'email' },
  {
    header: 'Rank',
    accessor: 'rank',
    Cell: (value: string) => <RankCell value={value} />,
  },
  { header: 'Status', accessor: 'isActive' },
  // {header: 'Sponsor ID', accessor: 'sponsorId'},
  { header: 'Password', accessor: 'password' },
];

const DisplayCustomerList: React.FC = () => {
  const { mutateAsync: signIn } = useAdminLogin();
  const navigate = useNavigate();
  const { data: apiData, isLoading, error } = useFetchCustomerList();
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);

  useEffect(() => {
    if (apiData) {
      console.log('RAW API DATA:', apiData);
      console.log('FIRST CUSTOMER:', apiData?.[0]);

      // Build a sponsorId → direct referral count map from the full list
      // A customer's "directTeam" = how many others have sponsorId === their crnNo
      const directCountMap: Record<string, number> = {};
      apiData.forEach((c: any) => {
        if (c.sponsorId) {
          directCountMap[c.sponsorId] = (directCountMap[c.sponsorId] ?? 0) + 1;
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedData = apiData?.map((customer: any) => {
        const directTeam = directCountMap[customer.crnNo] ?? 0;
        const totalEarning = customer.totalEarning ?? customer.totalCommission ?? 0;
        const rank = getCustomerRank(customer.rank);
        const rankLabel = rank.emoji ? `${rank.emoji} ${rank.label}` : rank.label;
        return {
          id: customer.id,
          createdAt: customer.createdAt,
          fullname: customer.fullname,
          crnNo: customer.crnNo,
          phoneNumber: customer.phoneNumber,
          email: customer.email,
          sponsorId: customer.sponsorId,
          password: customer.password,
          isActive: customer?.isActive ? 'Active' : 'Inactive',
          rank: rankLabel,
          action: 'Edit/Delete',
        };
      });
      console.log('mappedData', mappedData);
      // Sort: newest customers first (by numeric CRN or createdAt)
      const sortedData = mappedData.sort((a: any, b: any) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        const numA = parseInt(a.crnNo?.replace(/\D/g, '') || '0', 10);
        const numB = parseInt(b.crnNo?.replace(/\D/g, '') || '0', 10);
        if (numA !== numB) return numB - numA;
        return (b.crnNo || '').localeCompare(a.crnNo || '');
      });
      setCustomerData(sortedData);
    }
  }, [apiData]);

  const { setUser, setIsAuthenticated, setToken, isAuthenticated, setCustomer } =
    useAuthContext();

  const handleLogin = async (item: any) => {
    try {
      const res = await signIn({ email: item.crnNo });

      setUser(jwtDecode(res.data.token.accessToken || ''));
      setToken(res.data?.token);
      setIsAuthenticated(true);
      localStorage.setItem(QUERY_KEYS.CUSTOMER, JSON.stringify(res.data.customer));
      setCustomer(res.data?.customer);

      const role = res.data?.customer?.role;
      if (role === 'ADMIN') window.location.href = '/dashboard';
      if (role === 'CUSTOMER') window.location.href = '/customer/dashboard';
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item: any) => {
    navigate({ to: `/admin/UpdateCustomer/${item.id}` });
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching customer data.</div>;

  return (
    <div>
      <GenericTable
        title="Customer List"
        data={customerData}
        columns={columns}
        itemsPerPage={15}
        searchAble
        onEdit={handleEdit}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default DisplayCustomerList;
