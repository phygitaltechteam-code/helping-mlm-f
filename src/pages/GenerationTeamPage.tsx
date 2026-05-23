/* eslint-disable */
import GenericTable from '@/components/Forms/Table/GenericTable';
import { useGetNetwotkDownlineTreeList } from '@/lib/react-query/network';
import { Column } from '@/types';
import React, { useEffect, useMemo, useState } from 'react';
import { getCustomerRank } from '@/lib/react-query/Customer/ranking';

type Data = {
  name: string;
  crnNo: string;
  joinDate: string;
  generation: number;
  status: string;
  rank: string;
};

// ─── Rank Badge Cell ─────────────────────────────────────────────────────────
const RankCell = ({ value }: { value: string }) => {
  const rankColors: Record<string, { bg: string; text: string }> = {
    'Crown Ambassador': { bg: 'linear-gradient(135deg,#7c3aed,#ec4899)', text: '#fff' },
    'Crown Diamond': { bg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', text: '#fff' },
    'Royal Diamond': { bg: 'linear-gradient(135deg,#134e4a,#0d9488)', text: '#fff' },
    'Blue Diamond': { bg: 'linear-gradient(135deg,#1d4ed8,#60a5fa)', text: '#fff' },
    'Diamond': { bg: 'linear-gradient(135deg,#0ea5e9,#e0f2fe)', text: '#0c4a6e' },
    'Emerald': { bg: 'linear-gradient(135deg,#065f46,#10b981)', text: '#fff' },
    'Sapphire': { bg: 'linear-gradient(135deg,#1e3a8a,#2563eb)', text: '#fff' },
    'Ruby': { bg: 'linear-gradient(135deg,#7f1d1d,#dc2626)', text: '#fff' },
    'Pearl': { bg: 'linear-gradient(135deg,#e2e8f0,#f8fafc)', text: '#334155' },
    'Platinum': { bg: 'linear-gradient(135deg,#374151,#d1d5db)', text: '#fff' },
    'Gold': { bg: 'linear-gradient(135deg,#92400e,#f59e0b)', text: '#78350f' },
    'Silver': { bg: 'linear-gradient(135deg,#475569,#e2e8f0)', text: '#1e293b' },
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

// ─── Date Formatter ──────────────────────────────────────────────────────────
const formatDate = (raw: string | null | undefined): string => {
  if (!raw) return '-';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw; // return as-is if unparseable
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }); // → "23 May 2026"
};

// ─────────────────────────────────────────────────────────────────────────────

const GenerationTeamPage: React.FC = () => {
  const { data: apiResponse, isLoading, error } = useGetNetwotkDownlineTreeList();
  const [selectedGeneration, setSelectedGeneration] = useState<number | 'all'>('all');

  // ── Process API data ──────────────────────────────────────────────────────
  const allData: Data[] = useMemo(() => {
    if (!Array.isArray(apiResponse)) return [];

    // Build sponsorId → direct count map for rank computation
    const directCountMap: Record<string, number> = {};
    apiResponse.forEach((item: any) => {
      if (item.sponsorId) {
        directCountMap[item.sponsorId] = (directCountMap[item.sponsorId] ?? 0) + 1;
      }
    });

    return apiResponse
      .map((item: any) => {
        const crnNo = item.crnNo ?? '';
        const directTeam = directCountMap[crnNo] ?? 0;
        const totalEarning = item.totalEarning ?? item.totalCommission ?? 0;
        const rank = getCustomerRank(directTeam, totalEarning);
        const rankLabel = rank.emoji ? `${rank.emoji} ${rank.label}` : rank.label;

        return {
          crnNo,
          name: item.first_name ?? item.fullname ?? item.name ?? '-',
          generation: item.generation ?? 1,
          status: item.isActive === true || item.isActive === 'Active' ? 'Active' : 'Inactive',
          joinDate: item.joiningDate ?? item.createdAt ?? null,
          rank: rankLabel,
          _joiningDate: item.joiningDate ?? item.createdAt ?? null,
        };
      })
      // Sort: newest joining date first → then higher CRN number as fallback
      .sort((a: any, b: any) => {
        const tA = a._joiningDate ? new Date(a._joiningDate).getTime() : 0;
        const tB = b._joiningDate ? new Date(b._joiningDate).getTime() : 0;
        if (tA !== tB) return tB - tA;
        const numA = parseInt(a.crnNo?.replace(/\D/g, '') || '0', 10);
        const numB = parseInt(b.crnNo?.replace(/\D/g, '') || '0', 10);
        return numB - numA;
      })
      .map((item: any) => ({
        name: item.name,
        crnNo: item.crnNo,
        joinDate: formatDate(item._joiningDate), // formatted: "23 May 2026"
        generation: item.generation,
        status: item.status,
        rank: item.rank,
      }));
  }, [apiResponse]);

  // ── Generation filter ─────────────────────────────────────────────────────
  const generationOptions = useMemo(() => {
    const gens = Array.from(new Set(allData.map((d) => d.generation))).sort((a, b) => a - b);
    return gens;
  }, [allData]);

  const filteredData = useMemo(() => {
    if (selectedGeneration === 'all') return allData;
    return allData.filter((d) => d.generation === selectedGeneration);
  }, [allData, selectedGeneration]);

  // ── Columns ───────────────────────────────────────────────────────────────
  const genColumn: Column<Data>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'CRN No', accessor: 'crnNo' },
    { header: 'Join Date', accessor: 'joinDate' },
    { header: 'Generation', accessor: 'generation' },
    {
      header: 'Rank',
      accessor: 'rank',
      Cell: (value: string) => <RankCell value={value} />,
    },
    {
      header: 'Status',
      accessor: 'status',
      Cell: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            value === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const totalMembers = allData.length;
  const activeMembers = allData.filter((d) => d.status === 'Active').length;

  if (isLoading) {
    return <div className="p-6 text-gray-500 animate-pulse">Loading generation team...</div>;
  }

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Generation Team</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your complete downline referral team members
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-indigo-100 bg-secondary/10 p-4 dark:border-indigo-900 dark:bg-indigo-900/20">
          <p className="text-xs font-medium uppercase text-secondary">Total Members</p>
          <p className="mt-1 text-2xl font-bold text-secondary">{totalMembers}</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-primary/10 p-4 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-xs font-medium uppercase text-primary">Active Members</p>
          <p className="mt-1 text-2xl font-bold text-primary">{activeMembers}</p>
        </div>
      </div>

      {/* Table header + Generation Filter */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">All Generation Team Members</h2>

        {/* Generation Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
            Filter by Generation:
          </label>
          <select
            value={selectedGeneration}
            onChange={(e) =>
              setSelectedGeneration(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-boxdark text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Generations</option>
            {generationOptions.map((gen) => (
              <option key={gen} value={gen}>
                Generation {gen}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm dark:bg-boxdark">
        {filteredData.length === 0 ? (
          <p className="p-6 text-gray-500">
            {allData.length === 0 ? 'No members found.' : 'No members for this generation.'}
          </p>
        ) : (
          <GenericTable columns={genColumn} data={filteredData} searchAble />
        )}
      </div>
    </div>
  );
};

export default GenerationTeamPage;
