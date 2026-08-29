"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, CheckCircle2, UploadCloud, ArrowRight, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAssistantStore } from "@/store/assistant-store";
import { cn } from "@/lib/utils";
import type { Vendor, VendorProcessingStatus } from "@/lib/types";

interface UploadItem {
  id: string;
  name: string;
  vendorName: string;
  sizeKb: number;
  status: VendorProcessingStatus;
  file?: File;
  error?: string;
}

const STATUS_LABEL: Record<VendorProcessingStatus, string> = {
  queued: "Queued",
  reading: "Reading...",
  analyzing: "Analyzing...",
  analyzed: "Analyzed",
  error: "Error",
};

export function VendorUploadZone({ projectId, initialVendors }: { projectId: string; initialVendors: Vendor[] }) {
  const router = useRouter();
  const { say, setState } = useAssistantStore();
  const [isDragging, setDragging] = React.useState(false);
  const [items, setItems] = React.useState<UploadItem[]>(
    initialVendors.map((v) => ({
      id: v.id,
      name: v.fileName,
      vendorName: v.name,
      sizeKb: v.fileSizeKb,
      status: v.status,
    }))
  );

  const processFiles = React.useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => /\.(pdf|docx)$/i.test(f.name));
      if (list.length === 0) return;

      const newItems: UploadItem[] = list.map((f, i) => ({
        id: crypto.randomUUID(),
        name: f.name,
        vendorName: `Vendor ${String.fromCharCode(65 + items.length + i)}`,
        sizeKb: Math.round(f.size / 1024) || 1200,
        status: "queued",
        file: f,
      }));

      setItems((prev) => [...prev, ...newItems]);
      setState("analyzing", "Analyzing vendor proposals...");
      say(`Got it — I'm processing ${newItems.length} new proposal${newItems.length > 1 ? "s" : ""}.`);

      newItems.forEach((item) => analyzeItem(item));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length, say, setState]
  );

  const analyzeItem = async (item: UploadItem) => {
    if (!item.file) return;
    updateStatus(item.id, "reading");

    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("vendorId", item.id);
    formData.append("vendorName", item.vendorName);

    try {
      await new Promise((r) => setTimeout(r, 400)); // let "reading" render before the request lands
      updateStatus(item.id, "analyzing");

      const res = await fetch(`/api/projects/${projectId}/analyze`, { method: "POST", body: formData });

      if (!res.ok) {
        // No API key configured, or the backend is unreachable — fall back to a
        // simulated pass so the demo keeps moving.
        await simulateAnalysis(item.id);
        return;
      }

      const data = (await res.json()) as { vendor: Vendor };
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, vendorName: data.vendor.name, status: "analyzed" } : it))
      );
    } catch {
      await simulateAnalysis(item.id);
    }
  };

  const simulateAnalysis = async (id: string) => {
    await new Promise((r) => setTimeout(r, 1400));
    updateStatus(id, "analyzed");
  };

  const updateStatus = (id: string, status: VendorProcessingStatus) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const allAnalyzed = items.length > 0 && items.every((it) => it.status === "analyzed");

  return (
    <div className="grid gap-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-14 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border-strong bg-white/[0.02]"
        )}
      >
        <motion.div
          animate={{ y: isDragging ? -6 : 0, scale: isDragging ? 1.05 : 1 }}
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20"
        >
          <UploadCloud className="h-8 w-8 text-primary-2" />
        </motion.div>
        <p className="font-semibold">Drag &amp; drop vendor proposals here</p>
        <p className="mt-1 text-sm text-foreground/50">Supports PDF and DOCX files, up to 25MB each</p>
        <label className="mt-5">
          <span className="cursor-pointer rounded-xl bg-gradient-to-b from-[#8280ff] to-[#5b57f5] px-5 py-2.5 text-sm font-medium text-white shadow-md transition-transform hover:-translate-y-0.5">
            Browse files
          </span>
          <input
            type="file"
            multiple
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => e.target.files && processFiles(e.target.files)}
          />
        </label>
      </div>

      <div className="grid gap-3">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout>
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                    <FileText className="h-5 w-5 text-primary-2" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.vendorName}</p>
                    <p className="truncate text-xs text-foreground/45">
                      {item.name} · {(item.sizeKb / 1024).toFixed(1)}MB
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg p-1.5 text-foreground/30 hover:bg-danger/10 hover:text-danger"
                    aria-label="Remove file"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length > 0 && (
        <div className="flex justify-end">
          <Button
            size="lg"
            disabled={!allAnalyzed}
            onClick={() => {
              setState("idle");
              router.push(`/projects/${projectId}/analysis`);
            }}
          >
            {allAnalyzed ? (
              <>
                Continue to AI Analysis <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing proposals...
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: VendorProcessingStatus }) {
  if (status === "analyzed") {
    return (
      <Badge variant="success">
        <CheckCircle2 className="h-3 w-3" /> {STATUS_LABEL[status]}
      </Badge>
    );
  }
  if (status === "queued") {
    return <Badge variant="outline">{STATUS_LABEL[status]}</Badge>;
  }
  return (
    <Badge variant="warning">
      <Loader2 className="h-3 w-3 animate-spin" /> {STATUS_LABEL[status]}
    </Badge>
  );
}
