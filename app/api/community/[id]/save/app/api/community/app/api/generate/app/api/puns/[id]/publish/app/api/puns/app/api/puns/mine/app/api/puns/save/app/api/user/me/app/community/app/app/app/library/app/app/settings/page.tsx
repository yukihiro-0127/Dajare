"use client";

import { useEffect, useState } from "react";

const tones = ["professional", "playful", "dry"];
const scenes = [
  "business_first_meeting",
  "business_internal_presentation",
  "business_email_subject",
  "friends_casual_chat"
];

type UserPrefs = {
  displayName?: string | null;
  tonePreference: string;
  defaultScene: string;
  bannedTopics: string[];
};

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<UserPrefs | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => setPrefs(data.user))
      .catch(() => null);
  }, []);

  const updatePrefs = async () => {
    if (!prefs) return;
    const res = await fetch("/api/user/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: prefs.displayName,
        tonePreference: prefs.tonePreference,
        defaultScene: prefs.defaultScene,
        bannedTopics: prefs.bannedTopics
      })
    });
    const data = await res.json();
    if (res.ok) {
      setPrefs(data.user);
      setStatus("Saved preferences.");
    } else {
      setStatus(data.error || "Failed to update.");
    }
  };

  if (!prefs) {
    return <p className="muted">Loading...</p>;
  }

  return (
    <div>
      <section className="card">
        <h1>Settings</h1>
        <p className="muted">Set your display name and default preferences.</p>
        <div className="section">
          <label>Display name (required for publishing)</label>
          <input
            value={prefs.displayName ?? ""}
            onChange={(event) => setPrefs({ ...prefs, displayName: event.target.value })}
          />
        </div>
        <div className="section grid">
          <div>
            <label>Default tone</label>
            <select
              value={prefs.tonePreference}
              onChange={(event) => setPrefs({ ...prefs, tonePreference: event.target.value })}
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Default scene</label>
            <select
              value={prefs.defaultScene}
              onChange={(event) => setPrefs({ ...prefs, defaultScene: event.target.value })}
            >
              {scenes.map((scene) => (
                <option key={scene} value={scene}>
                  {scene.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="section">
          <label>Banned topics (comma-separated)</label>
          <input
            value={prefs.bannedTopics.join(", ")}
            onChange={(event) =>
              setPrefs({
                ...prefs,
                bannedTopics: event.target.value
                  .split(",")
                  .map((topic) => topic.trim())
                  .filter(Boolean)
              })
            }
          />
        </div>
        <div className="section">
          <button onClick={updatePrefs}>Save settings</button>
          {status ? <p className="muted">{status}</p> : null}
        </div>
      </section>
    </div>
  );
}
