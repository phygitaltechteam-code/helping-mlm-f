/*eslint-disable */
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { unAuthenticatedApi } from '@/utils/axios';
import { useAddRecallEpin } from '@/lib/react-query/Admin/TopUp/topup';
import { useGetCustomerEpins } from '@/lib/react-query/Admin/Epin/epin';
import toast from 'react-hot-toast';

const RecallEpin = () => {
  const methods = useForm();
  const [customerName, setCustomerName] = useState<string>('');
  const [customerData, setCustomerData] = useState<any>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [availableEpins, setAvailableEpins] = useState<any[]>([]);
  const [totalUnusedCount, setTotalUnusedCount] = useState<number>(0);
  const [priceSpecificCount, setPriceSpecificCount] = useState<number>(0);

  const { handleSubmit, watch, setValue } = methods;

  // Watch the CRN and Price fields
  const crnNo = watch('crnNo');
  const selectedPrice = watch('price');

  const { mutateAsync: recallEpin, isPending } = useAddRecallEpin();
  const { data: allCustomerEpins } = useGetCustomerEpins();

  // Set customer name in form when it changes
  useEffect(() => {
    if (
      customerName &&
      customerName !== 'Invalid ID' &&
      customerName !== 'Invalid format'
    ) {
      setValue('customerName', customerName);
    }
  }, [customerName, setValue]);

  // Update available epins when CRN or epins data changes
  useEffect(() => {
    if (crnNo && allCustomerEpins) {
      const epins = Array.isArray(allCustomerEpins) ? allCustomerEpins : (allCustomerEpins as any)?.data || [];
      const customerUnusedEpins = epins.filter(
        (epin: any) => 
          epin.customer?.crnNo === crnNo && 
          !epin.isUsed
      );
      setAvailableEpins(customerUnusedEpins);
      setTotalUnusedCount(customerUnusedEpins.length);
    } else {
      setAvailableEpins([]);
      setTotalUnusedCount(0);
    }
  }, [crnNo, allCustomerEpins]);

  // Update price specific count when price changes
  useEffect(() => {
    if (selectedPrice && availableEpins.length > 0) {
      const filtered = availableEpins.filter(
        (epin: any) => epin.price?.toString() === selectedPrice || epin.price === Number(selectedPrice)
      );
      setPriceSpecificCount(filtered.length);
    } else {
      setPriceSpecificCount(0);
    }
  }, [selectedPrice, availableEpins]);

  // Effect to check CRN and get customer name
  useEffect(() => {
    const checkCRN = async () => {
      if (crnNo && crnNo.length > 8) {
        setIsChecking(true);
        try {
          const response = await unAuthenticatedApi.get(
            `/customerName/${crnNo}`,
          );
          console.log('Customer Response:', response.data);

          // Extract the name from the nested data structure
          if (response.data && response.data.data && response.data.data.name) {
            setCustomerName(response.data.data.name);
            setCustomerData(response.data.data);
            toast.success('Customer verified successfully');
          } else {
            setCustomerName('Invalid format');
            setCustomerData(null);
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
          setCustomerName('Invalid ID');
          setCustomerData(null);
        } finally {
          setIsChecking(false);
        }
      } else {
        setCustomerName('');
        setCustomerData(null);
      }
    };

    // Add a delay to avoid making too many API calls
    const timeoutId = setTimeout(checkCRN, 500);

    return () => clearTimeout(timeoutId);
  }, [crnNo]);

  const onSubmit = (data: any) => {
    if (
      !customerName ||
      customerName === 'Invalid ID' ||
      customerName === 'Invalid format'
    ) {
      toast.error('Please verify customer first');
      return;
    }

    recallEpin({
      crnNo: data.crnNo,
      count: Number(data.count),
      price: Number(data.price),
    });

    // Optionally reset form after submission
    // methods.reset();
    // setCustomerName('');
    // setCustomerData(null);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl p-4 md:p-8 bg-white rounded-lg shadow-sm">
        <h1 className="mb-8 text-2xl font-bold text-gray-800 border-b pb-4">Recall ePIN</h1>

        <div className="mb-6 flex w-full max-w-2xl flex-col gap-4">
          <div className="flex flex-col gap-2">
            <GenericInputField
              name="crnNo"
              label="CRN No"
              placeholder="Enter CRN No"
            />
          </div>

          {/* Show checking indicator */}
          {isChecking && (
            <div className="text-gray-500 text-sm">Checking customer...</div>
          )}

          {/* Show customer name and counts */}
          {customerName &&
            customerName !== 'Invalid ID' &&
            customerName !== 'Invalid format' && (
              <div className="mt-4 space-y-4">
                <GenericInputField
                  name="customerName"
                  label="Customer Name"
                  value={customerName}
                  disabled={true}
                  className="bg-gray-100 cursor-not-allowed"
                />
                <div className="text-sm font-medium text-gray-700 px-1">
                  <p>Total Unused E-pins: <span className="font-bold text-blue-600">{totalUnusedCount}</span></p>
                  {selectedPrice && (
                    <p className="mt-1">Available E-pins at {selectedPrice}: <span className="font-bold text-green-600">{priceSpecificCount}</span></p>
                  )}
                </div>
              </div>
            )}

          {/* Show error message if invalid */}
          {customerName === 'Invalid ID' && (
            <div className="mt-2 rounded bg-red-100 p-2 text-red-600">
              Invalid Customer CRN
            </div>
          )}

          {customerName === 'Invalid format' && (
            <div className="mt-2 rounded bg-yellow-100 p-2 text-yellow-600">
              Unexpected response format
            </div>
          )}
        </div>

        <div className="mb-6 flex w-full max-w-2xl flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <GenericDropdown
                name="price"
                label="Price"
                options={[
                  { label: '2000', value: '2000' },
                  { label: '1500', value: '1500' },
                  { label: '3500', value: '3500' },
                ]}
              />
            </div>
            <div className="flex flex-col gap-2">
              <GenericInputField
                name="count"
                label="Count"
                placeholder="Enter Count"
                type="number"
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <GenericButton
            type="submit"
            className="w-full md:w-auto px-10"
            disabled={
              isPending ||
              !customerName ||
              customerName === 'Invalid ID' ||
              customerName === 'Invalid format'
            }
          >
            {isPending ? 'Submitting...' : 'Submit'}
          </GenericButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default RecallEpin;
