import { createFileRoute } from '@tanstack/react-router';
import AchieverCustomerList from '@/components/AdminSide/AchieverCustomerlist/AchieverCustomerList';

export const Route = createFileRoute('/_app/admin/achievementlist')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AchieverCustomerList />;
}