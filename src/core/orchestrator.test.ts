import test from "node:test";
import assert from "node:assert/strict";
import { createTask } from "./task.js";
import { executeTask, restoreFromCheckpoint } from "./orchestrator.js";

test("executes steps in dependency order and creates checkpoints", async () => {
  const task = createTask({
    id: "task-1",
    workspaceId: "workspace-1",
    objective: "Run a small plan",
    steps: [
      { id: "first", title: "First", dependsOn: [] },
      { id: "second", title: "Second", dependsOn: ["first"] }
    ]
  });
  const order: string[] = [];

  const result = await executeTask(task, async (step) => {
    order.push(step.id);
    return `result-${step.id}`;
  });

  assert.deepEqual(order, ["first", "second"]);
  assert.equal(result.task.status, "completed");
  assert.equal(result.checkpoints.length, 2);
  assert.equal(result.events.filter((item) => item.type === "step.completed").length, 2);
});

test("stops safely when a step fails and preserves completed work", async () => {
  const task = createTask({
    id: "task-2",
    workspaceId: "workspace-1",
    objective: "Handle a failure",
    steps: [
      { id: "first", title: "First", dependsOn: [] },
      { id: "second", title: "Second", dependsOn: ["first"] }
    ]
  });

  const result = await executeTask(task, async (step) => {
    if (step.id === "second") throw new Error("simulated failure");
    return "saved";
  });

  assert.equal(result.task.status, "failed");
  assert.equal(result.task.steps[0]?.status, "completed");
  assert.equal(result.task.steps[1]?.status, "failed");
  assert.equal(result.checkpoints.length, 1);
});

test("restores completed steps from a checkpoint", async () => {
  const task = createTask({
    id: "task-3",
    workspaceId: "workspace-1",
    objective: "Resume",
    steps: [
      { id: "first", title: "First", dependsOn: [] },
      { id: "second", title: "Second", dependsOn: ["first"] }
    ]
  });
  const result = await executeTask(task, async () => "ok");
  const restored = restoreFromCheckpoint(task, result.checkpoints[0]!);

  assert.equal(restored.status, "paused");
  assert.equal(restored.steps[0]?.status, "completed");
  assert.equal(restored.steps[1]?.status, "pending");
});

test("rejects dependency cycles", async () => {
  const task = createTask({
    id: "task-4",
    workspaceId: "workspace-1",
    objective: "Reject cycles",
    steps: [
      { id: "first", title: "First", dependsOn: ["second"] },
      { id: "second", title: "Second", dependsOn: ["first"] }
    ]
  });

  const result = await executeTask(task, async () => "unreachable");
  assert.equal(result.task.status, "failed");
  assert.match(result.task.error ?? "", /cycle/i);
});
