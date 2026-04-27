import GenericButton from '@/components/Forms/Buttons/GenericButton';
import {useGetCustomerLevel} from '@/lib/react-query/Customer/home';
import {useCreateWalletData} from '@/lib/react-query/Customer/wallet';
import {useAuthContext} from '@/context/AuthContext';
import {useNavigate} from '@tanstack/react-router';
import {createFileRoute} from '@tanstack/react-router';
import React, {useState} from 'react';

export const Route = createFileRoute('/_app/customer/_wallet/withdraw')({
  component: WithdrawPage,
});

function WithdrawPage() {
  const navigate = useNavigate();
  const {user} = useAuthContext();
  const {data} = useGetCustomerLevel();
  const {mutateAsync, isPending} = useCreateWalletData();

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const walletBalance = data?.amount ?? 0;
  const walletAddress = data?.walletAddress;

  const handleWithdraw = async () => {
    if (!user?.id) {
      setError('User not found');
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

    if (numericAmount > walletBalance) {
      setError('Amount exceeds wallet balance');
      return;
    }
    if (!walletAddress) {
      setError('Set your wallet address first');
      return;
    }

    try {
      setError('');

      await mutateAsync({
        id: user.id,
        amount: numericAmount,
        type: 'WITHDRAW',
      });
    } catch (err) {
      setError('Withdrawal failed');
    }
  };

  return (
    <div className="dark:bg-gray-800 mx-auto max-w-md rounded-lg bg-white p-6 shadow-default">
      <h1 className="mb-4 text-xl font-bold">Withdraw Amount</h1>

      <p className="text-gray-500 mb-4 text-sm">
        Available Balance: {walletBalance} $
      </p>
      {walletAddress && (
        <p className="text-gray-500 mb-2 text-sm">
          Wallet Address: {walletAddress}
        </p>
      )}

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter withdraw amount"
        className="dark:bg-gray-700 mb-3 w-full rounded-md border p-2"
      />

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      <GenericButton
        onClick={handleWithdraw}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? 'Processing...' : 'Confirm Withdraw'}
      </GenericButton>
    </div>
  );
}
