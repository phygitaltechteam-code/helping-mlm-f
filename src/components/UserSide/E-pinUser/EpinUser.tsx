import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateEpinRequest } from '@/lib/react-query/Customer/epin';
import DisplayEpinUser from './DisplayEpinUser';
import toast from 'react-hot-toast';
import image from '../../../assets/images/header/image.png';

const createEpinRequestSchema = z.object({
  paidAmount: z.string().min(1, { message: 'Paid amount is required' }),
  transactionHash: z.string().min(1, { message: 'Transaction hash is required' }),
  imageFile: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: 'Payment proof is required',
  }),
});

type FormValues = z.infer<typeof createEpinRequestSchema>;

const EpinUser: React.FC = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(createEpinRequestSchema),
  });

  const watchFiles = methods.watch('imageFile');

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
    formData.append('transactionHash', data.transactionHash);
    formData.append('imageFile', selectedFile[0]);

    createEpinRequest(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('E-Pin created successfully');
      methods.reset();
    }
    if (error) {
      toast.error('Error creating E-Pin');
    }
  }, [isSuccess, error, methods]);

  return (
    <FormProvider {...methods}>
      <div className="flex justify-center">
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="w-full max-w-2xl space-y-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-black"
        >
          <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-white">
            Fund Request
          </h1>

          {/* Amount & Transaction Hash - Stacked Full Width */}
          <div className="space-y-6">
            <GenericInputField
              name="paidAmount"
              label="Paid Amount"
              placeholder="Enter paid amount"
              type="number"
            />
            <GenericInputField
              name="transactionHash"
              label="Transaction Hash"
              placeholder="Enter transaction hash"
              type="text"
            />
          </div>

          {/* QR Payment Section */}
          <div className="rounded-xl border border-gray bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-900">
            <img
              src={image}
              alt="PhonePe QR"
              className="mx-auto mb-4 h-70 w-70 rounded-lg border border-gray object-contain"
            />

            {/* Wallet Address */}
            <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <span className="w-full break-all rounded-lg bg-gray px-3 py-2 text-center text-sm font-medium dark:bg-gray-800 sm:w-auto">
                {address}
              </span>
              <button
                type="button"
                onClick={copyAddress}
                className="w-full rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition hover:bg-primary/90 sm:w-auto"
              >
                Copy
              </button>
            </div>
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
          <div className="flex justify-center">
            <GenericButton
              type="submit"
              disabled={isPending}
              className="px-8 py-2"
            >
              {isPending ? 'Processing...' : 'Request Fund'}
            </GenericButton>
          </div>
        </form>
      </div>

      {/* User Requests */}
      <div className="mt-10">
        <DisplayEpinUser />
      </div>
    </FormProvider>
  );
};

export default EpinUser;