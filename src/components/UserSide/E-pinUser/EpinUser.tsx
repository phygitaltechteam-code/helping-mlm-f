import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericSelectField from '@/components/Forms/Input/GenericSelectField';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateEpinRequest } from '@/lib/react-query/Customer/epin';
import DisplayEpinUser from './DisplayEpinUser';
import toast from 'react-hot-toast';
import image from '../../../assets/images/header/image.png';
import { useGetProduct } from '@/lib/react-query/Admin/Product/products';

const createEpinRequestSchema = z.object({
  paidAmount: z.string().min(1, { message: 'Paid amount is required' }),
  price: z.string().min(1, { message: 'Product is required' }),
  quantity: z.string().min(1, { message: 'Quantity is required' }),
  imageFile: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: 'Payment proof is required',
  }),
  transactionId: z.string().optional(),
});

type FormValues = z.infer<typeof createEpinRequestSchema>;

const EpinUser: React.FC = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(createEpinRequestSchema),
  });

  const [showForm, setShowForm] = useState(false);

  const { data: products, isLoading: isLoadingProducts } = useGetProduct();
  console.log('Fetched products in EpinUser:', products);

  const productOptions = products?.map((product: any) => ({
    value: product.discountedPrice,
    label: product.name,
  })) || [];
  const watchProduct = methods.watch('price');
  const watchFiles = methods.watch('imageFile');

  // Automatically set paidAmount when product changes
  useEffect(() => {
    if (watchProduct && products) {
      const selectedProduct = products.find(
        (p: any) => (p._id || p.id) === watchProduct
      );
      if (selectedProduct) {
        // Use discountedPrice for the paidAmount
        const price = selectedProduct.discountedPrice || selectedProduct.price || 0;
        methods.setValue('paidAmount', price.toString());
      }
    }
  }, [watchProduct, products, methods]);

  const {
    mutate: createEpinRequest,
    isSuccess,
    isPending,
    error,
  } = useCreateEpinRequest();

  const address = '0x286b2A9627a1B33435D448Aa58ce42c88375B657';

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied successfully');
  };

  const onSubmit = (data: FormValues) => {
    const selectedFile =
      watchFiles instanceof FileList ? Array.from(watchFiles) : [];

    const formData = new FormData();
    formData.append('paidAmount', data.paidAmount);
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);
    formData.append('imageFile', selectedFile[0]);
    if (data.transactionId) {
      formData.append('transactionId', data.transactionId);
    }

    createEpinRequest(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('E-Pin created successfully');
      methods.reset();
      setShowForm(false);
    }
    if (error) {
      toast.error('Error creating E-Pin');
    }
  }, [isSuccess, error, methods]);

  return (
    <FormProvider {...methods}>
      <div className="flex justify-end mb-6">
        <GenericButton
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2"
        >
          {showForm ? 'Hide Request Form' : 'Request E-pin'}
        </GenericButton>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-black overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="space-y-6"
            >
              <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-white">
                E-pin Request
              </h1>

              {/* Amount & Transaction Hash - Stacked Full Width */}
              <div className="space-y-6">
                <GenericInputField
                  name="paidAmount"
                  label="Paid Amount"
                  placeholder="Enter paid amount"
                  type="number"
                />
                <GenericSelectField
                  name="price"
                  label="Product"
                  options={productOptions}
                  placeholder="Select product"
                />
                <GenericInputField
                  name="quantity"
                  label="Quantity"
                  placeholder="Enter quantity"
                  type="number"
                />
                <GenericInputField
                  name="transactionId"
                  label="Transaction ID"
                  placeholder="Enter transaction ID"
                />
              </div>

              {/* Upload Proof */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Payment Screenshot
                </label>

                <input
                  type="file"
                  {...methods.register('imageFile')}
                  accept="image/*"
                  className="w-full rounded-lg border border-gray bg-white p-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary/90 dark:border-gray-700 dark:bg-black"
                />

                {methods.formState.errors.imageFile && (
                  <p className="mt-1 text-sm text-red-600">
                    {methods.formState.errors.imageFile.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-center pt-4">
                <GenericButton
                  type="submit"
                  disabled={isPending}
                  className="w-full px-8 py-3"
                >
                  {isPending ? 'Processing...' : 'Request Fund'}
                </GenericButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Requests */}
      <div className="mt-10">
        <DisplayEpinUser />
      </div>
    </FormProvider>
  );
};

export default EpinUser;