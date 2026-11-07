import {
  type Task,
  type TaskCheckpoint,
  type TaskEvent,
  type TaskStep
} from "./task.js";

export type StepExecutor = (
  step: Readonly<TaskStep>,
  task: Readonly<Task>
) => Promise<string>;

export interface OrchestrationResult {
  task: Task;
  events: TaskEvent[];
  checkpoints: TaskCheckpoint[];
}

function event(
  taskId: string,
  type: TaskEvent["type"],
  message: string,
  stepId?: string
): TaskEvent {
  return {
    id: globalThis.crypto.randomUUID(),
    taskId,
    type,
    message,
    createdAt: new Date().toISOString(),
    ...(stepId ? { stepId } : {})
  };
}

function validateDependencies(steps: TaskStep[]): void {
  const byId = new Map(steps.map((step) => [step.id, step]));
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (id: string): void => {
    if (visiting.has(id)) throw new Error(`Dependency cycle detected at "${id}".`);
    if (visited.has(id)) return;
    const step = byId.get(id);
    if (!step) throw new Error(`Unknown step dependency "${id}".`);
    visiting.add(id);
    for (const dependency of step.dependsOn) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  };

  for (const step of steps) visit(step.id);
}

/**
 * Runs a task sequentially, respecting dependencies and persisting
 * resumable checkpoint objects in the returned result.
 *
 * This first implementation is deliberately in-memory: it makes no
 * provider, database, network, or external-tool calls.
 */
export async function executeTask(
  input: Task,
  executor: StepExecutor
): Promise<OrchestrationResult> {
  const task: Task = {
    ...input,
    steps: input.steps.map((step) => ({
      ...step,
      dependsOn: [...step.dependsOn]
    })),
    status: "running",
    updatedAt: new Date().toISOString()
  };
  const events: TaskEvent[] = [event(task.id, "task.started", "Task execution started.")];
  const checkpoints: TaskCheckpoint[] = [];

  try {
    validateDependencies(task.steps);

    const completed = new Set(
      task.steps.filter((step) => step.status === "completed").map((step) => step.id)
    );

    while (completed.size < task.steps.length) {
      const next = task.steps.find(
        (step) =>
          step.status === "pending" &&
          step.dependsOn.every((dependency) => completed.has(dependency))
      );

      if (!next) {
        const pending = task.steps.filter((step) => step.status === "pending");
        if (pending.length > 0) {
          throw new Error(
            `No executable step remains; unresolved dependencies: ${pending.map((step) => step.id).join(", ")}.`
          );
        }
        break;
      }

      next.status = "running";
      task.updatedAt = new Date().toISOString();
      events.push(event(task.id, "step.started", `Started: ${next.title}`, next.id));

      try {
        next.result = await executor({ ...next }, { ...task, steps: [...task.steps] });
        next.status = "completed";
        completed.add(next.id);
        events.push(event(task.id, "step.completed", `Completed: ${next.title}`, next.id));

        const following = task.steps.find(
          (step) =>
            step.status === "pending" &&
            step.dependsOn.every((dependency) => completed.has(dependency))
        );
        const checkpoint: TaskCheckpoint = {
          taskId: task.id,
          completedStepIds: [...completed],
          summary: task.steps
            .filter((step) => completed.has(step.id))
            .map((step) => `${step.title}: ${step.result ?? "completed"}`)
            .join("\n"),
          createdAt: new Date().toISOString(),
          ...(following ? { nextStepId: following.id } : {})
        };
        checkpoints.push(checkpoint);
        events.push(event(task.id, "checkpoint.created", "Checkpoint saved."));
      } catch (error) {
        next.status = "failed";
        task.status = "failed";
        task.error = error instanceof Error ? error.message : String(error);
        events.push(event(task.id, "step.failed", task.error, next.id));
        events.push(event(task.id, "task.failed", "Task stopped after a step failure."));
        task.updatedAt = new Date().toISOString();
        return { task, events, checkpoints };
      }
    }

    task.status = "completed";
    task.result = task.steps.map((step) => `${step.title}: ${step.result ?? "completed"}`).join("\n");
    events.push(event(task.id, "task.completed", "All task steps completed."));
    task.updatedAt = new Date().toISOString();
    return { task, events, checkpoints };
  } catch (error) {
    task.status = "failed";
    task.error = error instanceof Error ? error.message : String(error);
    events.push(event(task.id, "task.failed", task.error));
    task.updatedAt = new Date().toISOString();
    return { task, events, checkpoints };
  }
}

/** Creates a fresh task state from a checkpoint without rerunning completed steps. */
export function restoreFromCheckpoint(
  task: Task,
  checkpoint: TaskCheckpoint
): Task {
  if (checkpoint.taskId !== task.id) {
    throw new Error("Checkpoint belongs to a different task.");
  }

  const completed = new Set(checkpoint.completedStepIds);
  return {
    ...task,
    status: "paused",
    error: undefined,
    steps: task.steps.map((step) => ({
      ...step,
      status: completed.has(step.id) ? "completed" : "pending"
    })),
    updatedAt: new Date().toISOString()
  };
}
