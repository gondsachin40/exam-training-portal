import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { usePortalStore } from "./store/portalStore";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseView from "./pages/CourseView";
import ExamPlayer from "./pages/ExamPlayer";
import AttemptHistory from "./pages/AttemptHistory";
import EvaluatorQueue from "./pages/EvaluatorQueue";
import EvaluateAttempt from "./pages/EvaluateAttempt";
import AdminExams from "./admin/AdminExams";
import AdminCreateExam from "./admin/AdminCreateExam";
import AdminQuestions from "./admin/AdminQuestions";
import Certificates from "./pages/Certificates";
import AdminLogin from "./pages/AdminLogin";

// ✅ AUTH GUARD
function RequireAuth() {
  const user = usePortalStore((s) => s.currentUser);
  console.log("✅ RequireAuth USER:", user);

  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// ✅ ROLE GUARD
function RequireRole({ role }: { role: "ADMIN" | "EVALUATOR" | "LEARNER" }) {
  const user = usePortalStore((s) => s.currentUser);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ✅ PROTECTED ROUTES */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseView />} />
          <Route path="/exam/:examId" element={<ExamPlayer />} />
          <Route path="/history" element={<AttemptHistory />} />
          <Route path="/certificates" element={<Certificates />} />

          {/* ✅ EVALUATOR ONLY */}
          <Route element={<RequireRole role="EVALUATOR" />}>
            <Route path="/evaluator" element={<EvaluatorQueue />} />
            <Route path="/evaluator/:attemptId" element={<EvaluateAttempt />} />
          </Route>

          {/* ✅ ADMIN ONLY */}
          <Route element={<RequireRole role="ADMIN" />}>
            <Route path="/admin/exams" element={<AdminExams />} />
            <Route path="/admin/exams/new" element={<AdminCreateExam />} />
            <Route path="/admin/questions/:examId" element={<AdminQuestions />} />
          </Route>
        </Route>

        {/* ✅ FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
