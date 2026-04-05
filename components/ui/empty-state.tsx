import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: string;
}) {
  return (
    <Card className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-teal/15 p-4 text-teal">
        <Sparkles className="size-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="secondary">{action}</Button>
    </Card>
  );
}
