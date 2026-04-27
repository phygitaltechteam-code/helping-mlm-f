import HelpingTeamPage from '@/pages/HelpingTeamPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/customer/_myteam/helping-team')({
  component: HelpingTeamPage,
});
