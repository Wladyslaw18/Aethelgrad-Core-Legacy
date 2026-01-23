import { system } from "@minecraft/server";
import { initHubRules } from "../features/hub/hubRules.js";
import { registerHubCommand } from "../features/hub/hubCommand.js";

export function init() {
    // Initialize passive hub rules (protections, inventory checks)
    initHubRules();

    // Register commands
    system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
        registerHubCommand(customCommandRegistry);
    });

    console.warn("[AethelgradHub] Hub protection and commands LOADED.");
}