import { ProductApproved } from '@/pages/ProductApproved'
import ProductReport from '@/pages/ProductReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin/productapprove')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProductReport />
}
