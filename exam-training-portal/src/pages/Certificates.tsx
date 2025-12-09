import PageShell from "../components/PageShell";
import { usePortalStore } from "../store/portalStore";

export default function Certificates() {
  const user = usePortalStore((s) => s.currentUser);
  const exams = usePortalStore((s) => s.exams);
  const attempts = usePortalStore((s) =>
    s.attempts.filter(
      (a) =>
        user &&
        a.userId === user.id &&
        a.pass &&
        a.status === "FINALIZED"
    )
  );

  return (
    <PageShell
      title="Certificates"
      subtitle="Auto-issued certificates for exams you passed."
    >
      <div className="card">
        <div className="cardHeader">
          <h3>Your Certificates</h3>
          <span className="tag">Demo view</span>
        </div>
        <div className="cardBody">
          {attempts.length === 0 ? (
            <p className="muted">
              No certificates yet. Pass an exam to see it here.
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Issued on</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => {
                  const exam = exams.find((e) => e.id === a.examId);
                  const date = a.submittedAt
                    ? new Date(a.submittedAt).toLocaleString()
                    : "-";
                  const score = a.finalScore ?? a.objectiveScore;

                  return (
                    <tr key={a.id}>
                      <td>
                        <b>{exam?.title || a.examId}</b>
                      </td>
                      <td>{score}%</td>
                      <td>
                        <span className="badge ok">PASS</span>
                      </td>
                      <td>{date}</td>
                      <td>
                        <button className="btn btnGhost">
                          View certificate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageShell>
  );
}
