import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const stats = [
  {
    label: "Active revenue",
    value: "$178.5k",
    change: "+12.4%",
    icon: ArrowUpRight,
  },
  {
    label: "Open projects",
    value: "12",
    change: "3 at risk",
    icon: BriefcaseBusiness,
  },
  {
    label: "Tasks completed",
    value: "31",
    change: "This week",
    icon: CheckCircle2,
  },
  {
    label: "Team capacity",
    value: "84%",
    change: "Healthy load",
    icon: Users2,
  },
];

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card className="relative overflow-hidden" key={stat.label}>
            <div className="absolute right-4 top-4 rounded-full bg-teal/15 p-3 text-teal">
              <Icon className="size-4" />
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <h3 className="mt-6 text-3xl font-semibold">{stat.value}</h3>
            <Badge className="mt-4">{stat.change}</Badge>
          </Card>
        );
      })}
    </div>
  );
}
