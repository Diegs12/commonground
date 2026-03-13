"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Settings {
  confidenceThreshold: number;
  autoPublishEnabled: boolean;
  ingestionIntervalMin: number;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    confidenceThreshold: 0.8,
    autoPublishEnabled: true,
    ingestionIntervalMin: 60,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Settings</h1>

      <div className="space-y-6">
        <div>
          <Label>Confidence Threshold</Label>
          <p className="text-sm text-gray-500 mb-2">
            Stories at or above this score auto-publish. Below 0.4 auto-rejects.
          </p>
          <Input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={settings.confidenceThreshold}
            onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <Label>Ingestion Interval (minutes)</Label>
          <p className="text-sm text-gray-500 mb-2">
            How often the cron job fetches new articles.
          </p>
          <Input
            type="number"
            min={15}
            max={1440}
            value={settings.ingestionIntervalMin}
            onChange={(e) => setSettings({ ...settings, ingestionIntervalMin: parseInt(e.target.value) })}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="autoPublish"
            checked={settings.autoPublishEnabled}
            onChange={(e) => setSettings({ ...settings, autoPublishEnabled: e.target.checked })}
            className="h-4 w-4"
          />
          <Label htmlFor="autoPublish">Auto-publish high-confidence stories</Label>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
          {saved && <span className="text-sm text-emerald-600">Saved!</span>}
        </div>
      </div>
    </div>
  );
}
