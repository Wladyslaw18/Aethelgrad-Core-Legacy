/**
 * ╔═════════════════════════════════════════════════════════════════════════════════╗
   ║                                                                                 ║
   ║    █████╗ ███████╗████████╗██╗  ██╗███████╗██╗      ██████╗ ██████╗  █████╗ ██████╗ ║
   ║   ██╔══██╗██╔════╝╚══██╔══╝██║  ██║██╔════╝██║     ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗║
   ║   ███████║█████╗     ██║   ███████║█████╗  ██║     ██║  ███╗██████╔╝███████║██║  ██║║
   ║   ██╔══██║██╔══╝     ██║   ██╔══██║██╔══╝  ██║     ██║   ██║██╔══██╗██╔══██║██║  ██║║
   ║   ██║  ██║███████╗   ██║   ██║  ██║███████╗███████╗╚██████╔╝██║  ██║██║  ██║██████╔╝║
   ║   ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ║
   ║    ░░░  ░░░░░░░░░░   ░░░   ░░░  ░░░░░░░░░░░░░░░░░░░  ░░░░░░  ░░░  ░░░░░░  ░░░░░░░░  ║
   ║                                                                                 ║
   ║                 ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ ███████╗          ║
   ║                 ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗██╔════╝          ║
   ║                 ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║███████╗          ║
   ║                 ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║╚════██║          ║
   ║                 ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝███████║          ║
   ║                 ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ ╚══════╝          ║
   ║                  ░░░░░░░   ░░░     ░░░░░░ ░░░░░░  ░░░ ░░░░░░  ░░░░░░░           ║
   ║                                                                                 ║
   ╟─────────────────────────────────────────────────────────────────────────────────╢
   ║  [ STATUS: ARCHIVAL ]  [ MODULE: CORE_LEGACY ]  [ LICENSE: GNU LGPL v3 ]        ║
   ║  [ ENGINE: BEDROCK  ]  [ SCRIPT API: 2.5.0  ]  [ BUILD: 2026.02.20     ]        ║
   ╟─────────────────────────────────────────────────────────────────────────────────╢
   ║                                                                                 ║
   ║           > INITIALIZING LEGACY BRIDGE...                      [ DONE ]         ║
   ║           > LOADING NATIVE TYPE CONVERSIONS...                 [ DONE ]         ║
   ║           > BYPASSING API LIMITATIONS...                       [ ACTIVE ]       ║
   ║                                                                                 ║
   ║                        •  L E G A C Y   E D I T I O N  •                        ║
   ║                                                                                 ║
   ╚═════════════════════════════════════════════════════════════════════════════════╝
 *________________________________________________________________________________
 *
 * @file main.js
 * @description Main entry point and orchestrator for Aethelgrad Core addon
 * @job Coordinates startup sequence and initializes all system modules
 * 
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 Aethelgrad Studio and WladyslawKW or Wladyslaw Kowalski
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 * 
 * Startup sequence:
 * 1. Core systems (utilities, global configurations)
 * 2. Gameplay features (hub protection, NPCs, kits, etc.)
 * 3. Background services (broadcasts, cleaner, regeneration)
 * 4. Command system (all commands with validation)
 * 
 * Used by: Minecraft Bedrock Edition as the addon entry point
 * 
 * @author Aethelgrad Core Development Team
 * @version 2.5.0
 */

import { init as initCore } from "./bootstrap/core.js";
import { init as initFeatures } from "./bootstrap/features.js";
import { init as initServices } from "./bootstrap/services.js";
import { system } from "@minecraft/server";
import { registerAllCommands } from "./commands/index.js";

console.log("[Aethelgrad] Starting Aethelgrad Core initialization...");

/**
 * Main startup sequence - initializes all systems in correct order
 */
system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    try {
        // Initialize command system with all commands
        registerAllCommands(customCommandRegistry);
        console.log("[Aethelgrad] Command system initialized with centralized registry.");
    } catch (error) {
        console.error("[Aethelgrad] Failed to initialize command system:", error);
    }
});

// Initialize core systems (utilities, global configurations)
initCore();

// Initialize gameplay features (hub protection, NPCs, kits, etc.)
initFeatures();

// Initialize background services (broadcasts, cleaner, regeneration)
initServices();

console.log("[Aethelgrad] All core modules have successfully initialized.");