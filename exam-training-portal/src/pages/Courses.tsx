import React from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { usePortalStore } from "../store/portalStore";

export default function Courses() {
  const courses = usePortalStore((s) => s.courses);

  return (
    <PageShell title="Courses" subtitle="Course → Modules → Topics (files / links).">
      <div className="card">
        <div className="cardHeader">
          <h3>Library</h3>
          <span className="tag">Training materials</span>
        </div>
        <div className="cardBody">
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td><b>{c.title}</b></td>
                  <td>{c.description}</td>
                  <td><Link className="btn btnPrimary" to={`/courses/${c.id}`}>Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
