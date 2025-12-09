import { Home, BookOpen, FileCheck2, Award, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { usePortalStore } from "../store/portalStore";

export default function Sidebar() {
  const { pathname } = useLocation();
  const user = usePortalStore((s) => s.currentUser);

  const menu = [
    { label: "Dashboard", icon: Home, to: "/dashboard", show: !!user },
    { label: "Courses", icon: BookOpen, to: "/courses", show: user?.role === "LEARNER" },
    { label: "Exams", icon: FileCheck2, to: "/history", show: user?.role === "LEARNER" },
    { label: "Evaluator Queue", icon: Shield, to: "/evaluator", show: user?.role === "EVALUATOR" },
    { label: "Certificates", icon: Award, to: "/certificates", show: user?.role === "LEARNER" },
    { label: "Admin – Exams", icon: Shield, to: "/admin/exams", show: user?.role === "ADMIN" },
  ].filter((m) => m.show);

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">EP</div>
        <div>
          <h1>Exam & Training</h1>
          <p>Internal assessment portal</p>
        </div>
      </div>

      <div className="nav">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className={active ? "active" : ""}>
              <Icon size={16} style={{ marginRight: 8 }} />
              {item.label}
            </Link>
          );
        })}
        <Link
          to="/login"
          onClick={() => usePortalStore.getState().logout()}
        >
          Logout
        </Link>
      </div>
    </aside>
  );
}
