import {api} from '@/utils/axios';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {createFileRoute} from '@tanstack/react-router';
import React, {useState} from 'react';

export const Route = createFileRoute('/_app/customer/_wallet/walletincome')({
  component: WalletIncome,
});

function WalletIncome() {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  /* -------------------- GET WALLET DATA -------------------- */
  const {data, isPending} = useQuery({
    queryKey: ['getwalletaddress'],
    queryFn: async () => {
      const res = await api.get('/customers/wallet');
      return res.data;
    },
  });

  const walletAddress = data?.walletAddress ?? '';
  const walletAmount = data?.amount ?? 0;

  /* -------------------- WITHDRAW MUTATION -------------------- */
  const {mutateAsync, isPending: isSaving} = useMutation({
    mutationFn: async () => {
      return await api.put('/customers/wallet', {
        walletAddress,
        amount: Number(amount),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getwalletaddress']});
      setAmount('');
    },
  });

  /* -------------------- HANDLE SUBMIT -------------------- */
  const handleSubmit = async () => {
    if (!walletAddress) {
      setError('Wallet address not set');
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      setError('Enter valid amount');
      return;
    }

    const numericAmount = Number(amount);

    if (numericAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (numericAmount > walletAmount) {
      setError('Amount exceeds wallet balance');
      return;
    }

    try {
      setError('');
      await mutateAsync();
    } catch (err) {
      setError('Withdrawal failed');
    }
  };

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="dark:bg-gray-800 mx-auto max-w-md rounded-lg bg-white p-6 shadow-default">
      <h1 className="mb-4 text-xl font-bold">Wallet Withdrawal</h1>

      {/* Balance */}
      <div className="mb-4">
        <p className="text-gray-500 text-sm">Available Balance</p>
        <p className="text-2xl font-semibold">{walletAmount} $</p>
      </div>

      {/* Withdraw Amount */}
      <div className="mb-3">
        <label className="text-gray-500 text-sm">Withdraw Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="dark:bg-gray-700 mt-1 w-full rounded-md border p-2"
        />
      </div>

      {/* Wallet Address (Disabled) */}
      <div className="mb-3">
        <label className="text-gray-500 text-sm">Wallet Address</label>
        <input
          type="text"
          value={walletAddress}
          disabled
          className="dark:bg-gray-700 mt-1 w-full rounded-md border p-2 opacity-70"
        />
      </div>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      <GenericButton
        onClick={handleSubmit}
        disabled={isSaving || !walletAddress}
        className="w-full"
      >
        {isSaving ? 'Processing...' : 'Withdraw'}
      </GenericButton>
    </div>
  );
}
