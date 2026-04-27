import GenerationTeamPage from '@/pages/GenerationTeamPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/customer/_myteam/generation-team')({
  component: GenerationTeamPage,
});
