export type TaskStatus =
  | "queued"
  | "planning"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export interface TaskStep {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  dependsOn: string[];
  result?: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  objective: string;
  status: TaskStatus;
  steps: TaskStep[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskCheckpoint {
  taskId: string;
  completedStepIds: string[];
  nextStepId?: string;
  summary: string;
  createdAt: string;
}

/**
 * Creates a task in memory. Persistence and orchestration will be added
 * in later phases; this function deliberately performs no external calls.
 */
export function createTask(input: {
  id: string;
  workspaceId: string;
  objective: string;
}): Task {
  const now = new Date().toISOString();

  return {
    id: input.id,
    workspaceId: input.workspaceId,
    objective: input.objective,
    status: "queued",
    steps: [],
    createdAt: now,
    updatedAt: now
  };
}
