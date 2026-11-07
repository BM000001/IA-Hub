import { createTask } from "./core/task.js";
import { executeTask } from "./core/orchestrator.js";

const demoTask = createTask({
  id: "local-demo",
  workspaceId: "local",
  objective: "Validar o núcleo inicial do IA-Hub",
  steps: [
    { id: "inspect", title: "Inspecionar a solicitação", dependsOn: [] },
    { id: "plan", title: "Organizar as etapas", dependsOn: ["inspect"] },
    { id: "report", title: "Consolidar o resultado", dependsOn: ["plan"] }
  ]
});

const result = await executeTask(demoTask, async (step) => {
  return `Etapa simulada concluída: ${step.title}`;
});

console.log("IA-Hub — núcleo de orquestração local");
console.log(JSON.stringify(result, null, 2));
