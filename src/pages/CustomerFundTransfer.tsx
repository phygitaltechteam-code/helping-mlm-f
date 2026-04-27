/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { api, unAuthenticatedApi } from '@/utils/axios';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import toast from 'react-hot-toast';
import { useGetWalletHistory } from '@/lib/react-query/Admin/WalletHistory/wallethistory';

const CustomerFundTransfer = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [customerData, setCustomerData] = useState<any>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const methods = useForm();
  const { handleSubmit, watch, setValue, reset } = methods;
  const crnNo = watch('crnNo');
  const amount = watch('amount');

  const { data: walletHistory } = useGetWalletHistory();

  console.log('Wallet History:', walletHistory);

  // Set customer name in form when it changes
  useEffect(() => {
    if (customerName && customerName !== 'Invalid ID') {
      setValue('customerNameDisplay', customerName);
    }
  }, [customerName, setValue]);

  // Effect to check CRN and get customer name
  useEffect(() => {
    const checkCRN = async () => {
      if (crnNo && crnNo.length > 8) {
        setIsChecking(true);
        setIsVerified(false);
        try {
          const response = await unAuthenticatedApi.get(
            `/customerName/${crnNo}`,
          );
          console.log('Customer Response:', response.data);

          if (response.data?.data?.name) {
            setCustomerName(response.data.data.name);
            setCustomerData(response.data.data);
            setIsVerified(true);

            if (response.data.data.email) {
              setUserEmail(response.data.data.email);
            } else {
              setUserEmail('No email found');
            }
            toast.success('Customer verified successfully');
          } else {
            setCustomerName('Invalid ID');
            setCustomerData(null);
            setUserEmail('');
            setIsVerified(false);
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
          setCustomerName('Invalid ID');
          setCustomerData(null);
          setUserEmail('');
          setIsVerified(false);
          toast.error('Failed to verify customer');
        } finally {
          setIsChecking(false);
        }
      } else {
        setCustomerName('');
        setCustomerData(null);
        setUserEmail('');
        setIsVerified(false);
      }
    };

    const timeoutId = setTimeout(checkCRN, 500);
    return () => clearTimeout(timeoutId);
  }, [crnNo]);

  // Handle fund transfer submission - Direct call without OTP
  const handleFundTransfer = async (data: any) => {
    // Validate amount
    if (!data.amount || data.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Validate customer is verified
    if (!isVerified || !customerData) {
      toast.error('Please verify customer first');
      return;
    }

    setIsTransferring(true);
    try {
      // Prepare payload for customer/transfer API
      const transferPayload = {
        crnNo: data.crnNo,
        amount: Number(data.amount),
        email: userEmail,
        // Add any additional required fields here
        // note: 'description' or 'remarks' might be needed
      };

      console.log('Transfer Payload:', transferPayload);

      // Direct transfer without OTP
      const response = await api.post('/customers/transafer', transferPayload);

      console.log('Transfer Response:', response.data);

      // Check if the response is successful
      if (response.data?.status === true || response.data?.success === true || response.data) {
        toast.success(response.data.message || 'Fund transferred successfully');

        // Reset form after successful transfer
        reset();
        setCustomerName('');
        setCustomerData(null);
        setUserEmail('');
        setIsVerified(false);
      } else {
        toast.error(response.data?.message || 'Transfer failed');
      }
    } catch (error: any) {
      console.error('Error transferring fund:', error);
      let errorMessage = 'Failed to transfer fund';

      if (error.response?.data) {
        console.log('Error response:', error.response.data);
        if (error.response.data.errors) {
          const validationErrors = error.response.data.errors;
          if (Array.isArray(validationErrors) && validationErrors.length > 0) {
            errorMessage = validationErrors[0].message || errorMessage;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsTransferring(false);
    }
  };

  // Check if form is ready for submission
  const isReadyToTransfer = isVerified && amount && Number(amount) > 0;

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Fund Transfer</h1>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFundTransfer)} className="space-y-6">
          {/* Customer Verification Section */}
          <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
            <h2 className="mb-4 text-lg font-semibold text-gray-700 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600">
                1
              </span>
              Customer Verification
              {isVerified && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* CRN Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  CRN Number <span className="text-red-500">*</span>
                </label>
                <GenericInputField
                  name="crnNo"
                  placeholder="Enter CRN Number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {isChecking && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                    Checking customer...
                  </div>
                )}
              </div>

              {/* Customer Info Display */}
              {customerName && customerName !== 'Invalid ID' && (
                <div className="space-y-3 rounded-lg bg-gray-50 ">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Customer Name</label>
                    <GenericInputField
                      name="customerNameDisplay"
                      disabled={true}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700"
                    />
                  </div>
                  
                  {customerData && (
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Email</p>
                        <p className="font-medium text-gray-700">{userEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Balance</p>
                        <p className="font-medium text-green-600">
                          ${customerData.totalEpin?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {customerName === 'Invalid ID' && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                  <p className="font-medium">Invalid CRN Number</p>
                  <p className="text-xs text-red-500 mt-1">Please check and try again.</p>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Details Section - Only shown when customer is verified */}
          {isVerified && (
            <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
              <h2 className="mb-4 text-lg font-semibold text-gray-700 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-600">
                  2
                </span>
                Transfer Details
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Amount Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Transfer Amount ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <GenericInputField
                      name="amount"
                      placeholder="Enter amount"
                      type="number"
                      min="1"
                      required
                      className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  {customerData?.totalEpin && Number(amount) > customerData.totalEpin && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Insufficient balance
                    </p>
                  )}
                </div>

              
              </div>

              {/* Transfer Summary */}
              {isVerified && amount && Number(amount) > 0 && (
                <div className="mt-6 rounded-lg bg-blue-50 p-4 border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Transfer Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600">From</p>
                      <p className="font-medium text-gray-700">{customerName}</p>
                      <p className="text-xs text-gray-500">CRN: {crnNo}</p>
                    </div>
                    <div>
                      <p className="text-blue-600">Amount</p>
                      <p className="font-medium text-green-600 text-lg">
                        ${Number(amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <GenericButton
                  type="submit"
                  disabled={!isReadyToTransfer || isTransferring || (customerData?.totalEpin && Number(amount) > customerData.totalEpin)}
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                    isReadyToTransfer && !isTransferring
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isTransferring ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Transfer Fund'
                  )}
                </GenericButton>
              </div>
            </div>
          )}

          {/* No Email Warning */}
          {isVerified && (!userEmail || userEmail === 'No email found') && (
            <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">Email Not Found</p>
                  <p className="text-sm text-yellow-700">
                    No email found for this customer. Please contact support to update customer email.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default CustomerFundTransfer;