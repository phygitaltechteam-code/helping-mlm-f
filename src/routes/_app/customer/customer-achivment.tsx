import { AchivementTable } from '@/pages/customer/AchivementTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/customer/customer-achivment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AchivementTable/>
}
