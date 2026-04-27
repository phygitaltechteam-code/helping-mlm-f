import GenerationTreePage from '@/pages/GenerationTreePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/customer/_mytree/generation-tree')({
  component: GenerationTreePage,
});
