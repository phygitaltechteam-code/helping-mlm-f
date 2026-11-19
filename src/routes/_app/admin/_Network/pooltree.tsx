import { createFileRoute } from '@tanstack/react-router'
import PoolTree from '@/pages/poolTree';

export const Route = createFileRoute('/_app/admin/_Network/pooltree')({
  component: PoolTree,
})

