
import ProductAssignForm from '@/components/AdminSide/ProductAssign/ProductAssignForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/admin/_product/productassignpage')({
  component: ProductAssignForm,
});