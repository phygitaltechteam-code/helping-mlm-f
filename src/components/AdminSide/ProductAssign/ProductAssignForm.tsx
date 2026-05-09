/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import ProductCards from './ProductCards';
import { useAssignProducts } from '@/lib/react-query/Admin/Product/assignProduct';
import { useGetAllProducts } from '@/lib/react-query/Admin/Product/products';
// import { useGetCustomerEpins, useGetData } from '@/lib/react-query/Admin/Epin/epin';
import { useGetData } from '@/lib/react-query/Admin/Epin/epin';
import toast from 'react-hot-toast';

type FormValues = {
  crnNo: string;
};

const ProductAssignForm: React.FC = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      crnNo: '',
    },
  });

//   const customerData = (dataaaa as any)?.data || null;

// const customerName = customerData?.name || '';
// const isValidCustomer = !!customerData?.MLMData?.crnNo;

  const { handleSubmit, watch, reset } = methods;
const crnNo = watch('crnNo');

const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

const { mutateAsync, isPending } = useAssignProducts();

const { data, isLoading, error } = useGetAllProducts();

// ✅ FIRST: hook
const { data: dataaaa, isLoading: isCustomerLoading } = useGetData(crnNo);

// ✅ THEN: use data
const customerData = dataaaa || null;

const customerName = customerData?.name || '';
const isValidCustomer = !!customerData?.MLMData?.crnNo;
console.log("api ressss",dataaaa)

  // useEffect(() => {
  //   if (crnNo) {
  //     refetch()
  //   }
  // }, [crnNo])
  // PRODUCTS
  const products: any[] =
    (data as any)?.data?.products ||
    (data as any)?.data ||
    (data as any) ||
    [];

  // EPIN DATA NORMALIZATION
  // const epins = Array.isArray(epinData)
  //   ? epinData
  //   : (epinData as any)?.data || [];

  // // FIND CUSTOMER BY CRN
  // const matched = epins.find(
  //   (item: any) => item?.customer?.crnNo === crnNo
  // );

  // const customer = matched?.customer || null;
  // const customerName = customer?.user?.fullname || '';

  // const isValidCustomer = !!customer?.crnNo && !!customer?.user?.fullname;

  // SELECT PRODUCT (ONLY ONE)
  const handleSelect = (product: any) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists ? [] : [product];
    });
  };

  // SUBMIT
  const onSubmit = async () => {
    if (!isValidCustomer) {
      toast.error('No customer found for this CRN');
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error('Select a product');
      return;
    }

    const selected = selectedProducts[0];

    const payload = {
      crnNo,
      productId: selected.id,
      price: selected.discountedPrice,
    };

    try {
      await mutateAsync(payload);

      toast.success('Products assigned successfully');

      setSelectedProducts([]);
      reset();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Failed to assign products'
      );
    }
  };

  const isFormValid =
    !!crnNo && isValidCustomer && selectedProducts.length > 0;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6"
      >
        <h1 className="text-lg font-semibold">Assign Products</h1>

        {/* CRN INPUT */}
        <GenericInputField
          name="crnNo"
          label="CRN No"
          placeholder="Enter CRN"
        />

        {/* CUSTOMER STATUS */}
        {/* CUSTOMER STATUS */}

{crnNo && isCustomerLoading && (
  <p className="text-gray-500 text-sm">
    Fetching customer...
  </p>
)}

{crnNo && !isCustomerLoading && !isValidCustomer && (
  <p className="text-red-500 text-sm">
    No customer found
  </p>
)}

{isValidCustomer && (
  <p className="text-green-600 text-sm">
    Customer Name: {customerName}
  </p>
)}

        {/* LOADING */}
        {isLoading && (
          <p className="text-gray-500">Loading products...</p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-500">Failed to load products</p>
        )}

        {/* EMPTY */}
        {!isLoading && products.length === 0 && (
          <p className="text-gray-400">No products found</p>
        )}

        {/* PRODUCTS */}
        {products.length > 0 && (
          <ProductCards
            products={products}
            selected={selectedProducts}
            onSelect={handleSelect}
          />
        )}

        {/* SUBMIT */}
        <div className="text-right">
          <GenericButton
            type="submit"
            disabled={isPending || !isFormValid}
            className="bg-blue-600 text-white px-4 py-2"
          >
            {isPending ? 'Submitting...' : 'Submit'}
          </GenericButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductAssignForm;