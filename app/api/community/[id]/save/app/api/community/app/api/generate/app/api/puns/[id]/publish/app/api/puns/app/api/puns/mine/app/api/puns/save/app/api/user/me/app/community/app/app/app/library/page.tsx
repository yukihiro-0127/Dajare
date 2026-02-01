"use client";

import { useEffect, useState } from "react";

const scenes = [
  "business_first_meeting",
  "business_internal_presentation",
  "business_email_subject",
  "friends_casual_chat"
];

const languages = ["en", "jp"];

type Pun = {
  id: string;
  inputText: string;
  scene: string;
  language: string;
  tone: string;
  selectedText: string;
  professionalFitScore: number;
  savedAt: string;
  publishedAt?: string | null;
  isPublished: boolean;
  usedInRealLife: boolean;
  likeStatus?: string | null;
  notes?: string | null;
};

export default function LibraryPage() {
  const [puns, setPuns] = useState<Pun[]>([]);
  const [sceneFilter, setSceneFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadPuns = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (sceneFilter !== "all") params.set("scene", sceneFilter);
    if (languageFilter !== "all") params.set("language", languageFilter);
    const res = await fetch(`/api/puns/mine?${params.toString()}`);
    const data = await res.json();
    setPuns(data.puns || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPuns();
  }, [sceneFilter, languageFilter]);

  const updatePun = async (id: string, payload: Record<string, unknown>) => {
    await fetch(`/api/puns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await loadPuns();
  };

  const togglePublish = async (id: string, isPublished: boolean) => {
    await fetch(`/api/puns/${id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: isPublished ? "unpublish" : "publish" })
    });
    await loadPuns();
  };

  return (
    <div>
      <section className="card">
        <h1>My Library</h1>
        <p className="muted">Manage your saved puns and publish your favorites.</p>
        <div className="section flex">
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
        </div>
      </section>

      <section className="section">
        {loading ? <p className="muted">Loading...</p> : null}
        {!loading && puns.length === 0 ? (
          <p className="muted">No saved puns yet.</p>
        ) : (
          <div className="grid">
            {puns.map((pun) => (
              <div key={pun.id} className="card">
                <div className="flex">
                  <span className="badge">{pun.scene.replace(/_/g, " ")}</span>
                  <span className="badge">{pun.language.toUpperCase()}</span>
                  <span className="badge">{pun.tone}</span>
                </div>
                <h3>{pun.selectedText}</h3>
                <p className="muted">Score {pun.professionalFitScore}</p>
                <p className="muted">Saved {new Date(pun.savedAt).toLocaleString()}</p>
                <div className="section">
                  <label>
                    <input
                      type="checkbox"
                      checked={pun.usedInRealLife}
                      onChange={() => updatePun(pun.id, { usedInRealLife: !pun.usedInRealLife })}
                    />{" "}
                    Used in real life
                  </label>
                </div>
                <div className="section flex">
                  <button
                    className={pun.likeStatus === "like" ? "" : "secondary"}
                    onClick={() =>
                      updatePun(pun.id, { likeStatus: pun.likeStatus === "like" ? null : "like" })
                    }
                  >
                    Like
                  </button>
                  <button
                    className={pun.likeStatus === "dislike" ? "" : "secondary"}
                    onClick={() =>
                      updatePun(pun.id, {
                        likeStatus: pun.likeStatus === "dislike" ? null : "dislike"
                      })
                    }
                  >
                    Dislike
                  </button>
                </div>
                <div className="section">
                  <label>Notes</label>
                  <textarea
                    rows={2}
                    value={pun.notes ?? ""}
                    onChange={(event) => updatePun(pun.id, { notes: event.target.value })}
                  />
                </div>
                <div className="section flex">
                  <button className="secondary" onClick={() => togglePublish(pun.id, pun.isPublished)}>
                    {pun.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  {pun.publishedAt ? (
                    <span className="muted">
                      Published {new Date(pun.publishedAt).toLocaleDateString()}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
