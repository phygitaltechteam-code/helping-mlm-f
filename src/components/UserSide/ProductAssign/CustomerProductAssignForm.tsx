/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import ProductCards from '@/components/AdminSide/ProductAssign/ProductCards';
import { useAddTopUp } from '@/lib/react-query/Admin/TopUp/topup';
import { useGetAllProducts } from '@/lib/react-query/Admin/Product/products';
import { useGetData } from '@/lib/react-query/Admin/Epin/epin';
import { useGetEpins } from '@/lib/react-query/Customer/epin';
import toast from 'react-hot-toast';

type FormValues = {
  crnNo: string;
  epinNo: string;
};

const CustomerProductAssignForm: React.FC = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      crnNo: '',
      epinNo: '',
    },
  });

  const { handleSubmit, watch, setValue, reset } = methods;
  const crnNo = watch('crnNo');
  const watchedEpinNo = watch('epinNo');

  // Query Hooks
  const { data: customerData, isLoading: isCustomerLoading } = useGetData(crnNo);
  const { data: epinData, isLoading: isEpinsLoading, refetch: refetchEpins } = useGetEpins();
  const { data: productsData, isLoading: isProductsLoading } = useGetAllProducts();
  const { mutateAsync: topUpMutation, isPending: isSubmitting } = useAddTopUp();

  // State Variables
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const customerName = customerData?.name || '';
  const isActive = customerData?.MLMData?.isActive;
  const isValidCustomer = !!customerData?.MLMData?.crnNo;

  // Filter unused E-pins
  const unusedEpins = Array.isArray(epinData)
    ? epinData.filter((epin: any) => !epin.isUsed)
    : [];

  // Derive selectedPrice from selected E-Pin
  const selectedEpin = unusedEpins.find((epin: any) => epin.epinNo === watchedEpinNo);
  const selectedPrice = selectedEpin ? Number(selectedEpin.price) : null;

  // Products matching the selected price category
  const products: any[] =
    (productsData as any)?.data?.products ||
    (productsData as any)?.data ||
    (productsData as any) ||
    [];
  const filteredProducts = selectedPrice
    ? products.filter((product: any) => Number(product.discountedPrice) === selectedPrice)
    : [];

  // Reset product selection if E-Pin selection changes
  useEffect(() => {
    setSelectedProducts([]);
  }, [watchedEpinNo]);

  // Select a product package (only one)
  const handleSelectProduct = (product: any) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists ? [] : [product];
    });
  };

  // Submit Activation
  const onSubmit = async (data: FormValues) => {
    if (!isValidCustomer) {
      toast.error('No customer found for this CRN');
      return;
    }

    if (isActive) {
      toast.error('This customer is already active');
      return;
    }

    if (!data.epinNo) {
      toast.error('Please select an E-Pin');
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error('Please select a product package');
      return;
    }

    const selectedProduct = selectedProducts[0];

    const payload = {
      crnNo: data.crnNo,
      epinNo: data.epinNo,
      productId: selectedProduct.id,
    };

    try {
      await topUpMutation(payload);
      toast.success('Customer activated successfully');
      setSelectedProducts([]);
      reset({ crnNo: '', epinNo: '' });
      refetchEpins();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Failed to activate customer'
      );
    }
  };

  const isFormValid =
    !!crnNo &&
    isValidCustomer &&
    !isActive &&
    !!selectedPrice &&
    !!watchedEpinNo &&
    selectedProducts.length > 0;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-default dark:bg-boxdark"
      >
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white text-xl">
            Customer Activation
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Activate another customer's account using your available E-Pins
          </p>
        </div>

        <div className="p-1 space-y-6">
          {/* TARGET CUSTOMER CRN */}
          <div>
            <GenericInputField
              name="crnNo"
              label="Enter Target Customer CRN"
              placeholder="e.g. CRN12345678"
              required
            />
          </div>

          {/* CUSTOMER VERIFICATION STATUS */}
          {crnNo && (
            <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-meta-4 border border-stroke dark:border-strokedark">
              {isCustomerLoading && (
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                  Verifying customer...
                </p>
              )}

              {crnNo && !isCustomerLoading && !isValidCustomer && (
                <p className="text-red-500 font-medium text-sm">
                  ⚠️ No customer found with this CRN
                </p>
              )}

              {isValidCustomer && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Customer Name:</span>{' '}
                    <strong className="text-black dark:text-white font-semibold">{customerName}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Current Status:</span>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CUSTOMER ALREADY ACTIVE WARNING */}
          {isValidCustomer && isActive && (
            <div className="mt-4 p-4 rounded-lg bg-yellow-50 text-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-500 text-sm border border-yellow-200">
              ⚠️ This customer is already active. No further activation process is required.
            </div>
          )}

          {/* AVAILABLE E-PINS & PRODUCT SELECTION */}
          {isValidCustomer && !isActive && (
            <div className="space-y-6 border-t border-stroke pt-6 dark:border-strokedark">
              <label className="block text-black dark:text-white font-medium text-base">
                Select E-Pin
              </label>

              {isEpinsLoading && (
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                  Loading your E-Pins...
                </p>
              )}

              {!isEpinsLoading && unusedEpins.length === 0 && (
                <div className="p-4 rounded-lg bg-yellow-50 text-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-500 text-sm">
                  ⚠️ You don't have any unused E-Pins available in your wallet.
                </div>
              )}

              {!isEpinsLoading && unusedEpins.length > 0 && (
                <div className="max-w-md">
                  <GenericDropdown
                    label="Select Available E-Pin"
                    name="epinNo"
                    defaultOption="Choose an E-Pin Number"
                    options={unusedEpins.map((epin: any) => ({
                      label: `${epin.epinNo} (₹${epin.price})`,
                      value: epin.epinNo,
                    }))}
                    onChange={(val: string) => setValue('epinNo', val)}
                  />
                </div>
              )}

              {/* Product cards */}
              {watchedEpinNo && (
                <div className="space-y-4">
                  <label className="block text-black dark:text-white font-medium">
                    Select Product Package (Value: ₹{selectedPrice})
                  </label>

                  {isProductsLoading && (
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                      Loading products...
                    </p>
                  )}

                  {!isProductsLoading && filteredProducts.length === 0 && (
                    <p className="text-yellow-600 text-sm italic">
                      No products found matching the price ₹{selectedPrice}
                    </p>
                  )}

                  {!isProductsLoading && filteredProducts.length > 0 && (
                    <ProductCards
                      products={filteredProducts}
                      selected={selectedProducts}
                      onSelect={handleSelectProduct}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end gap-4.5 border-t border-stroke py-4 mt-6 dark:border-strokedark">
            <GenericButton
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="bg-primary hover:bg-opacity-90 text-white font-medium py-2.5 px-6 rounded-md disabled:bg-opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Processing Activation...' : 'Activate Account'}
            </GenericButton>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CustomerProductAssignForm;
