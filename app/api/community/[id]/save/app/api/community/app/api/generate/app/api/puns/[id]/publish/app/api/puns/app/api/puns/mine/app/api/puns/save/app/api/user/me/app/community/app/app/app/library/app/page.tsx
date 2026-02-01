"use client";

import { useEffect, useMemo, useState } from "react";

const scenes = [
  { value: "business_first_meeting", label: "Business: First Meeting" },
  { value: "business_internal_presentation", label: "Business: Internal Presentation" },
  { value: "business_email_subject", label: "Business: Email Subject" },
  { value: "friends_casual_chat", label: "Friends: Casual Chat" }
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "playful", label: "Playful" },
  { value: "dry", label: "Dry" }
];

const languages = [
  { value: "en", label: "EN" },
  { value: "jp", label: "JP" }
];

type Candidate = {
  text: string;
  short_explanation: string;
  safety_flag: boolean;
  tags?: string[];
  professional_fit_score: number;
};

type UserPrefs = {
  tonePreference: string;
  defaultScene: string;
  bannedTopics: string[];
  displayName?: string | null;
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [scene, setScene] = useState(scenes[0].value);
  const [language, setLanguage] = useState(languages[0].value);
  const [tone, setTone] = useState(tones[0].value);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPunId, setSavedPunId] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<UserPrefs | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setPrefs(data.user);
          if (data.user.defaultScene) {
            setScene(data.user.defaultScene);
          }
          if (data.user.tonePreference) {
            setTone(data.user.tonePreference);
          }
        }
      })
      .catch(() => null);
  }, []);

  const canGenerate = useMemo(() => inputText.trim().length > 3, [inputText]);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    setCandidates([]);
    setSavedPunId(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText, scene, language, tone })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }
      setCandidates(data.candidates || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (candidate: Candidate) => {
    setError(null);
    try {
      const res = await fetch("/api/puns/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText,
          scene,
          language,
          tone,
          candidates,
          selectedText: candidate.text,
          professionalFitScore: candidate.professional_fit_score,
          safetyFlag: candidate.safety_flag
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save");
      }
      setSavedPunId(data.pun?.id ?? null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePublish = async () => {
    if (!savedPunId) return;
    setError(null);
    if (!prefs?.displayName) {
      setError("Please set a display name before publishing.");
      return;
    }
    const confirmed = window.confirm(
      "Publishing guidelines: avoid personal info, offensive or explicit content. Continue?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/puns/${savedPunId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish");
      }
      setError("Published to community!");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <section className="card">
        <h1>PunCraft Generator</h1>
        <p className="muted">
          Generate context-aware puns in JP/EN. Adjust scene, tone, and language
          for practical use cases.
        </p>
        {prefs?.bannedTopics?.length ? (
          <div className="notice section">
            Banned topics in your memory: {prefs.bannedTopics.join(", ")}
          </div>
        ) : null}
        <div className="section">
          <label htmlFor="inputText">Input</label>
          <textarea
            id="inputText"
            rows={3}
            placeholder="e.g., onboarding meeting, coffee, teamwork"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
          />
        </div>
        <div className="section grid">
          <div>
            <label>Scene</label>
            <select value={scene} onChange={(event) => setScene(event.target.value)}>
              {scenes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Language</label>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {languages.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tone</label>
            <select value={tone} onChange={(event) => setTone(event.target.value)}>
              {tones.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="section flex">
          <button onClick={handleGenerate} disabled={!canGenerate || loading}>
            {loading ? "Generating..." : "Generate 5 puns"}
          </button>
          {savedPunId ? (
            <button className="secondary" onClick={handlePublish}>
              Publish saved pun
            </button>
          ) : null}
        </div>
        {error ? <p className="muted">{error}</p> : null}
      </section>

      <section className="section">
        <h2>Results</h2>
        {candidates.length === 0 ? (
          <p className="muted">Generate to see 5 options.</p>
        ) : (
          <div className="grid">
            {candidates.map((candidate, index) => (
              <div key={`${candidate.text}-${index}`} className="card">
                <div className="flex">
                  <span className="badge">Score {candidate.professional_fit_score}</span>
                  {candidate.safety_flag ? (
                    <span className="badge">Safety flag</span>
                  ) : null}
                  {candidate.tags?.map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3>{candidate.text}</h3>
                <p className="muted">{candidate.short_explanation}</p>
                <button className="secondary" onClick={() => handleSave(candidate)}>
                  Save to my library
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
