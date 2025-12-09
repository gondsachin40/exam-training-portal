export type Role = "ADMIN" | "EVALUATOR" | "LEARNER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  teams: string[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  modules: Module[];
};

export type Module = {
  id: string;
  title: string;
  order: number;
  topics: Topic[];
};

export type Topic = {
  id: string;
  title: string;
  contentUrl?: string; // pdf/video/link (MVP: just stored)
};

export type QuestionType = "MCQ" | "MULTI" | "TRUE_FALSE" | "SHORT" | "LONG" | "FILE";

export type Question = {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];          // for MCQ/MULTI/TRUE_FALSE
  answerKey?: number[];        // indices of correct options (MCQ: [0], MULTI: [0,2])
  rubric?: string;             // for descriptive evaluation
};

export type Exam = {
  id: string;
  title: string;
  description: string;
  passPct: number;              // pass threshold (Pass/Fail)
  maxAttempts: number;
  durationMins?: number;
  teamScope: string[];          // which teams can take
  questions: Question[];
};

export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "PENDING_EVAL" | "FINALIZED";

export type Attempt = {
  id: string;
  examId: string;
  userId: string;
  startedAt: number;
  submittedAt?: number;
  status: AttemptStatus;
  objectiveScore: number;       // 0..100 (calculated)
  evaluatorScore?: number;      // optional override after manual grading
  finalScore?: number;          // used for Pass/Fail
  pass?: boolean;
  assignedEvaluatorIds: string[];
  answers: Answer[];
  evaluatorRemarks?: string;
};

export type Answer = {
  questionId: string;
  response: any;                // number[] | string | { fileName?: string }
  autoScore?: number;           // 0..100 for objective
  evaluatorScore?: number;      // 0..100 for descriptive
};
