// src/pages/EvaluateAttempt.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { usePortalStore } from "../store/portalStore";

export default function EvaluateAttempt() {
  const { attemptId } = useParams();
  const attempt = usePortalStore((s) => s.attempts.find(a => a.id === attemptId));
  const exams = usePortalStore((s) => s.exams);
  const finalize = usePortalStore((s) => s.finalizeEvaluation);

  const [score, setScore] = useState(80);
  const [remarks, setRemarks] = useState("");

  if (!attempt) return <PageShell title="Evaluator" subtitle="Not found"><div className="card"><div className="cardBody">Attempt not found.</div></div></PageShell>;

  const exam = exams.find((e) => e.id === attempt.examId);

  return (
    <PageShell title="Evaluate Attempt" subtitle="Add score + remarks (finalizes Pass/Fail).">
      <div className="card">
        <div className="cardHeader"><h3>{exam?.title || "Exam"}</h3><span className="tag">Manual grading</span></div>
        <div className="cardBody">
          <div className="card" style={{ marginBottom: 10 }}>
            <div className="cardHeader"><h3>Context</h3><span className="tag">Objective</span></div>
            <div className="cardBody">
              Objective score: <b>{attempt.objectiveScore}%</b>
              <div style={{ marginTop: 6, color: "#52607a" }}>
                (Policy: final score = 60% objective + 40% evaluator score — adjustable later.)
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 10 }}>
            <div className="cardHeader"><h3>Evaluator input</h3><span className="tag">Finalization</span></div>
            <div className="cardBody">
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontWeight: 800, fontSize: 13 }}>Evaluator score (0–100)</label>
                <input className="input" type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} min={0} max={100} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontWeight: 800, fontSize: 13 }}>Remarks</label>
                <textarea className="textarea" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              </div>
              <button className="btn btnPrimary" onClick={() => finalize(attempt.id, { evaluatorScore: score, remarks })}>
                Finalize (Pass/Fail)
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
