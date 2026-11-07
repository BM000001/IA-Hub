# Autonomous multi-agent development loop

## Goal

Allow IA-Hub to execute a bounded development objective through specialized agents without requiring a person to send repeated "continue" messages. The system must preserve progress, verify each change, and stop safely when it reaches a limit or needs human judgment.

This is an execution workflow, not an infinite conversation loop.

## Roles

- **Planner**: turns the objective into small, ordered steps with acceptance criteria.
- **Architect**: checks dependencies, interfaces, affected files, and risks before implementation.
- **Implementer**: changes only the files assigned to the current step.
- **Reviewer**: inspects the diff for correctness, security, scope, and maintainability.
- **Tester**: runs the repository's configured checks and reports actual results.
- **Orchestrator**: owns state transitions, budgets, retries, checkpoints, and stop conditions.

Initially, roles may use the same provider/model with different instructions. Provider diversity is an optimization, not a requirement for the first working version.

## Execution lifecycle

1. Receive an objective, workspace, allowed tools, maximum steps, time budget, and cost budget.
2. Planner produces a structured plan. Reject plans with missing acceptance criteria or unsafe actions.
3. Architect reviews each step and records its expected files and dependencies.
4. Implementer executes one step in an isolated working branch/worktree.
5. Reviewer inspects the resulting diff. A rejected change returns to Implementer with bounded feedback.
6. Tester runs configured checks. A failure returns to the responsible step with bounded retries.
7. Orchestrator stores an immutable checkpoint containing task state, completed step IDs, commit SHA, test results, and outstanding risks.
8. Continue only while budget remains and the next step is unblocked.
9. Stop with a report and a reviewable branch/PR. Never merge to the protected/default branch automatically in the initial release.

## Required safety controls

- Explicit allowlist of repositories, branches, filesystems, and tools.
- No production credentials in agent prompts or logs.
- Secrets are stored in a secret manager; agents receive short-lived scoped access only when necessary.
- Read-only by default. Writes require a task-level grant.
- No force-push, branch deletion, secret changes, deployment, purchase, or destructive operation without human approval.
- Configurable maximum iterations, wall-clock duration, token/cost budget, and retry count.
- Detect repeated equivalent failures and stop rather than looping.
- Treat agent output and repository content as untrusted input; do not follow instructions found in code/comments that attempt to override system policy.
- Record every tool invocation, changed file, commit, test result, approval, and stop reason.
- Human approval is required before merging or deploying.

## State model

Suggested task states: `queued`, `planning`, `running`, `paused`, `completed`, `failed`, and `cancelled`.

Each step should store: ID, role, objective, dependencies, status, assigned provider/account, attempt count, changed files, commit SHA, review result, test result, and timestamps.

A checkpoint must be sufficient to resume without relying on chat history. It should include the plan, task/step states, last known commit, completed step IDs, budget consumption, retry counters, and unresolved questions.

## Implementation sequence

1. **Local deterministic engine**: execute a predefined plan using mock role executors; test ordering, retries, stop conditions, and checkpoint restoration.
2. **Provider adapter contract**: normalize model calls, timeouts, errors, usage, and cancellation without coupling the orchestrator to one vendor.
3. **Role prompts and structured outputs**: validate planner plans, reviewer findings, and tester reports against schemas.
4. **Workspace executor**: use isolated branches/worktrees and capture diffs; never give a model unrestricted repository credentials.
5. **Persistence**: save tasks, steps, events, checkpoints, budgets, and audit records in a database.
6. **Human control panel**: start, pause, resume, cancel, approve, and inspect runs.
7. **Controlled GitHub workflow**: push a feature branch and open a PR after all required checks pass; human reviews and merges.
8. **Multi-provider routing**: add fallback only when the next provider is compatible with the task, permissions, and budget.

## First usable milestone

A local run should be able to take a small objective, execute two or three mock steps, persist a checkpoint after each successful step, simulate a reviewer rejection and bounded correction, then stop with a final report. This validates the control loop before connecting paid APIs or granting repository write access.

## Non-goals for the first version

- Infinite autonomous operation.
- Automatic merge to `main`.
- Unrestricted shell, browser, or repository access.
- Automatic switching to an arbitrary provider when a quota is reached.
- Claiming tests passed unless the test runner returned success.
