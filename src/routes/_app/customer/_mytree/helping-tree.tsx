import HelpingTreePage from '@/pages/HelpingTreePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/customer/_mytree/helping-tree')({
  component: HelpingTreePage,
});
