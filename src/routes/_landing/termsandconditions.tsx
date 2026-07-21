import TermsAndConditions from '@/components/LandingComponents/TermsAndConditions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/termsandconditions')({
  component: TermsAndConditions,
})

