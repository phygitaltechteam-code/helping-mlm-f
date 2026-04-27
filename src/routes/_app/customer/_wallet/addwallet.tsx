import {api} from '@/utils/axios';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {createFileRoute} from '@tanstack/react-router';
import React, {useEffect, useState} from 'react';

export const Route = createFileRoute('/_app/customer/_wallet/addwallet')({
  component: AddWalletPage,
});

function AddWalletPage() {
  const queryClient = useQueryClient();

  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');

  /* -------------------- GET WALLET ADDRESS -------------------- */
  const {data, isPending} = useQuery({
    queryKey: ['getwalletaddress'],
    queryFn: async () => {
      const res = await api.get('/customers/walletAddress');
      return res.data;
    },
  });

  /* -------------------- SET WALLET ADDRESS -------------------- */
  const {mutateAsync, isPending: isSaving} = useMutation({
    mutationFn: async (address: string) => {
      return await api.put('/customers/walletAddress', {
        walletAddress: address,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getwalletaddress']});
    },
  });

  const existingAddress = data?.wallet?.walletAddress ?? null;

  /* -------------------- AUTO FILL IF EXISTS -------------------- */
  useEffect(() => {
    if (existingAddress) {
      setWalletAddress(existingAddress);
    }
  }, [existingAddress]);

  /* -------------------- HANDLE SAVE -------------------- */
  const handleSave = async () => {
    if (!walletAddress.trim()) {
      setError('Wallet address is required');
      return;
    }

    try {
      setError('');
      await mutateAsync(walletAddress);
    } catch (err) {
      setError('Failed to save wallet address');
    }
  };

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="dark:bg-gray-800 mx-auto max-w-md rounded-lg bg-white p-6 shadow-default">
      <h1 className="mb-4 text-xl font-bold">Wallet Address (BEP-20)</h1>

      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Enter wallet address"
        disabled={!!existingAddress}
        className="dark:bg-gray-700 mb-3 w-full rounded-md border p-2 disabled:opacity-60"
      />

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      <GenericButton
        onClick={handleSave}
        disabled={!!existingAddress || isSaving}
        className="w-full"
      >
        {isSaving ? 'Saving...' : 'Set Wallet Address'}
      </GenericButton>

      {existingAddress && (
        <p className="mt-3 text-sm text-green-800">
          Wallet address already set and cannot be changed.
        </p>
      )}
    </div>
  );
}
