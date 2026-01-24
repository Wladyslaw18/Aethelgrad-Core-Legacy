import { init as initNpc } from "./bootstrap/npc.js";
import { init as initHub } from "./bootstrap/hub.js";
import { init as initServices } from "./bootstrap/services.js";

console.warn("[Aethelgrad] Core modules are starting initialization...");

initHub();
initNpc();
initServices();

console.warn("[Aethelgrad] All core modules have successfully initialized.");