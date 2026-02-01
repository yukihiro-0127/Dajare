"use client";

import { useEffect, useState } from "react";

const scenes = [
  "business_first_meeting",
  "business_internal_presentation",
  "business_email_subject",
  "friends_casual_chat"
];

const languages = ["en", "jp"];
const tones = ["professional", "playful", "dry"];

type CommunityPun = {
  id: string;
  selectedText: string;
  scene: string;
  language: string;
  tone: string;
  professionalFitScore: number;
  communityLikeCount: number;
  communitySaveCount: number;
  publishedAt: string | null;
  createdAt: string;
  savedAt: string;
  authorDisplayName: string | null;
};

export default function CommunityPage() {
  const [items, setItems] = useState<CommunityPun[]>([]);
  const [sort, setSort] = useState("trending");
  const [sceneFilter, setSceneFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [toneFilter, setToneFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadCommunity = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("sort", sort);
    if (sceneFilter !== "all") params.set("scene", sceneFilter);
    if (languageFilter !== "all") params.set("language", languageFilter);
    if (toneFilter !== "all") params.set("tone", toneFilter);
    const res = await fetch(`/api/community?${params.toString()}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCommunity();
  }, [sort, sceneFilter, languageFilter, toneFilter]);

  const handleLike = async (id: string) => {
    await fetch(`/api/community/${id}/like`, { method: "POST" });
    await loadCommunity();
  };

  const handleSave = async (id: string) => {
    await fetch(`/api/community/${id}/save`, { method: "POST" });
    await loadCommunity();
  };

  const handleReport = async (id: string) => {
    const reason = window.prompt("Report reason (spam/offensive/personal_info/other)", "spam");
    if (!reason) return;
    await fetch(`/api/community/${id}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    });
    await loadCommunity();
  };

  return (
    <div>
      <section className="card">
        <h1>Community Gallery</h1>
        <p className="muted">
          Browse public puns shared by the community. Like, save to your library, or report.
        </p>
        <div className="section flex">
          <div>
            <label>Sort</label>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="trending">Trending (7 days)</option>
              <option value="new">New</option>
            </select>
          </div>
          <div>
            <label>Scene</label>
            <select value={sceneFilter} onChange={(event) => setSceneFilter(event.target.value)}>
              <option value="all">All</option>
              {scenes.map((scene) => (
                <option key={scene} value={scene}>
                  {scene.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Language</label>
            <select
              value={languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value)}
            >
              <option value="all">All</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tone</label>
            <select value={toneFilter} onChange={(event) => setToneFilter(event.target.value)}>
              <option value="all">All</option>
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="section">
        {loading ? <p className="muted">Loading...</p> : null}
        {!loading && items.length === 0 ? (
          <p className="muted">No community posts yet.</p>
        ) : (
          <div className="grid">
            {items.map((item) => (
              <div key={item.id} className="card">
                <div className="flex">
                  <span className="badge">{item.scene.replace(/_/g, " ")}</span>
                  <span className="badge">{item.language.toUpperCase()}</span>
                  <span className="badge">{item.tone}</span>
                </div>
                <h3>{item.selectedText}</h3>
                <p className="muted">
                  By {item.authorDisplayName ?? "Anonymous"} · Score {item.professionalFitScore}
                </p>
                <p className="muted">
                  Created {new Date(item.createdAt).toLocaleDateString()} · Saved{" "}
                  {new Date(item.savedAt).toLocaleDateString()}
                </p>
                <p className="muted">
                  Published {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : "-"}
                </p>
                <div className="section flex">
                  <span className="badge">👍 {item.communityLikeCount}</span>
                  <span className="badge">💾 {item.communitySaveCount}</span>
                </div>
                <div className="section flex">
                  <button className="secondary" onClick={() => handleLike(item.id)}>
                    Like
                  </button>
                  <button className="secondary" onClick={() => handleSave(item.id)}>
                    Save
                  </button>
                  <button className="ghost" onClick={() => handleReport(item.id)}>
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
