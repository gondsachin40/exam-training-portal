import React from "react";
import { useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { usePortalStore } from "../store/portalStore";

export default function CourseView() {
  const { courseId } = useParams();
  const course = usePortalStore((s) => s.courses.find((c) => c.id === courseId));

  if (!course) return <PageShell title="Course" subtitle="Not found"><div className="card"><div className="cardBody">Course not found.</div></div></PageShell>;

  return (
    <PageShell title={course.title} subtitle="Modules → Topics (files / links).">
      <div className="card">
        <div className="cardHeader">
          <h3>Structure</h3>
          <span className="tag">Learning path</span>
        </div>
        <div className="cardBody">
          {course.modules.sort((a,b)=>a.order-b.order).map((m) => (
            <div key={m.id} className="card" style={{ marginBottom: 10 }}>
              <div className="cardHeader"><h3>{m.title}</h3><span className="tag">Module</span></div>
              <div className="cardBody">
                {m.topics.map((t) => (
                  <div key={t.id} style={{ padding: 8, border: "1px solid #eee", borderRadius: 10, marginBottom: 8 }}>
                    <b>{t.title}</b>
                    <div style={{ marginTop: 6, color: "#52607a" }}>
                      {t.contentUrl ? `Resource: ${t.contentUrl}` : "Resource: (to be uploaded)"} 
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
