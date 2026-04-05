import { ProjectGrid } from "@/components/projects/project-grid";
import { ProjectHealth } from "@/components/projects/project-health";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        actions={
          <>
            <Button variant="secondary">View calendar</Button>
            <Button>Create project</Button>
          </>
        }
        badge="Portfolio"
        description="Review delivery health, ownership, budgets, and timelines across all client engagements."
        eyebrow="Projects"
        title="Project delivery with visibility built in"
      />
      <ProjectGrid />
      <ProjectHealth />
    </>
  );
}
