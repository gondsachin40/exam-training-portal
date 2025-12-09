import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortalStore } from "../store/portalStore";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@corp.local");
  const [password, setPassword] = useState("");
  const login = usePortalStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const user = usePortalStore.getState().currentUser;
      if (user?.role !== "ADMIN") {
        alert("This account is not an admin");
        return;
      }
      navigate("/admin/exams");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="loginBg">
      <div className="loginCard">
        <h2 style={{ margin: 0 }}>Admin Portal</h2>
        <p style={{ marginTop: 6, color: "#52607a" }}>
          Sign in as Admin to manage exams, questions, and users.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 14 }}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontWeight: 800, fontSize: 13 }}>Admin Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 800, fontSize: 13 }}>Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btnPrimary"
            type="submit"
            style={{ width: "100%" }}
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
}
