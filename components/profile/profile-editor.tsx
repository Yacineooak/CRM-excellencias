import { Camera } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/lib/mock-data";

export function ProfileEditor() {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start gap-5">
        <div className="relative">
          <Avatar alt={currentUser.name} className="size-24" src={currentUser.avatarUrl} />
          <button
            className="absolute bottom-0 right-0 rounded-full bg-teal p-2 text-white shadow-teal"
            type="button"
          >
            <Camera className="size-4" />
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold">{currentUser.name}</h3>
            <Badge>{currentUser.role.replace("_", " ")}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{currentUser.title}</p>
          <p className="text-sm text-muted-foreground">{currentUser.activity}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full name</label>
          <Input defaultValue={currentUser.name} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input defaultValue={currentUser.email} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium">About</label>
        <Textarea defaultValue="Leading delivery systems, client operations, and premium product execution." />
      </div>

      <div className="mt-6 flex justify-end">
        <Button>Save profile</Button>
      </div>
    </Card>
  );
}
