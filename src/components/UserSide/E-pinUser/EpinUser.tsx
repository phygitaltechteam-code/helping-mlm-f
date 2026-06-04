import React, {useEffect, useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericSelectField from '@/components/Forms/Input/GenericSelectField';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useCreateEpinRequest} from '@/lib/react-query/Customer/epin';
import DisplayEpinUser from './DisplayEpinUser';
import toast from 'react-hot-toast';
import {useGetProduct} from '@/lib/react-query/Admin/Product/products';
import {useGetCustomerProfile} from '@/lib/react-query/Admin/profile/profile';
import {
  FaCopy,
  FaCheckCircle,
  FaBuilding,
  FaQrcode,
  FaTimes,
} from 'react-icons/fa';

// Fixed schema - removed duplicate transactionId field
const createEpinRequestSchema = z.object({
  paidAmount: z.string().min(1, {message: 'Paid amount is required'}),
  price: z.string().min(1, {message: 'Product is required'}),
  quantity: z.string().min(1, {message: 'Quantity is required'}),
  transactionId: z
    .string()
    .min(1, {message: 'Transaction ID is required'})
    .regex(/^\d{10}$/, {message: 'Transaction ID must be exactly 10 digits'}),
  imageFile: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: 'Payment proof is required',
  }),
});

type FormValues = z.infer<typeof createEpinRequestSchema>;

const EpinUser: React.FC = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(createEpinRequestSchema),
  });

  const [showForm, setShowForm] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {data: products, isLoading: isLoadingProducts} = useGetProduct();
  const {data: profileData} = useGetCustomerProfile();

  // Static Bank Details
  const bankName = 'AU SMALL FINANCE BANK LIMITED';
  const accountHolder = 'HAPPILY LIFE';
  const bankAccNo = '2602266213999920';
  const bankIFSC = 'AUBL0002662';
  const bankBranch = 'PUNE MUKUND NAGAR';
  const upiId = 'happilylife@aubank';

  const productOptions =
    products?.map((product: any) => ({
      value: product.discountedPrice,
      label: product.name,
    })) || [];

  const watchProduct = methods.watch('price');
  const watchFiles = methods.watch('imageFile');

  // Automatically set paidAmount when product changes
  useEffect(() => {
    if (watchProduct && products) {
      const selectedProduct = products.find(
        (p: any) => (p._id || p.id) === watchProduct,
      );
      if (selectedProduct) {
        const price =
          selectedProduct.discountedPrice || selectedProduct.price || 0;
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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied successfully`);
    setTimeout(() => setCopiedField(null), 2000);
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
      <div className="mb-6 flex justify-end">
        <GenericButton
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2"
        >
          {showForm ? 'Hide Request Form' : 'Request E-pin'}
        </GenericButton>
      </div>

      {/* Modal Popup */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
          <div className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-4 shadow-2xl dark:bg-black">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 absolute right-3 top-3"
            >
              <FaTimes className="h-4 w-4" />
            </button>

            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="space-y-6"
            >
              <h1 className="text-gray-800 text-center text-2xl font-semibold dark:text-white">
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
                  placeholder="Enter 10-digit transaction ID"
                  type="text"
                />
              </div>

              {/* Upload Proof */}
              <div>
                <label className="text-gray-700 dark:text-gray-300 mb-2 block text-sm font-medium">
                  Upload Payment Screenshot
                </label>

                <input
                  type="file"
                  {...methods.register('imageFile')}
                  accept="image/*"
                  className="dark:border-gray-700 w-full rounded-lg border border-gray bg-white p-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary/90 dark:bg-black"
                />

                {methods.formState.errors.imageFile && (
                  <p className="mt-1 text-sm text-red-600">
                    {methods.formState.errors.imageFile.message}
                  </p>
                )}
              </div>

              {/* Right Side - Bank Details & QR Code */}
              <div className="space-y-3">
                {/* Bank Details - Compact */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-stroke p-3">
                  <h2 className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5 text-sm font-semibold">
                    <FaBuilding className="text-xs text-primary" />
                    Bank Details
                  </h2>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bank:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {bankName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">A/C Holder:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {accountHolder}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">A/C No:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {bankAccNo}
                        </span>
                        <button
                          onClick={() => copyToClipboard(bankAccNo, 'A/C No')}
                          className="text-gray-400 hover:text-primary"
                          type="button"
                        >
                          {copiedField === 'A/C No' ? (
                            <FaCheckCircle className="text-xs text-green-500" />
                          ) : (
                            <FaCopy size={10} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">IFSC:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {bankIFSC}
                        </span>
                        <button
                          onClick={() => copyToClipboard(bankIFSC, 'IFSC')}
                          className="text-gray-400 hover:text-primary"
                          type="button"
                        >
                          {copiedField === 'IFSC' ? (
                            <FaCheckCircle className="text-xs text-green-500" />
                          ) : (
                            <FaCopy size={10} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Branch:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {bankBranch}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code - Simple */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-stroke p-3 text-center">
                  <h2 className="text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-center gap-1.5 text-sm font-semibold">
                    <FaQrcode className="text-xs text-primary" />
                    Scan & Pay
                  </h2>

                  {/* UPI ID */}
                  <div className="dark:bg-gray-900 mb-2 flex items-center justify-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm">
                    <span className="text-gray-600 text-xs font-medium">
                      {upiId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(upiId, 'UPI ID')}
                      className="text-gray-400 hover:text-primary"
                      type="button"
                    >
                      {copiedField === 'UPI ID' ? (
                        <FaCheckCircle className="text-xs text-green-500" />
                      ) : (
                        <FaCopy size={10} />
                      )}
                    </button>
                  </div>

                  {/* QR Code Image */}
                  <img
                    src="/upi-qr-code.png"
                    alt="QR Code"
                    className="border-gray-200 mx-auto h-28 w-28 rounded-lg border bg-white p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=happilylife@aubank&pn=HappilyLife&cu=INR';
                    }}
                  />
                  <p className="text-gray-400 mt-1 text-[10px]">
                    Scan with any UPI app
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-full bg-primary py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80 disabled:opacity-50"
                >
                  {isPending ? 'Processing...' : 'Request Fund'}
                </button>
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
