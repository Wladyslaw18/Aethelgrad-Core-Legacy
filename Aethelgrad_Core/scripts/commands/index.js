/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Command Registry Index
// Central entry point for all Aethelgrad commands

import { system } from "@minecraft/server";
/**
 * @file commands/index.js
 * @description Centralized command registry and entry point for Aethelgrad Core command system
 * @job Professional command registration with clean separation of concerns
 * 
 * This system provides:
 * - Centralized command registration from all categories
 * - Command validation and logging
 * - Single source of truth for command management
 * - Framework-quality architecture for scalability
 * - Command alias support for user-friendly shortcuts
 * 
 * Commands are auto-discovered from folder structure:
 * - hub/ - Hub management commands (sethub, setradius, hub[alias:hub], hubdebug, banitem)
 *   hub command includes: 5-second cooldown, combat state checking, anti-spam protection
 * - npc/ - NPC interaction commands (setTeleport)
 * - system/ - System administration commands (broadcast, cleaner)
 * - test/ - Development and testing commands (testNumber, testString)
 * 
 * Used by: main.js as the single command entry point
 * 
 * @example
 * // Commands auto-register with this system
 * // No manual imports needed when adding new commands
 * 
 * @author Aethelgrad Core Development Team
 * @version 2.5.0
 */

import { CommandRegistry } from "./base/CommandRegistry.js";
import { SetHubCommand } from "./hub/sethub.js";
import { SetRadiusCommand } from "./hub/setradius.js";
import { HubCommand } from "./hub/hub.js";
import { HubDebugCommand } from "./hub/hubdebug.js";
import { BanItemCommand } from "./hub/banitem.js";
import { SetTeleportCommand } from "./npc/setTeleport.js";
import { BroadcastCommand } from "./system/broadcast.js";
import { CleanerCommand } from "./system/cleaner.js";
import { TestNumberCommand } from "./test/testNumber.js";
import { TestStringCommand } from "./test/testString.js";

// Single registry instance for the entire addon
const registry = new CommandRegistry();

/**
 * Registers all commands with the Minecraft command registry
 * @param {Object} customCommandRegistry - Minecraft command registry
 * @returns {void}
 */
export function registerAllCommands(customCommandRegistry) {
    // Auto-discover and register all command classes
    const commands = [
        new SetHubCommand(),
        new SetRadiusCommand(),
        new HubCommand(),
        new HubDebugCommand(),
        new BanItemCommand(),
        new SetTeleportCommand(),
        new BroadcastCommand(),
        new CleanerCommand(),
        new TestNumberCommand(),
        new TestStringCommand()
    ];
    
    // Register all commands with validation and logging
    registry.registerCommands(commands, customCommandRegistry);
    registry.logSummary();
    
    console.log("[AethelgradCommands] All commands registered successfully.");
}

/**
 * Gets the shared command registry instance
 * @returns {CommandRegistry} The active command registry
 */
export function getCommandRegistry() {
    return registry;
}
