import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortalStore } from "../store/portalStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = usePortalStore((s) => s.login);
  const navigate = useNavigate();

  // ✅ FORM SUBMIT HANDLER (YAHI MAIN FUNCTION HAI)
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(email, password);

    const user = usePortalStore.getState().currentUser;
    console.log("✅ LOGGED IN USER:", user);

    navigate("/dashboard"); // force redirect
  } catch (err) {
    alert("Invalid login");
  }
};


  return (
    <div className="loginBg">
      <div className="loginCard">
        <h2 style={{ margin: 0 }}>Exam & Training Portal</h2>
        <p style={{ marginTop: 6, color: "#52607a" }}>
          Demo login (use: admin@corp.local / evaluator@corp.local / learner@corp.local)
        </p>

        {/* ✅ YAHI SE FORM SUBMIT HOTA HAI */}
        <form onSubmit={handleSubmit} style={{ marginTop: 14 }}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontWeight: 800, fontSize: 13 }}>Email</label>
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
              placeholder="Enter password"
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
