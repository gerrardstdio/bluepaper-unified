import { WeddingProvider } from "../context/WeddingContext";
import { DEMO_CONTENT } from "../templates/the-amora/data/demoContent";
import InvitationPage from "../templates/the-amora/pages/InvitationPage";

export default function DemoInvitationPage() {
  return (
    <WeddingProvider content={DEMO_CONTENT}>
      <InvitationPage />
    </WeddingProvider>
  );
}
