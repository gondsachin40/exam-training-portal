import React from "react";
import PageShell from "../components/PageShell";
import { usePortalStore } from "../store/portalStore";

export default function AttemptHistory() {
  const user = usePortalStore((s) => s.currentUser)!;
  const attempts = usePortalStore((s) => s.attempts.filter(a => a.userId === user.id));
  const exams = usePortalStore((s) => s.exams);

  return (
    <PageShell title="Attempt History" subtitle="Every attempt (objective + evaluator result).">
      <div className="card">
        <div className="cardHeader"><h3>History</h3><span className="tag">Audit trail</span></div>
        <div className="cardBody">
          <table className="table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Status</th>
                <th>Objective</th>
                <th>Final</th>
                <th>Pass/Fail</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => {
                const exam = exams.find((e) => e.id === a.examId);
                return (
                  <tr key={a.id}>
                    <td><b>{exam?.title || a.examId}</b></td>
                    <td>{a.status}</td>
                    <td>{a.objectiveScore}%</td>
                    <td>{a.finalScore ?? "—"}</td>
                    <td>
                      {a.status === "PENDING_EVAL" ? (
                        <span className="badge warn">PENDING</span>
                      ) : a.status === "FINALIZED" ? (
                        <span className={"badge " + (a.pass ? "ok" : "bad")}>{a.pass ? "PASS" : "FAIL"}</span>
                      ) : (
                        <span className="badge warn">IN PROGRESS</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
