import PageShell from "../components/PageShell";
import { usePortalStore } from "../store/portalStore";
import { Link } from "react-router-dom";

export default function EvaluatorQueue() {
  const attempts = usePortalStore((s) =>
    s.attempts.filter((a) => a.status === "PENDING_EVAL")
  );
  const exams = usePortalStore((s) => s.exams);
  const users = usePortalStore((s) => s.users);

  return (
    <PageShell
      title="Evaluator Queue"
      subtitle="Descriptive answers waiting for manual review."
    >
      <div className="card">
        <div className="cardHeader">
          <h3>Pending Attempts</h3>
        </div>
        <div className="cardBody">
          {attempts.length === 0 ? (
            <p className="muted">
              No attempts pending evaluation. Once learners submit exams with
              descriptive questions, they will appear here.
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Exam</th>
                  <th>Objective score</th>
                  <th>Started</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => {
                  const exam = exams.find((e) => e.id === a.examId);
                  const user = users.find((u) => u.id === a.userId);
                  const started = a.startedAt
                    ? new Date(a.startedAt).toLocaleString()
                    : "-";

                  return (
                    <tr key={a.id}>
                      <td>{user?.name || a.userId}</td>
                      <td>{exam?.title || a.examId}</td>
                      <td>{a.objectiveScore}%</td>
                      <td>{started}</td>
                      <td>
                        <Link
                          className="btn btnPrimary"
                          to={`/evaluator/${a.id}`}
                        >
                          Evaluate
                        </Link>
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
