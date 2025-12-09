import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { usePortalStore } from "../store/portalStore";
import { Question } from "../lib/types";

export default function ExamPlayer() {
  const { examId } = useParams();
  const exams = usePortalStore((s) => s.exams);
  const attempts = usePortalStore((s) => s.attempts);
  const startAttempt = usePortalStore((s) => s.startAttempt);
  const saveAnswer = usePortalStore((s) => s.saveAnswer);
  const submitAttempt = usePortalStore((s) => s.submitAttempt);

  const exam = exams.find((e) => e.id === examId);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // seconds
  const [activeIndex, setActiveIndex] = useState(0);

  // Start attempt + timer on first mount
  useEffect(() => {
    if (!exam) return;
    const id = startAttempt(exam.id);
    if (!id) return;
    setAttemptId(id);

    const durationSecs = (exam.durationMins ?? 30) * 60;
    setTimeLeft(durationSecs);
  }, [examId]);

  // Global exam timer
  useEffect(() => {
    if (!attemptId || timeLeft === null) return;
    if (timeLeft <= 0) {
      submitAttempt(attemptId);
      return;
    }

    const t = setInterval(() => {
      setTimeLeft((prev) => (prev === null ? null : prev - 1));
    }, 1000);

    return () => clearInterval(t);
  }, [attemptId, timeLeft]);

  const attempt = useMemo(
    () => attempts.find((a) => a.id === attemptId),
    [attemptId, attempts]
  );

  if (!exam) {
    return (
      <PageShell title="Exam" subtitle="Not found">
        <div className="card">
          <div className="cardBody">Exam not found.</div>
        </div>
      </PageShell>
    );
  }

  const hasDescriptive = exam.questions.some(
    (q) => q.type === "SHORT" || q.type === "LONG" || q.type === "FILE"
  );
  const question = exam.questions[activeIndex];

  const totalQuestions = exam.questions.length;
  const progressPct = Math.round(((activeIndex + 1) / totalQuestions) * 100);

  function formatTime(sec: number | null) {
    if (sec === null) return "--:--";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function onChoose(q: Question, value: any) {
    if (!attemptId) return;
    saveAnswer(attemptId, q.id, value);
  }

  function handleSubmitClick() {
    if (!attemptId) return;
    if (!window.confirm("Submit exam? You won't be able to change answers.")) return;
    submitAttempt(attemptId);
  }

  return (
    <PageShell
      title={exam.title}
      subtitle={`Duration: ${exam.durationMins ?? 30} mins · Pass: ${
        exam.passPct
      }% · ${hasDescriptive ? "Auto + evaluator based" : "Fully auto-graded"}`}
    >
      {/* Top timer + progress */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="cardHeader" style={{ alignItems: "center" }}>
          <div>
            <h3 style={{ marginBottom: 4 }}>Exam in progress</h3>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              Question {activeIndex + 1} of {totalQuestions}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div className="badge warn">
              Time left: {formatTime(timeLeft)}
            </div>
            {attempt?.status === "FINALIZED" && (
              <div className={attempt.pass ? "badge ok" : "badge bad"}>
                {attempt.pass ? "PASS" : "FAIL"} · {attempt.finalScore ?? attempt.objectiveScore}%
              </div>
            )}
          </div>
        </div>
        <div className="cardBody">
          <div className="progressTrack">
            <div
              className="progressFill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main exam layout */}
      <div className="examLayout">
        {/* Left: questions list */}
        <div className="examNav">
          <h4>Questions</h4>
          <p className="muted">
            Click to jump to any question. Make sure you review all before submitting.
          </p>
          <div className="examNavList">
            {exam.questions.map((q, i) => (
              <button
                key={q.id}
                className={
                  "examNavItem" + (i === activeIndex ? " activeNavItem" : "")
                }
                onClick={() => setActiveIndex(i)}
              >
                Q{i + 1} · {q.type}
              </button>
            ))}
          </div>
        </div>

        {/* Right: active question */}
        <div className="examQuestion">
          <div className="card">
            <div className="cardHeader">
              <div>
                <h3>
                  Q{activeIndex + 1}. {question.text}
                </h3>
                {question.rubric && (
                  <p className="muted" style={{ marginTop: 4 }}>
                    Rubric: {question.rubric}
                  </p>
                )}
              </div>
              <span className="tag">{question.type}</span>
            </div>
            <div className="cardBody">
              {(question.type === "MCQ" ||
                question.type === "MULTI" ||
                question.type === "TRUE_FALSE") && (
                <div className="optionList">
                  {question.options?.map((opt, i) => {
                    const isMulti = question.type === "MULTI";
                    return (
                      <label key={i} className="optionItem">
                        <input
                          type={isMulti ? "checkbox" : "radio"}
                          name={question.id}
                          onChange={(e) => {
                            if (!attemptId) return;
                            if (isMulti) {
                              const ans = attempt?.answers.find(
                                (a) => a.questionId === question.id
                              );
                              const prev = (ans?.response ?? []) as number[];
                              const next = e.target.checked
                                ? [...prev, i]
                                : prev.filter((x) => x !== i);
                              onChoose(question, next);
                            } else {
                              onChoose(question, [i]);
                            }
                          }}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {(question.type === "SHORT" || question.type === "LONG") && (
                <textarea
                  className="textarea"
                  rows={6}
                  placeholder="Type your answer here…"
                  onChange={(e) => onChoose(question, e.target.value)}
                />
              )}

              {question.type === "FILE" && (
                <div>
                  <p className="muted">
                    (Demo) File upload is mocked as file name only. Full file upload can be integrated later.
                  </p>
                  <input
                    className="input"
                    placeholder="File name or URL"
                    onChange={(e) =>
                      onChoose(question, { fileName: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="examActions">
            <div>
              <button
                className="btn btnGhost"
                disabled={activeIndex === 0}
                onClick={() =>
                  setActiveIndex((i) => (i > 0 ? i - 1 : i))
                }
              >
                Previous
              </button>
              <button
                className="btn btnGhost"
                disabled={activeIndex === totalQuestions - 1}
                onClick={() =>
                  setActiveIndex((i) =>
                    i < totalQuestions - 1 ? i + 1 : i
                  )
                }
                style={{ marginLeft: 8 }}
              >
                Next
              </button>
            </div>
            <button className="btn btnPrimary" onClick={handleSubmitClick}>
              Submit exam
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
