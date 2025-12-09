import PageShell from "../components/PageShell";
import { usePortalStore } from "../store/portalStore";
import { Link } from "react-router-dom";

export default function AdminExams() {
  const exams = usePortalStore((s) => s.exams);

  return (
    <PageShell
      title="Admin · Exams"
      subtitle="Create, review and manage available exams."
    >
      <div className="card">
        <div className="cardHeader">
          <h3>All Exams</h3>
          <Link to="/admin/exams/new" className="btn btnPrimary">
            + Create exam
          </Link>
        </div>
        <div className="cardBody">
          {exams.length === 0 ? (
            <p className="muted">No exams yet. Create one to get started.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Pass %</th>
                  <th>Max attempts</th>
                  <th>Duration</th>
                  <th>Questions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e) => (
                  <tr key={e.id}>
                    <td>{e.title}</td>
                    <td>{e.passPct}%</td>
                    <td>{e.maxAttempts}</td>
                    <td>{e.durationMins} mins</td>
                    <td>{e.questions.length}</td>
                    <td>
                      <Link
                        className="btn btnGhost"
                        to={`/admin/questions/${e.id}`}
                      >
                        Manage questions
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageShell>
  );
}
