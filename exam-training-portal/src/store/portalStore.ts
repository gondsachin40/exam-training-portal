import { create } from "zustand";
import { Exam, Attempt, User, Course, Question } from "../lib/types";

type PortalState = {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  exams: Exam[];
  attempts: Attempt[];

  // ✅ AUTH
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  // ✅ exam flows
  startAttempt: (examId: string) => string;
  saveAnswer: (attemptId: string, qId: string, response: any) => void;
  submitAttempt: (attemptId: string) => void;

  // ✅ evaluator flows
  assignEvaluator: (attemptId: string, evaluatorId: string) => void;
  finalizeEvaluation: (
    attemptId: string,
    opts: { evaluatorScore: number; remarks?: string }
  ) => void;

  // ✅ admin flows
  createExam: (exam: Omit<Exam, "id">) => string;
  addQuestion: (examId: string, q: Omit<Question, "id">) => string;
};

// ----------------------------------------

const uid = () =>
  Math.random().toString(16).slice(2) + Date.now().toString(16);

const demoUsers: User[] = [
  {
    id: "u_admin",
    name: "Admin (You)",
    email: "admin@corp.local",
    role: "ADMIN",
    teams: ["Core"],
  },
  {
    id: "u_eval",
    name: "SME (Evaluator)",
    email: "evaluator@corp.local",
    role: "EVALUATOR",
    teams: ["Core"],
  },
  {
    id: "u_learner",
    name: "Learner",
    email: "learner@corp.local",
    role: "LEARNER",
    teams: ["Core"],
  },
];

const demoCourses: Course[] = [
  {
    id: "c1",
    title: "Onboarding & Assessment Basics",
    description: "Portal workflow + quality expectations (docs & short videos).",
    modules: [
      {
        id: "m1",
        title: "Portal Fundamentals",
        order: 1,
        topics: [
          {
            id: "t1",
            title: "How exams work (Pass/Fail)",
            contentUrl: "https://example.com/placeholder",
          },
        ],
      },
    ],
  },
];

const demoExam: Exam = {
  id: "ex1",
  title: "Quality & Process Check (Pass/Fail)",
  description: "Objective auto-grade + descriptive evaluation when present.",
  passPct: 60,
  maxAttempts: 2,
  durationMins: 30,
  teamScope: ["Core"],
  questions: [
    {
      id: "q1",
      type: "MCQ",
      text: "Which tag links an external stylesheet?",
      options: ["<script>", "<link>", "<style>", "<css>"],
      answerKey: [1],
    },
    {
      id: "q2",
      type: "TRUE_FALSE",
      text: "CSS 'color' property changes text color.",
      options: ["False", "True"],
      answerKey: [1],
    },
  ],
};

// ----------------------------------------

export const usePortalStore = create<PortalState>((set, get) => ({
  currentUser: null,
  users: demoUsers,
  courses: demoCourses,
  exams: [demoExam],
  attempts: [],

  // ✅ ✅ FLASK LOGIN (FIXED)
  login: async (email: string, password: string) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    localStorage.setItem("token", data.token);
    set({ currentUser: data.user });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ currentUser: null });
  },

  // ✅ exam start
  startAttempt: (examId) => {
    const { currentUser, attempts } = get();
    if (!currentUser) return "";

    const exam = get().exams.find((e) => e.id === examId);
    if (!exam) return "";

    const taken = attempts.filter(
      (a) => a.examId === examId && a.userId === currentUser.id
    );

    if (taken.length >= exam.maxAttempts) return "";

    const attempt: Attempt = {
      id: uid(),
      examId,
      userId: currentUser.id,
      startedAt: Date.now(),
      status: "IN_PROGRESS",
      objectiveScore: 0,
      assignedEvaluatorIds: [],
      answers: [],
    };

    set({ attempts: [attempt, ...attempts] });
    return attempt.id;
  },

  // ✅ autosave
  saveAnswer: (attemptId, qId, response) => {
    const { attempts } = get();

    set({
      attempts: attempts.map((a) => {
        if (a.id !== attemptId) return a;
        const others = a.answers.filter((x) => x.questionId !== qId);
        return { ...a, answers: [...others, { questionId: qId, response }] };
      }),
    });
  },

  // ✅ submit
  submitAttempt: (attemptId) => {
    const { attempts, exams } = get();

    const next = attempts.map((a) => {
      if (a.id !== attemptId) return a;
      const exam = exams.find((e) => e.id === a.examId)!;

      let totalObj = 0;
      let correctObj = 0;

      for (const q of exam.questions) {
        if (
          q.type === "MCQ" ||
          q.type === "MULTI" ||
          q.type === "TRUE_FALSE"
        ) {
          totalObj += 1;
          const ans = a.answers.find((x) => x.questionId === q.id);
          const resp: number[] = Array.isArray(ans?.response)
            ? ans!.response
            : [];
          const key = q.answerKey || [];

          const isCorrect =
            resp.length === key.length &&
            resp.every((v) => key.includes(v));

          if (isCorrect) correctObj += 1;
        }
      }

      const objectiveScore =
        totalObj === 0 ? 0 : Math.round((correctObj / totalObj) * 100);

      return {
        ...a,
        submittedAt: Date.now(),
        status: "FINALIZED",
        objectiveScore,
        finalScore: objectiveScore,
        pass: objectiveScore >= exam.passPct,
      };
    });

    set({ attempts: next });
  },

  assignEvaluator: () => {},

  finalizeEvaluation: () => {},

  createExam: (exam) => {
    const id = uid();
    set({ exams: [{ ...exam, id }, ...get().exams] });
    return id;
  },

  addQuestion: (examId, q) => {
    const id = uid();
    set({
      exams: get().exams.map((e) =>
        e.id !== examId
          ? e
          : { ...e, questions: [...e.questions, { ...q, id }] }
      ),
    });
    return id;
  },
}));
