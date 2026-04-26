"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabBar } from "@/components/ui/tab-bar";
import { TemplateCard } from "@/components/site/template-card";
import { createClient } from "@/lib/supabase/client";
import { useWedding } from "@/lib/context/wedding-context";
import { TEMPLATE_THEMES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { WeddingEvent } from "@/lib/types";

const TABS = [
  { label: "Templates", value: "templates" },
  { label: "Editor", value: "editor" },
  { label: "Preview", value: "preview" },
];

const TEMPLATE_FILTER_PILLS = ["All", "Free", "Hindu", "Sikh", "Muslim", "Minimalist"];

const EXTENDED_TEMPLATES = [
  ...TEMPLATE_THEMES.map((t) => ({ ...t, isPaid: false, tradition: "all", description: `${t.name} aesthetic` })),
  { id: "sikh", name: "Sikh Heritage", bgColor: "#1A3A2A", textColor: "#D4E8C4", isPaid: true, tradition: "sikh", description: "Inspired by Gurudwara aesthetics" },
  { id: "pastel", name: "Pastel Garden", bgColor: "#FBF0F5", textColor: "#7B3F6A", isPaid: true, tradition: "all", description: "Soft floral tones" },
];

const DEFAULT_SECTIONS = [
  { id: "hero", label: "Hero", visible: true },
  { id: "story", label: "Our story", visible: true },
  { id: "events", label: "Events", visible: true },
  { id: "party", label: "Wedding party", visible: false },
  { id: "travel", label: "Travel & stay", visible: true },
  { id: "registry", label: "Registry", visible: true },
  { id: "rsvp", label: "RSVP", visible: true },
  { id: "gallery", label: "Photo gallery", visible: false },
];

interface SiteContent {
  story: string;
  sections: { id: string; label: string; visible: boolean }[];
}

export default function SitePage() {
  const { weddingId, partner1Name, partner2Name, date, city, urlSlug } = useWedding();
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(EXTENDED_TEMPLATES[0].id);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSection, setActiveSection] = useState("hero");
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable content
  const [content, setContent] = useState<SiteContent>({
    story: "",
    sections: DEFAULT_SECTIONS,
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: eventsData }, { data: weddingData }] = await Promise.all([
        supabase.from("events").select("*").eq("wedding_id", weddingId).order("date").limit(5),
        supabase.from("weddings").select("site_content, template_id").eq("id", weddingId).single(),
      ]);

      setEvents((eventsData ?? []).map((e) => ({
        id: e.id, weddingId: e.wedding_id, name: e.name, date: e.date ?? "", time: e.time ?? "",
        venue: e.venue ?? "", dressCode: e.dress_code ?? "", ceremonyType: e.ceremony_type,
        displayColor: e.display_color ?? "#534AB7", sortOrder: e.sort_order ?? 0,
        guestsInvited: 0, rsvpConfirmed: 0, createdAt: e.created_at,
      })));

      if (weddingData?.template_id) setSelectedTemplate(weddingData.template_id);

      const sc = weddingData?.site_content as SiteContent | null;
      if (sc) {
        setContent({
          story: sc.story || "",
          sections: sc.sections?.length ? sc.sections : DEFAULT_SECTIONS,
        });
      }
    }
    load();
  }, [weddingId]);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("weddings").update({
      template_id: selectedTemplate,
      site_content: content,
    }).eq("id", weddingId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleSectionVisibility(sectionId: string) {
    setContent((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      ),
    }));
  }

  const currentTheme = EXTENDED_TEMPLATES.find((t) => t.id === selectedTemplate) ?? EXTENDED_TEMPLATES[0];
  const siteUrl = urlSlug ? `shaadi.com/${urlSlug}` : "shaadi.com/your-wedding";
  const weddingDate = date ? formatDate(date) : "Date TBD";
  const weddingCity = city ?? "";

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium">Your Wedding Site</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")}>Preview site</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
          </Button>
        </div>
      </div>

      <Card className="mb-5" padding="p-3.5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
          <span className="text-[13px] font-medium">{urlSlug ? "Site is live" : "Site not yet published"}</span>
        </div>
        <div className="flex items-center justify-between bg-neutral-bg rounded-lg px-3.5 py-2.5">
          <span className="text-[13px]">
            {urlSlug ? (<>shaadi.com/<span className="text-primary font-medium">{urlSlug}</span></>) : (
              <span className="text-neutral-secondary">Set a URL slug in settings</span>
            )}
          </span>
          <button type="button" onClick={() => urlSlug && navigator.clipboard.writeText(`shaadi.com/${urlSlug}`)}
            className="text-[12px] text-primary font-medium cursor-pointer hover:text-primary-dark">Copy link</button>
        </div>
      </Card>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* TEMPLATES */}
      {activeTab === "templates" && (
        <div className="mt-5">
          <div className="flex gap-2 mb-5 flex-wrap">
            {TEMPLATE_FILTER_PILLS.map((pill) => (
              <button key={pill} onClick={() => setActiveFilter(pill)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-colors cursor-pointer ${
                  activeFilter === pill ? "bg-primary border-primary text-white font-medium" : "bg-white border-black/15 text-neutral-secondary hover:border-black/30"
                }`}>{pill}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3.5 mb-5">
            {EXTENDED_TEMPLATES.map((tmpl) => (
              <TemplateCard key={tmpl.id} id={tmpl.id} name={tmpl.name} description={tmpl.description}
                bgColor={tmpl.bgColor} textColor={tmpl.textColor} isPaid={tmpl.isPaid}
                isSelected={selectedTemplate === tmpl.id} partner1={partner1Name} partner2={partner2Name}
                onClick={() => { setSelectedTemplate(tmpl.id); setActiveTab("editor"); }} />
            ))}
          </div>
        </div>
      )}

      {/* EDITOR */}
      {activeTab === "editor" && (
        <div className="mt-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[15px] font-medium mb-0.5">{currentTheme.name} template</div>
              <div className="text-[12px] text-neutral-secondary">{partner1Name} &amp; {partner2Name} · {weddingDate}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("templates")}>Change template</Button>
              <Button variant={editMode ? "primary" : "outline"} size="sm" onClick={() => setEditMode(!editMode)}>
                {editMode ? "Done editing" : "Edit mode"}
              </Button>
            </div>
          </div>

          <div className="border border-black/10 rounded-xl overflow-hidden" style={{ display: "grid", gridTemplateColumns: "220px 1fr" }}>
            {/* Sidebar */}
            <div className="border-r border-black/10 bg-neutral-bg">
              <div className="px-4 py-3 border-b border-black/10">
                <div className="text-[12px] font-medium mb-0.5">Sections</div>
                <div className="text-[11px] text-neutral-secondary">Click to select, toggle visibility</div>
              </div>
              <div className="p-2">
                {content.sections.map((sec) => (
                  <div key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`flex items-center gap-2 px-2.5 py-2.5 rounded-lg cursor-pointer mb-0.5 ${
                      activeSection === sec.id ? "bg-white border border-black/10" : "hover:bg-white"
                    }`}>
                    <span className="text-neutral-secondary text-[11px]">⠿</span>
                    <span className={`text-[13px] flex-1 ${activeSection === sec.id ? "font-medium text-primary" : ""}`}>{sec.label}</span>
                    <button onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(sec.id); }}
                      className={`text-[11px] cursor-pointer ${sec.visible ? "text-neutral-secondary" : "text-neutral-secondary/40"}`}>
                      {sec.visible ? "👁" : "—"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/10 flex-wrap">
                {(["desktop", "mobile"] as const).map((d) => (
                  <button key={d} onClick={() => setDeviceView(d)}
                    className={`px-3 py-1 rounded-md text-[12px] border cursor-pointer capitalize transition-colors ${
                      deviceView === d ? "bg-primary-pale border-primary-light text-primary-dark font-medium" : "border-black/15 text-neutral-secondary hover:border-black/30"
                    }`}>{d}</button>
                ))}
                <div className="ml-auto text-[12px] text-neutral-secondary">{siteUrl}</div>
              </div>

              <div className={deviceView === "mobile" ? "max-w-xs mx-auto" : ""}>
                {/* Hero */}
                {content.sections.find((s) => s.id === "hero")?.visible && (
                  <div className={`px-6 py-8 text-center ${activeSection === "hero" ? "ring-2 ring-primary-light -m-px" : ""}`}
                    style={{ backgroundColor: currentTheme.bgColor }} onClick={() => setActiveSection("hero")}>
                    <div className="text-[18px] font-medium mb-1.5 tracking-wider" style={{ color: currentTheme.textColor }}>
                      {partner1Name} &amp; {partner2Name}
                    </div>
                    <div className="text-[12px] mb-3" style={{ color: currentTheme.textColor, opacity: 0.7 }}>
                      {weddingDate}{weddingCity ? ` · ${weddingCity}` : ""}
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-px w-10 opacity-40" style={{ backgroundColor: currentTheme.textColor }} />
                      <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: currentTheme.textColor, opacity: 0.6 }} />
                      <div className="h-px w-10 opacity-40" style={{ backgroundColor: currentTheme.textColor }} />
                    </div>
                  </div>
                )}

                {/* Story */}
                {content.sections.find((s) => s.id === "story")?.visible && (
                  <div className={`px-5 py-5 border-b border-black/[0.06] ${activeSection === "story" ? "ring-2 ring-primary-light -m-px" : ""}`}
                    onClick={() => setActiveSection("story")}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-medium text-primary uppercase tracking-widest">Our story</div>
                    </div>
                    {editMode && activeSection === "story" ? (
                      <textarea
                        value={content.story}
                        onChange={(e) => setContent({ ...content, story: e.target.value })}
                        className="w-full text-[13px] text-neutral-secondary leading-relaxed bg-white border border-primary-light rounded-lg p-2 resize-none focus:outline-none focus:border-primary"
                        rows={4}
                        placeholder="Tell your love story… How did you meet? What makes your relationship special?"
                      />
                    ) : (
                      <div className="text-[13px] text-neutral-secondary leading-relaxed">
                        {content.story || (
                          <span className="italic text-neutral-secondary/60">
                            {editMode ? "Click to edit your story…" : "Enable edit mode to write your story"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Events */}
                {content.sections.find((s) => s.id === "events")?.visible && (
                  <div className={`px-5 py-5 border-b border-black/[0.06] ${activeSection === "events" ? "ring-2 ring-primary-light -m-px" : ""}`}
                    onClick={() => setActiveSection("events")}>
                    <div className="text-[10px] font-medium text-primary uppercase tracking-widest mb-3">Events</div>
                    {events.length === 0 ? (
                      <div className="text-[12px] text-neutral-secondary">No events added yet.</div>
                    ) : (
                      <div className={`grid gap-2 ${deviceView === "mobile" ? "grid-cols-1" : "grid-cols-3"}`}>
                        {events.map((evt) => (
                          <div key={evt.id} className="border border-black/[0.08] rounded-lg p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: evt.displayColor }} />
                              <span className="text-[12px] font-medium">{evt.name}</span>
                            </div>
                            <div className="text-[11px] text-neutral-secondary">{evt.date ? formatDate(evt.date) : ""} · {evt.time}</div>
                            <div className="text-[11px] text-neutral-secondary truncate">{evt.venue}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* RSVP */}
                {content.sections.find((s) => s.id === "rsvp")?.visible && (
                  <div className={`px-5 py-5 border-b border-black/[0.06] ${activeSection === "rsvp" ? "ring-2 ring-primary-light -m-px" : ""}`}
                    onClick={() => setActiveSection("rsvp")}>
                    <div className="text-[10px] font-medium text-primary uppercase tracking-widest mb-3">RSVP</div>
                    <div className="text-center py-4">
                      <button className="bg-primary text-white text-[13px] px-6 py-2 rounded-full">RSVP now</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {activeTab === "preview" && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[14px] font-medium">Guest view preview</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => urlSlug && navigator.clipboard.writeText(`shaadi.com/${urlSlug}`)}>Copy link</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>{saving ? "Saving…" : "Publish"}</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="border-2 border-black/20 rounded-3xl overflow-hidden shadow-lg" style={{ width: 320 }}>
              <div className="bg-black h-6 flex items-center justify-center">
                <div className="bg-neutral-text/70 h-1.5 w-16 rounded-full" />
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 560 }}>
                <div className="px-4 py-8 text-center" style={{ backgroundColor: currentTheme.bgColor }}>
                  <div className="text-[16px] font-medium tracking-wider mb-1" style={{ color: currentTheme.textColor }}>
                    {partner1Name} &amp; {partner2Name}
                  </div>
                  <div className="text-[11px] mb-3" style={{ color: currentTheme.textColor, opacity: 0.7 }}>
                    {weddingDate}{weddingCity ? ` · ${weddingCity}` : ""}
                  </div>
                  <button className="bg-white/20 text-white text-[12px] px-5 py-1.5 rounded-full cursor-pointer">RSVP now</button>
                </div>
                {content.story && (
                  <div className="px-4 py-4 border-b border-black/[0.06]">
                    <div className="text-[10px] font-medium text-primary uppercase tracking-widest mb-2">Our story</div>
                    <div className="text-[13px] text-neutral-secondary leading-relaxed">{content.story}</div>
                  </div>
                )}
                <div className="p-4">
                  {events.map((evt) => (
                    <div key={evt.id} className="flex items-center gap-2.5 py-2.5 border-b border-black/[0.06] last:border-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: evt.displayColor }} />
                      <div>
                        <div className="text-[13px] font-medium">{evt.name}</div>
                        <div className="text-[11px] text-neutral-secondary">{evt.date ? formatDate(evt.date) : ""} · {evt.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
