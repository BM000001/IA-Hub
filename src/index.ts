import { createTask } from "./core/task.js";

const demoTask = createTask({
  id: "local-demo",
  workspaceId: "local",
  objective: "Validar o núcleo inicial do IA-Hub"
});

console.log("IA-Hub — protótipo local");
console.log(JSON.stringify(demoTask, null, 2));
