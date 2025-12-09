import PageShell from "../components/PageShell";
import StatCard from "../components/StatCard";
import { usePortalStore } from "../store/portalStore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = usePortalStore((s) => s.currentUser);
  const exams = usePortalStore((s) => s.exams);
  const attempts = usePortalStore((s) => s.attempts);

  if (!user) return null;

  /* ---------------- ADMIN DASHBOARD ---------------- */
  if (user.role === "ADMIN") {
    const totalExams = exams.length;
    const totalUsers = 3; // abhi demo users
    const totalAttempts = attempts.length;

    return (
      <PageShell title="Admin Dashboard" subtitle="System overview & controls">
        <div className="statGrid">
          <StatCard label="Total Exams" value={totalExams} />
          <StatCard label="Total Users" value={totalUsers} />
          <StatCard label="Total Attempts" value={totalAttempts} />
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="cardHeader">
            <h3>Admin Actions</h3>
          </div>
          <div className="cardBody" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn btnPrimary" to="/admin/exams">
              Manage Exams
            </Link>
            <Link className="btn btnGhost" to="/admin/exams/new">
              Create New Exam
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ---------------- USER / LEARNER DASHBOARD ---------------- */

  const myAttempts = attempts.filter((a) => a.userId === user.id);
  const passed = myAttempts.filter((a) => a.pass).length;
  const pending = myAttempts.filter((a) => a.status !== "FINALIZED").length;

  return (
    <PageShell
      title="My Dashboard"
      subtitle={`Welcome ${user.name} — Track your learning & exams`}
    >
      <div className="statGrid">
        <StatCard label="Available Exams" value={exams.length} />
        <StatCard label="My Attempts" value={myAttempts.length} />
        <StatCard label="Passed" value={passed} />
        <StatCard label="Pending Evaluation" value={pending} />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="cardHeader">
          <h3>Quick Actions</h3>
        </div>
        <div className="cardBody" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn btnPrimary" to="/courses">
            View Training
          </Link>
          <Link className="btn btnGhost" to="/history">
            My Exam Attempts
          </Link>
          <Link className="btn btnGhost" to="/certificates">
            My Certificates
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="cardHeader">
          <h3>Available Exams</h3>
        </div>
        <div className="cardBody">
          {exams.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No exams published yet.</p>
          ) : (
            <ul>
              {exams.map((e) => (
                <li key={e.id} style={{ marginBottom: 8 }}>
                  <b>{e.title}</b> — Duration {e.durationMins} mins — Pass {e.passPct}%
                  <br />
                  <Link to={`/exam/${e.id}`} className="btn btnPrimary" style={{ marginTop: 6 }}>
                    Start Exam
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageShell>
  );
}
