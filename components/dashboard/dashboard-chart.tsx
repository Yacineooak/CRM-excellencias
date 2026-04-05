"use client";

import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";

import { Card } from "@/components/ui/card";
import { focusBreakdown, throughputData } from "@/lib/mock-data";

export function DashboardChart() {
  return (
    <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_380px]">
      <Card className="p-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Task throughput</p>
          <h3 className="mt-2 text-2xl font-semibold">Delivery performance over six weeks</h3>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={throughputData}>
              <defs>
                <linearGradient id="completedFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4ab5b8" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#4ab5b8" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid opacity={0.12} strokeDasharray="4 4" vertical={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: "1px solid rgba(74,181,184,0.18)",
                  backgroundColor: "rgba(10,16,19,0.9)",
                }}
              />
              <Area
                dataKey="completed"
                fill="url(#completedFill)"
                stroke="#4ab5b8"
                strokeWidth={3}
                type="monotone"
              />
              <Area
                dataKey="active"
                fill="transparent"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Focus distribution</p>
          <h3 className="mt-2 text-2xl font-semibold">How the team is spending time</h3>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={focusBreakdown}
                dataKey="value"
                innerRadius={64}
                outerRadius={92}
                paddingAngle={6}
              >
                {focusBreakdown.map((item, index) => (
                  <Cell
                    fill={["#4ab5b8", "#8fd9db", "#1f7072", "#d9f3f4"][index]}
                    key={item.name}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 18,
                  border: "1px solid rgba(74,181,184,0.18)",
                  backgroundColor: "rgba(10,16,19,0.9)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-3">
          {focusBreakdown.map((item) => (
            <div className="flex items-center justify-between text-sm" key={item.name}>
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
