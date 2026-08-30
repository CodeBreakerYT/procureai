"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AIAssistant } from "@/components/assistant/AIAssistant";
import { useAssistantStore } from "@/store/assistant-store";

export default function SettingsPage() {
  const { state, caption, avatar3DEnabled, setAvatar3DEnabled } = useAssistantStore();

  return (
    <AppShell title="Settings" subtitle="Manage your organization, NOVA, and preferences.">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>Basic details used across procurement reports.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Company name</Label>
                  <Input defaultValue="Northwind Industries" />
                </div>
                <div className="grid gap-2">
                  <Label>Default currency</Label>
                  <Input defaultValue="INR (₹)" disabled />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Procurement policy notes</Label>
                <Input defaultValue="Require 2 competing vendors for spend above ₹10,00,000" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NOVA assistant</CardTitle>
              <CardDescription>
                Configure how NOVA interacts with your team. Voice and avatar features connect to a live
                backend in production.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1">
              <SettingRow
                title="Voice responses (text-to-speech)"
                desc="NOVA reads its answers aloud when enabled."
                badge="Requires backend"
              />
              <Separator />
              <SettingRow
                title="Voice input (speech-to-text)"
                desc="Ask NOVA questions using your microphone."
                badge="Requires backend"
              />
              <Separator />
              <SettingRow
                title="3D avatar visualization"
                desc="Show NOVA as a full animated 3D character. Turn off to use the simple orb instead."
                checked={avatar3DEnabled}
                onCheckedChange={setAvatar3DEnabled}
              />
              <Separator />
              <SettingRow title="Proactive insights" desc="Let NOVA surface risks and savings without being asked." defaultChecked />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1">
              <SettingRow title="Email digests" desc="Weekly summary of procurement activity." defaultChecked />
              <Separator />
              <SettingRow title="High-risk alerts" desc="Immediate notification when NOVA detects a high-risk clause." defaultChecked />
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col items-center p-8 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-foreground/40">
            NOVA preview
          </p>
          <AIAssistant state={state} caption={caption} size="md" />
          <p className="mt-5 text-xs text-foreground/45">
            {avatar3DEnabled
              ? "Live preview of NOVA's 3D avatar, reacting to her current state."
              : "3D avatar is off — NOVA falls back to the simple orb. Toggle it back on above."}
          </p>
        </Card>
      </div>
    </AppShell>
  );
}

function SettingRow({
  title,
  desc,
  badge,
  defaultChecked,
  checked,
  onCheckedChange,
}: {
  title: string;
  desc: string;
  badge?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{title}</p>
          {badge && <Badge variant="outline">{badge}</Badge>}
        </div>
        <p className="mt-0.5 text-xs text-foreground/45">{desc}</p>
      </div>
      {onCheckedChange ? (
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      ) : (
        <Switch defaultChecked={defaultChecked} disabled={!!badge} />
      )}
    </div>
  );
}
