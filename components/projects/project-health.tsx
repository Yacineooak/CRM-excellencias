import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/lib/mock-data";

export function ProjectHealth() {
  return (
    <Card className="p-6">
      <p className="text-sm text-muted-foreground">Portfolio health</p>
      <h3 className="mt-2 text-2xl font-semibold">Project performance snapshot</h3>
      <div className="mt-6 space-y-5">
        {projects.map((project) => (
          <div key={project.id}>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span>{project.name}</span>
              <span className="text-muted-foreground">{project.health}</span>
            </div>
            <Progress
              tone={project.health === "Watch" ? "amber" : "teal"}
              value={project.progress}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
