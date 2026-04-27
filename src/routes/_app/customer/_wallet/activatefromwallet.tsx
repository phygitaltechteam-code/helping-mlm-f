/* eslint-disable */
import {createFileRoute} from '@tanstack/react-router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, unAuthenticatedApi} from '@/utils/axios';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import toast from 'react-hot-toast';

export const Route = createFileRoute(
  '/_app/customer/_wallet/activatefromwallet',
)({
  component: ActivateFromWallet,
});

function ActivateFromWallet() {
  const methods = useForm();
  const customerId = methods.watch('customerId');

  const queryClient = useQueryClient();

  const [customerName, setCustomerName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [error, setError] = useState('');

  /* -------------------- GET WALLET BALANCE -------------------- */
  const {data, isPending} = useQuery({
    queryKey: ['walletBalance'],
    queryFn: async () => {
      const res = await api.get('/customers/wallet');
      return res.data;
    },
  });

  const {mutateAsync: activateEpin} = useMutation({
    mutationFn: async ({crnNo, price}: {crnNo: string; price: number}) => {
      const res = await api.post('/customers/epin/directActive', {
        crnNo,
        price,
      });
      return res.data;
    },
    onSuccess: () => {
        toast.success('E-Pin activated successfully');
      queryClient.invalidateQueries({queryKey: ['walletBalance']});
    },
    onError: (error) => {
        toast.error(error?.response?.data?.message);
    }
  });

  const walletBalance = data?.amount ?? 0;

  /* -------------------- AUTO VERIFY CUSTOMER -------------------- */
  useEffect(() => {
    const verifyCustomer = async () => {
      if (!customerId || customerId.length <= 8) {
        setCustomerName('');
        return;
      }

      setIsChecking(true);

      try {
        const response = await unAuthenticatedApi.get(
          `/customerName/${customerId}`,
        );

        const customerData = response?.data?.data;

        if (customerData?.name) {
          setCustomerName(customerData.name);
        } else {
          setCustomerName('Invalid ID');
        }
      } catch (err) {
        setCustomerName('Invalid ID');
      } finally {
        setIsChecking(false);
      }
    };

    const timeout = setTimeout(verifyCustomer, 500);
    return () => clearTimeout(timeout);
  }, [customerId]);

  /* -------------------- HANDLE SUBMIT -------------------- */
  const handleSubmit = () => {
    if (!customerId || customerName === 'Invalid ID') {
      setError('Enter valid customer ID');
      return;
    }

    if (!selectedPrice) {
      setError('Please select package');
      return;
    }

    const price = Number(selectedPrice);

    if (price > walletBalance) {
      setError('Insufficient wallet balance');
      return;
    }

    setError('');
    activateEpin({
      crnNo: customerId,
      price,
    });
    console.log({
      customerId,
      price,
    });
  };

  if (isPending) return <div>Loading...</div>;

  return (
    <FormProvider {...methods}>
      <div className="dark:bg-gray-800 mx-auto max-w-md rounded-lg bg-white p-6 shadow-default">
        <h1 className="mb-4 text-xl font-bold">Activate From Wallet</h1>

        {/* Wallet Balance */}
        <div className="mb-4">
          <p className="text-gray-500 text-sm">Wallet Balance</p>
          <p className="text-2xl font-semibold">{walletBalance} $</p>
        </div>

        {/* Customer ID */}
        <div className="mb-4">
          <GenericInputField
            name="customerId"
            label="Customer ID"
            placeholder="Enter Customer ID"
            required
          />

          {customerName && (
            <div className="bg-gray-100 mt-2 rounded p-2">
              Customer Name: <strong>{customerName}</strong>
              {isChecking && (
                <span className="text-gray-500 ml-2">Checking...</span>
              )}
            </div>
          )}
        </div>

        {/* Package Selection */}
        <div className="mb-4">
          <GenericDropdown
            label="Select Package"
            name="package"
            options={[
              {label: '25 $', value: '25'},
              {label: '50 $', value: '50'},
              {label: '100 $', value: '100'},
            ]}
            value={selectedPrice}
            onChange={(val: string) => setSelectedPrice(val)}
          />
        </div>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <GenericButton onClick={handleSubmit} className="w-full">
          Activate
        </GenericButton>
      </div>
    </FormProvider>
  );
}
