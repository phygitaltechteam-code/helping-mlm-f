import MyNetworkPage from '@/pages/MyNetworkPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/customer/_mynetwork/mynetwork')({
  component: MyNetworkPage,
});
