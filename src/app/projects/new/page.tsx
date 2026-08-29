"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIAssistant } from "@/components/assistant/AIAssistant";
import { useAssistantStore } from "@/store/assistant-store";

const CATEGORIES = [
  "Enterprise Software",
  "IT Infrastructure",
  "HR Tech",
  "Cybersecurity",
  "Marketing & Media",
  "Facilities & Operations",
];

export default function NewProjectPage() {
  const router = useRouter();
  const { state, caption, say } = useAssistantStore();
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState(CATEGORIES[0]);
  const [budget, setBudget] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    say(`Great, I've created "${name || "your project"}". Let's define your requirements next.`);
    // Prototype note: real backend would persist and return a new project id.
    // We route into the fully-populated demo project so the workflow keeps moving.
    router.push("/projects/erp-selection/requirements");
  };

  return (
    <AppShell title="New Project" subtitle="Tell NOVA about the procurement you want to run.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Project name</Label>
                <Input
                  id="name"
                  placeholder="ERP Software Selection"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Procurement category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Contract duration (months)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="24"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  id="budget"
                  type="text"
                  placeholder="25,00,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Selecting a new ERP platform to unify finance, inventory, and HR operations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="mt-2 justify-self-start">
                Continue to Requirements <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="flex flex-col items-center p-8 text-center">
            <AIAssistant state={state} caption={caption} size="md" />
            <p className="mt-4 text-sm text-foreground/55">
              I&apos;ll guide you through requirements, proposal uploads, and vendor
              comparison once this project is created.
            </p>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  );
}
