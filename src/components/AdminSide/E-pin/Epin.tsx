/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAGetOtp, useCreateEPin, useCreateCustomerEPin } from '@/lib/react-query/Admin/Epin/epin';
import toast from 'react-hot-toast';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import { epinSchema } from '@/lib/validation/epinSchema';
import { unAuthenticatedApi } from '@/utils/axios';

type FormValues = z.infer<typeof epinSchema>;

export const Epin: React.FC = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(epinSchema),
  });
  const { mutate: createEPin, isPending: isSelfPending } = useCreateEPin();
  const { mutate: createCustomerEPin, isPending: isCustomerPending } = useCreateCustomerEPin();
  const [selectedType, setSelectedType] = useState('');
  const [countValue, setCountValue] = useState('');
  const [customerName, setCustomerName] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const {
    mutate: getOtp,
    isPending: isOtpPending,
    isSuccess: isOtpFetched,
  } = useAGetOtp(); // assumes it uses .mutate
  const [isOtpRequested, setIsOtpRequested] = useState(false);

  const crnNo = methods.watch('crnNo');

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  // 🔍 Check CRN
  useEffect(() => {
    const checkCRN = async () => {
      if (crnNo && crnNo.length > 8) {
        setIsChecking(true);
        try {
          const response = await unAuthenticatedApi.get(
            `/customerName/${crnNo}`,
          );

          if (response.data?.data?.name) {
            setCustomerName(response.data.data.name);
          } else {
            setCustomerName('Invalid format');
          }
        } catch {
          setCustomerName('Invalid ID');
        } finally {
          setIsChecking(false);
        }
      } else {
        setCustomerName('');
      }
    };

    const timeoutId = setTimeout(checkCRN, 500);
    return () => clearTimeout(timeoutId);
  }, [crnNo]);

  console.log('count', countValue);
  console.log('price', selectedType);

  const onSubmit = (data: FormValues) => {
    console.log('dataaa123', data);
    if (data.crnNo && data.crnNo.trim() !== '') {
      createCustomerEPin({
        Count: data.count,
        price: data.price,
        crnNo: data.crnNo,
      }, {
        onSuccess: () => {
          methods.reset();
          setCustomerName('');
          setSelectedType('');
        }
      });
    } else {
      createEPin({
        count: data.count,
        price: data.price,
      }, {
        onSuccess: () => {
          methods.reset();
          setSelectedType('');
        }
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-8 dark:bg-black"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
          <h1 className="col-span-12 mb-4 text-lg font-semibold">E-Pin</h1>

          <div className="col-span-12 md:col-span-6">
            <GenericInputField
              name="count"
              label="Count"
              placeholder="Count"
              onChange={(val: string) => setCountValue(val)}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <GenericDropdown
              label="Price"
              name="price"
              options={[
                { label: '2000', value: '2000' },
                { label: '2500', value: '2500' },
                { label: '3000', value: '3000' },
              ]}
              onChange={handleTypeChange}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <GenericInputField
              name="crnNo"
              label="CRN No (Optional - for Customer E-Pin)"
              placeholder="Enter CRN No"
            />
            {isChecking && (
              <div className="text-gray-500 mt-2 text-sm">
                Checking customer...
              </div>
            )}
            {customerName &&
              customerName !== 'Invalid ID' &&
              customerName !== 'Invalid format' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium">
                    Customer Name
                  </label>
                  <input
                    value={customerName}
                    disabled
                    className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              )}
            {customerName === 'Invalid ID' && (
              <div className="mt-2 rounded bg-red-100 p-2 text-red-600 dark:bg-red-900/50 dark:text-red-200">
                Invalid Customer CRN
              </div>
            )}
            {customerName === 'Invalid format' && (
              <div className="mt-2 rounded bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-200">
                Unexpected response format
              </div>
            )}
          </div>
        </div>

        <GenericButton type="submit">
          {isSelfPending || isCustomerPending ? 'Submitting...' : 'Submit'}
        </GenericButton>
      </form>
    </FormProvider>
  );
};

export default Epin;
