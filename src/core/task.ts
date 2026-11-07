export type TaskStatus =
  | "queued"
  | "planning"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type StepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export interface TaskStep {
  id: string;
  title: string;
  status: StepStatus;
  dependsOn: string[];
  result?: string;
  assignedAgentId?: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  objective: string;
  status: TaskStatus;
  steps: TaskStep[];
  createdAt: string;
  updatedAt: string;
  result?: string;
  error?: string;
}

export interface TaskCheckpoint {
  taskId: string;
  completedStepIds: string[];
  nextStepId?: string;
  summary: string;
  createdAt: string;
}

export interface TaskEvent {
  id: string;
  taskId: string;
  type:
    | "task.created"
    | "task.started"
    | "step.started"
    | "step.completed"
    | "step.failed"
    | "checkpoint.created"
    | "task.completed"
    | "task.failed";
  message: string;
  createdAt: string;
  stepId?: string;
}

export function createTask(input: {
  id: string;
  workspaceId: string;
  objective: string;
  steps?: Array<Pick<TaskStep, "id" | "title" | "dependsOn">>;
}): Task {
  if (!input.id.trim()) throw new Error("Task id is required.");
  if (!input.workspaceId.trim()) throw new Error("Workspace id is required.");
  if (!input.objective.trim()) throw new Error("Task objective is required.");

  const stepIds = new Set<string>();
  const steps: TaskStep[] = (input.steps ?? []).map((step) => {
    if (!step.id.trim() || stepIds.has(step.id)) {
      throw new Error(`Step id is empty or duplicated: ${step.id}`);
    }
    stepIds.add(step.id);
    return {
      id: step.id,
      title: step.title,
      status: "pending",
      dependsOn: [...step.dependsOn]
    };
  });

  for (const step of steps) {
    for (const dependency of step.dependsOn) {
      if (!stepIds.has(dependency)) {
        throw new Error(`Unknown dependency "${dependency}" in step "${step.id}".`);
      }
      if (dependency === step.id) {
        throw new Error(`Step "${step.id}" cannot depend on itself.`);
      }
    }
  }

  const now = new Date().toISOString();
  return {
    id: input.id,
    workspaceId: input.workspaceId,
    objective: input.objective,
    status: "queued",
    steps,
    createdAt: now,
    updatedAt: now
  };
}
