import { createFileRoute } from '@tanstack/react-router'
import MyInvoice from '@/pages/MyInvoice';

export const Route = createFileRoute('/_app/customer/myInvoice')({
  component: () => <MyInvoice />,
})


