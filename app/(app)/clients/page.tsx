import { ClientList } from "@/components/clients/client-list";
import { ClientProfileCard } from "@/components/clients/client-profile-card";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        actions={<Button>Add client</Button>}
        badge="CRM"
        description="Capture lead context, contact details, project history, and account notes in a premium client workspace."
        eyebrow="Clients"
        title="A CRM designed for relationship-first agencies"
      />
      <ClientProfileCard />
      <ClientList />
    </>
  );
}
