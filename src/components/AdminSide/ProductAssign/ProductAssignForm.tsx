/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import ProductCards from './ProductCards';
import { useAssignProducts } from '@/lib/react-query/Admin/Product/assignProduct';
import { useGetAllProducts } from '@/lib/react-query/Admin/Product/products';
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

    const { handleSubmit, watch, reset } = methods;
    const crnNo = watch('crnNo');

    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    const { mutateAsync, isPending } = useAssignProducts();

    // ✅ Fetch products automatically
    const { data, isLoading, error } = useGetAllProducts();

    // ✅ Debug logs for API
    useEffect(() => {
        console.log('🔥 RAW API DATA:', data);
        console.log('⏳ Loading:', isLoading);
        console.log('❌ Error:', error);
    }, [data, isLoading, error]);

    // ✅ Handle different API structures safely
    const products: any[] =
        (data as any)?.data?.products ||
        (data as any)?.data ||
        (data as any) ||
        [];

    console.log('✅ FINAL PRODUCTS ARRAY:', products);

    // ✅ Select / Unselect
    const handleSelect = (id: string) => {
        console.log('🟢 CLICKED PRODUCT ID:', id);

        setSelectedProducts((prev) => {
            const updated = prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id];

            console.log('📦 SELECTED PRODUCTS:', updated);
            return updated;
        });
    };

    // ✅ Submit
    const onSubmit = async () => {
        console.log('🚀 SUBMIT CLICKED');

        if (!crnNo) {
            alert('Enter CRN first');
            return;
        }

        if (selectedProducts.length === 0) {
            alert('Select at least one product');
            return;
        }

        const payload = {
            crnNo,
            productIds: selectedProducts,
        };

        console.log('📤 FINAL PAYLOAD:', payload);

        try {
            const res = await mutateAsync(payload);
            console.log('✅ ASSIGN RESPONSE:', res);

            // ✅ SUCCESS MESSAGE
            toast.success('Products assigned successfully 🎉');

            // Reset
            setSelectedProducts([]);
            reset();
        } catch (err: any) {
            console.error('❌ FULL ERROR:', err);

            console.log('❌ ERROR RESPONSE:', err?.response);
            console.log('❌ ERROR DATA:', err?.response?.data);

            toast.error(err?.response?.data?.message || 'Failed to assign products ❌');
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 bg-white p-6"
            >
                <h1 className="text-lg font-semibold">Assign Products</h1>

                {/* CRN */}
                <GenericInputField
                    name="crnNo"
                    label="CRN No"
                    placeholder="Enter CRN"
                />

                {/* LOADING */}
                {isLoading && <p className="text-gray-500">Loading products...</p>}

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
                        disabled={isPending}
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