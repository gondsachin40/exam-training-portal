import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { usePortalStore } from "../store/portalStore";
import { QuestionType } from "../lib/types";

export default function AdminQuestions() {
  const { examId } = useParams();
  const exams = usePortalStore((s) => s.exams);
  const addQuestion = usePortalStore((s) => s.addQuestion);

  const exam = useMemo(() => exams.find((e) => e.id === examId), [exams, examId]);

  const [type, setType] = useState<QuestionType>("MCQ");
  const [text, setText] = useState("");
  const [opts, setOpts] = useState("A,B,C,D");
  const [ans, setAns] = useState("0");
  const [rubric, setRubric] = useState("Clarity, structure, correctness.");

  if (!exam) return <PageShell title="Question bank" subtitle="Exam not found"><div className="card"><div className="cardBody">Not found</div></div></PageShell>;

  return (
    <PageShell title="Admin — Question Bank" subtitle="Add objective (auto-graded) or descriptive (evaluator graded) questions.">
      <div className="card">
        <div className="cardHeader"><h3>{exam.title}</h3><span className="tag">Questions</span></div>
        <div className="cardBody">
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="cardHeader"><h3>Add question</h3><span className="tag">Create</span></div>
            <div className="cardBody" style={{ display: "grid", gap: 10 }}>
              <div>
                <label style={{ fontWeight: 800, fontSize: 13 }}>Type</label>
                <select className="select" value={type} onChange={(e)=> setType(e.target.value as QuestionType)}>
                  <option>MCQ</option>
                  <option>MULTI</option>
                  <option>TRUE_FALSE</option>
                  <option>SHORT</option>
                  <option>LONG</option>
                  <option>FILE</option>
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 800, fontSize: 13 }}>Question</label>
                <textarea className="textarea" value={text} onChange={(e)=> setText(e.target.value)} />
              </div>

              {(type === "MCQ" || type === "MULTI" || type === "TRUE_FALSE") && (
                <>
                  <div>
                    <label style={{ fontWeight: 800, fontSize: 13 }}>Options (comma separated)</label>
                    <input className="input" value={opts} onChange={(e)=> setOpts(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 800, fontSize: 13 }}>Answer index(es) (e.g. 0 or 0,2)</label>
                    <input className="input" value={ans} onChange={(e)=> setAns(e.target.value)} />
                  </div>
                </>
              )}

              {(type === "SHORT" || type === "LONG" || type === "FILE") && (
                <div>
                  <label style={{ fontWeight: 800, fontSize: 13 }}>Rubric</label>
                  <textarea className="textarea" value={rubric} onChange={(e)=> setRubric(e.target.value)} />
                </div>
              )}

              <button
                className="btn btnPrimary"
                onClick={() => {
                  const q = {
                    type,
                    text,
                    options: (type === "MCQ" || type === "MULTI" || type === "TRUE_FALSE") ? opts.split(",").map(x => x.trim()).filter(Boolean) : undefined,
                    answerKey: (type === "MCQ" || type === "MULTI" || type === "TRUE_FALSE") ? ans.split(",").map(x => Number(x.trim())).filter(x => !Number.isNaN(x)) : undefined,
                    rubric: (type === "SHORT" || type === "LONG" || type === "FILE") ? rubric : undefined,
                  };
                  addQuestion(exam.id, q as any);
                  setText("");
                }}
              >
                Add question
              </button>
            </div>
          </div>

          <div className="card">
            <div className="cardHeader"><h3>Existing questions</h3><span className="tag">{exam.questions.length}</span></div>
            <div className="cardBody">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Question</th>
                    <th>Key / Rubric</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.questions.map((q) => (
                    <tr key={q.id}>
                      <td>{q.type}</td>
                      <td>{q.text}</td>
                      <td style={{ color: "#52607a" }}>
                        {q.answerKey ? `Answer: [${q.answerKey.join(", ")}]` : q.rubric || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </PageShell>
  );
}
