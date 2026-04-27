import {api} from '@/utils/axios';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {createFileRoute} from '@tanstack/react-router';
import React, {useMemo, useState} from 'react';

export const Route = createFileRoute('/_app/customer/_wallet/walletepin')({
  component: WalletEpin,
});

function WalletEpin() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [count, setCount] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  /* -------------------- GET WALLET DATA -------------------- */
  const {data, isPending} = useQuery({
    queryKey: ['walletPin'],
    queryFn: async () => {
      const res = await api.get('/customers/wallet');
      return res.data;
    },
  });

  const walletBalance = data?.amount ?? 0;

  /* -------------------- BUY EPIN MUTATION -------------------- */
  const {mutateAsync, isPending: isSaving} = useMutation({
    mutationFn: async ({amount, count}: {amount: number; count: number}) => {
      return await api.post('/customers/epin/direct', {
        price: amount,
        count,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['walletPin']});
      setSelectedPackage(null);
      setCount('');
    },
  });

  /* -------------------- CALCULATE TOTAL -------------------- */
  const totalAmount = useMemo(() => {
    if (!selectedPackage || !count) return 0;
    return selectedPackage * Number(count);
  }, [selectedPackage, count]);

  /* -------------------- HANDLE SUBMIT -------------------- */
  const handleSubmit = async () => {
    if (!selectedPackage) {
      setError('Please select a package');
      return;
    }

    if (!count || isNaN(Number(count)) || Number(count) <= 0) {
      setError('Enter valid count');
      return;
    }

    if (totalAmount > walletBalance) {
      setError('Insufficient wallet balance');
      return;
    }

    try {
      setError('');

      await mutateAsync({
        amount: selectedPackage,
        count: Number(count),
      });
    } catch (err) {
      setError('Failed to purchase E-Pin');
    }
  };

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="dark:bg-gray-800 mx-auto max-w-md rounded-lg bg-white p-6 shadow-default">
      <h1 className="mb-4 text-xl font-bold">Buy E-Pin</h1>

      {/* Wallet Balance */}
      <div className="mb-4">
        <p className="text-gray-500 text-sm">Wallet Balance</p>
        <p className="text-2xl font-semibold">{walletBalance} $</p>
      </div>

      {/* Package Selection */}
      <div className="mb-4">
        <label className="text-gray-500 text-sm">Select Package</label>
        <div className="mt-2 flex gap-3">
          {[25, 50, 100].map((pkg) => (
            <button
              key={pkg}
              type="button"
              onClick={() => setSelectedPackage(pkg)}
              className={`rounded-md border px-4 py-2 transition ${
                selectedPackage === pkg
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100 bg-transparent'
              }`}
            >
              {pkg} $
            </button>
          ))}
        </div>
      </div>

      {/* Count Input */}
      <div className="mb-4">
        <label className="text-gray-500 text-sm">Count</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="Enter quantity"
          className="dark:bg-gray-700 mt-1 w-full rounded-md border p-2"
        />
      </div>

      {/* Total Display */}
      <div className="mb-3">
        <p className="text-gray-500 text-sm">Total Amount</p>
        <p className="text-lg font-semibold">{totalAmount} $</p>
      </div>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      <GenericButton
        onClick={handleSubmit}
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? 'Processing...' : 'Buy E-Pin'}
      </GenericButton>
    </div>
  );
}
