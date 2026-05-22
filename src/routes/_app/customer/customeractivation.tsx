import CustomerProductAssignForm from '@/components/UserSide/ProductAssign/CustomerProductAssignForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/customer/customeractivation')({
  component: CustomerProductAssignForm,
});
