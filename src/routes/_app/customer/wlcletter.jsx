import WlcmLetter from '@/pages/WlcmLetter'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/customer/wlcletter')({
  component: RouteComponent,
})

function RouteComponent() {
  return <WlcmLetter />
}
