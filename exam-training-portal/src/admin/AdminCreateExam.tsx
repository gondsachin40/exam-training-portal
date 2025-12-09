import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { usePortalStore } from "../store/portalStore";

export default function AdminCreateExam() {
  const createExam = usePortalStore((s) => s.createExam);
  const navigate = useNavigate();

  const [title, setTitle] = useState("New Exam");
  const [desc, setDesc] = useState("Describe purpose and scope.");
  const [passPct, setPassPct] = useState(60);
  const [maxAttempts, setMaxAttempts] = useState(2);

  return (
    <PageShell title="Admin — Create Exam" subtitle="Pass/Fail exam (objective auto-grading + descriptive evaluation).">
      <div className="card">
        <div className="cardHeader"><h3>Exam details</h3><span className="tag">Create</span></div>
        <div className="cardBody">
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr" }}>
            <div>
              <label style={{ fontWeight: 800, fontSize: 13 }}>Title</label>
              <input className="input" value={title} onChange={(e)=> setTitle(e.target.value)} />
            </div>
            <div>
              <label style={{ fontWeight: 800, fontSize: 13 }}>Description</label>
              <textarea className="textarea" value={desc} onChange={(e)=> setDesc(e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontWeight: 800, fontSize: 13 }}>Pass %</label>
                <input className="input" type="number" value={passPct} onChange={(e)=> setPassPct(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ fontWeight: 800, fontSize: 13 }}>Max attempts</label>
                <input className="input" type="number" value={maxAttempts} onChange={(e)=> setMaxAttempts(Number(e.target.value))} />
              </div>
            </div>
            <button
              className="btn btnPrimary"
              onClick={() => {
                const id = createExam({
                  title,
                  description: desc,
                  passPct,
                  maxAttempts,
                  durationMins: 30,
                  teamScope: ["Core"],
                  questions: [],
                });
                navigate(`/admin/questions/${id}`);
              }}
            >
              Create exam & go to question bank
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
