"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { TabBar } from "@/components/ui/tab-bar";
import { Modal } from "@/components/ui/modal";
import { createClient } from "@/lib/supabase/client";
import { useWedding } from "@/lib/context/wedding-context";
import type { RegistryLink, PhotoAlbum } from "@/lib/types";

const TABS = [
  { label: "Registry", value: "registry" },
  { label: "Photo gallery", value: "gallery" },
  { label: "Guest view", value: "guestview" },
];

const AVAILABLE_REGISTRIES = [
  { name: "Zola", color: "#EEEDFE", initial: "Z", url: "https://www.zola.com/registry/" },
  { name: "Amazon", color: "#FFF3E0", initial: "A", url: "https://www.amazon.com/wedding/registry/" },
  { name: "Crate & Barrel", color: "#EAF3DE", initial: "C", url: "https://www.crateandbarrel.com/gift-registry/" },
  { name: "Williams Sonoma", color: "#FCEBEB", initial: "W", url: "https://www.williams-sonoma.com/registry/" },
];

export default function RegistryPage() {
  const { weddingId, partner1Name, partner2Name } = useWedding();
  const [activeTab, setActiveTab] = useState("registry");
  const [activeAlbumId, setActiveAlbumId] = useState<string>("all");
  const [registryLinks, setRegistryLinks] = useState<RegistryLink[]>([]);
  const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  // Add registry modal
  const [showAddRegistry, setShowAddRegistry] = useState(false);
  const [newReg, setNewReg] = useState({ name: "", url: "", logoColor: "#EEEDFE", logoInitial: "R" });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [{ data: dbLinks }, { data: dbAlbums }] = await Promise.all([
      supabase.from("registry_links").select("*").eq("wedding_id", weddingId),
      supabase.from("photo_albums").select("*").eq("wedding_id", weddingId).order("created_at"),
    ]);
    setRegistryLinks((dbLinks ?? []).map((l) => ({
      id: l.id, name: l.name, url: l.url, logoColor: l.logo_color, logoInitial: l.logo_initial,
    })));
    setPhotoAlbums((dbAlbums ?? []).map((a) => ({
      id: a.id, name: a.name, eventId: a.event_id ?? undefined, photoCount: 0, coverColor: a.cover_color,
    })));
    setLoading(false);
  }, [weddingId]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleAddRegistry(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("registry_links").insert({
      wedding_id: weddingId,
      name: newReg.name,
      url: newReg.url,
      logo_color: newReg.logoColor,
      logo_initial: newReg.logoInitial,
    });
    setSaving(false);
    setShowAddRegistry(false);
    setNewReg({ name: "", url: "", logoColor: "#EEEDFE", logoInitial: "R" });
    await loadData();
  }

  function handleQuickAdd(reg: typeof AVAILABLE_REGISTRIES[0]) {
    setNewReg({ name: reg.name, url: reg.url, logoColor: reg.color, logoInitial: reg.initial });
    setShowAddRegistry(true);
  }

  async function handleRemoveRegistry(id: string) {
    const supabase = createClient();
    await supabase.from("registry_links").delete().eq("id", id);
    await loadData();
  }

  if (loading) {
    return <div className="mt-10 text-center text-[13px] text-neutral-secondary">Loading…</div>;
  }

  const allAlbums = [
    { id: "all", name: "All photos", eventId: undefined, photoCount: 0, coverColor: "#534AB7" },
    ...photoAlbums,
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium">Registry &amp; Gallery</h2>
        <div className="flex gap-2">
          {activeTab === "registry" && <Button variant="primary" onClick={() => setShowAddRegistry(true)}>+ Add registry</Button>}
        </div>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* REGISTRY */}
      {activeTab === "registry" && (
        <div className="mt-5 space-y-5">
          {registryLinks.length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider mb-3">Connected registries</div>
              <div className="space-y-2">
                {registryLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-3 px-4 py-3 border border-black/10 rounded-xl">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-medium"
                      style={{ backgroundColor: link.logoColor }}>{link.logoInitial}</div>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium">{link.name}</div>
                      <div className="text-[11px] text-neutral-secondary truncate">{link.url}</div>
                    </div>
                    <Button variant="ghost" onClick={() => handleRemoveRegistry(link.id)}>Remove</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-[11px] font-medium text-neutral-secondary uppercase tracking-wider mb-3">
              {registryLinks.length > 0 ? "Add another" : "Connect your registries"}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_REGISTRIES.map((reg) => (
                <button key={reg.name} onClick={() => handleQuickAdd(reg)}
                  className="flex items-center gap-3 p-4 border border-black/10 rounded-xl hover:border-primary-light transition-colors cursor-pointer text-left">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-medium shrink-0"
                    style={{ backgroundColor: reg.color }}>{reg.initial}</div>
                  <span className="text-[13px] font-medium">{reg.name}</span>
                </button>
              ))}
              <button onClick={() => setShowAddRegistry(true)}
                className="flex items-center gap-3 p-4 border border-black/10 rounded-xl hover:border-primary-light transition-colors cursor-pointer text-left">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-medium shrink-0 bg-neutral-bg">+</div>
                <span className="text-[13px] font-medium">Custom link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO GALLERY */}
      {activeTab === "gallery" && (
        <div className="mt-5">
          <div className="border-2 border-dashed border-black/15 rounded-xl p-8 text-center mb-5 hover:border-primary-light transition-colors cursor-pointer">
            <div className="text-[32px] mb-2">📷</div>
            <div className="text-[13px] font-medium mb-1">Drop photos here</div>
            <div className="text-[12px] text-neutral-secondary">or click to upload · JPG, PNG, HEIC</div>
          </div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {allAlbums.map((album) => (
              <button key={album.id} onClick={() => setActiveAlbumId(album.id)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                  activeAlbumId === album.id ? "bg-primary text-white" : "bg-neutral-bg text-neutral-secondary hover:bg-black/10"
                }`}>{album.name}</button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl"
                style={{ backgroundColor: `${["#534AB7", "#1D9E75", "#854F0B", "#3B6D11"][i % 4]}18` }} />
            ))}
          </div>
        </div>
      )}

      {/* GUEST VIEW */}
      {activeTab === "guestview" && (
        <div className="mt-5 flex justify-center">
          <div className="w-72 border border-black/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-neutral-bg px-6 py-4 text-center">
              <div className="text-[11px] text-neutral-secondary mb-1">Registry for</div>
              <div className="text-[16px] font-medium">{partner1Name} &amp; {partner2Name}</div>
            </div>
            <div className="p-4 space-y-3">
              {registryLinks.length === 0 ? (
                <div className="text-center text-[12px] text-neutral-secondary py-4">No registries connected yet.</div>
              ) : (
                registryLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-3 p-3 border border-black/10 rounded-xl">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-medium"
                      style={{ backgroundColor: link.logoColor }}>{link.logoInitial}</div>
                    <div className="flex-1"><div className="text-[13px] font-medium">{link.name}</div></div>
                    <span className="text-[11px] text-primary">View →</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Registry Modal */}
      <Modal open={showAddRegistry} onClose={() => setShowAddRegistry(false)} title="Add registry link">
        <form onSubmit={handleAddRegistry}>
          <div className="mb-3">
            <label className="block text-[12px] text-neutral-secondary mb-1">Registry name *</label>
            <input required value={newReg.name} onChange={(e) => setNewReg({ ...newReg, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
              placeholder="e.g. Our Zola Registry" />
          </div>
          <div className="mb-4">
            <label className="block text-[12px] text-neutral-secondary mb-1">Registry URL *</label>
            <input required type="url" value={newReg.url} onChange={(e) => setNewReg({ ...newReg, url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-neutral-bg text-[14px] focus:outline-none focus:border-primary"
              placeholder="https://www.zola.com/registry/yournames" />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={saving}>
            {saving ? "Adding…" : "Add registry"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
