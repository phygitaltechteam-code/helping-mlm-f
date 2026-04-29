// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/_app/admin/_product/approvedepin')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/_app/admin/_product/approvedepin"!</div>
// }


import EpinApproval from '@/components/AdminSide/E-pin/EpinApproval';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/admin/_product/approvedepin')({
  component: EpinApproval,
});