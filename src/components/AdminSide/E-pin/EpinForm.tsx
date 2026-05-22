/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {useForm, FormProvider, Controller} from 'react-hook-form';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useCreateCustomerEPin} from '@/lib/react-query/Admin/Epin/epin';
import {unAuthenticatedApi} from '@/utils/axios';

export const epinCustomerSchema = z.object({
  Count: z.coerce.number().min(1, 'E-Pin Count is required'),
  price: z.coerce.number().min(1, 'Price is required'),
  crnNo: z.string().min(1, 'CRN is required'),
});

type FormValues = z.infer<typeof epinCustomerSchema>;

const EpinForm: React.FC = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(epinCustomerSchema),
    defaultValues: {
      Count: 0,
      price: undefined,
      crnNo: '',
    },
  });

  const {handleSubmit, watch, control} = methods;
  const crnNo = watch('crnNo');

  const {mutateAsync: createEPin, isPending} = useCreateCustomerEPin();

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

  const onSubmit = (data: FormValues) => {
    console.log('SUBMIT DATA:', data); // keep this for debug

    createEPin({
      Count: Number(data.Count), // ✅ force number
      price: Number(data.price), // ✅ force number
      crnNo: data.crnNo,
    });

    methods.reset();
    setCustomerName('');
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-8 dark:bg-black"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
          <h1 className="col-span-12 mb-4 text-lg font-semibold">
            Request Fund
          </h1>

          {/* CRN */}
          <div className="col-span-12 md:col-span-6">
            <GenericInputField
              name="crnNo"
              label="CRN No"
              placeholder="Enter CRN No"
            />

            {isChecking && (
              <div className="text-gray-500 mt-2 text-sm">
                Checking customer...
              </div>
            )}

            {/* Customer Name */}
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
                    className="bg-gray-100 w-full rounded border p-2"
                  />
                </div>
              )}

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

          {/* Price */}
          <div className="col-span-12 md:col-span-6">
            <Controller
              name="price"
              control={control}
              render={({field}) => (
                <GenericDropdown
                  label="Price"
                  name="price"
                  // value={field.value}
                  onChange={field.onChange}
                  options={[
                    {label: '2000', value: '2000'},
                    {label: '1500', value: '1500'},
                    {label: '3500', value: '3500'},
                    {label: '1500', value: '1500'}, // kept as requested
                  ]}
                />
              )}
            />
          </div>

          {/* Count */}
          <div className="col-span-12 md:col-span-6">
            <GenericInputField
              name="Count"
              label="E-Pin Count"
              placeholder="Enter E-Pin Count"
            />
          </div>

          {/* Submit */}
          <div className="col-span-12 text-right">
            <GenericButton
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white"
            >
              {isPending ? 'Submitting...' : 'Submit'}
            </GenericButton>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default EpinForm;
