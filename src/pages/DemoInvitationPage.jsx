import { WeddingProvider } from "../context/WeddingContext";
import { DEMO_CONTENT } from "../templates/template-1/data/demoContent";
import InvitationPage from "../templates/template-1/pages/InvitationPage";

export default function DemoInvitationPage() {
  return (
    <WeddingProvider content={DEMO_CONTENT}>
      <InvitationPage />
    </WeddingProvider>
  );
}
