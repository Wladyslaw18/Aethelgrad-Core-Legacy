/**
 * ╔═════════════════════════════════════════════════════════════════╗
 *                                                                             ║
 *   ║    ᚠᚢᚦᚨᚱ     ᛊᛏᚢᛞᛁᛟᛊ                                           ║
 *   ║                                                                             ║
 *   ║   ᚠᚢᚦᚨᚱᛊᛏᚢᛞᛁᛟᛊ     ᛊᛏᚢᛞᛁᛟᛊ  •  ᚠᚢᚦᚨᚱᛊᛏᚢᛞᛁᛟᛊ          ║
 *   ║                                                                             ║
 *   ╚═══════════════════════════════════════════════════════════════════════╝
 *
 *                     S  T  U  D  I  O  S  |  L E G A C Y
 *________________________________________________________________________________
 *
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 Aethelgrad Studio and WladyslawKW or Wladyslaw Kowalski
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Command Registry Utilities
// Centralized command registration and management

export class CommandRegistry {
    constructor() {
        this.commands = new Map();
    }
    
    /**
     * Register a command with the registry
     * @param {BaseCommand} command - Command instance to register
     * @param {Object} customCommandRegistry - Minecraft command registry
     */
    registerCommand(command, customCommandRegistry) {
        this.commands.set(command.name, command);
        command.register(customCommandRegistry);
    }
    
    /**
     * Register multiple commands at once
     * @param {BaseCommand[]} commands - Array of command instances
     * @param {Object} customCommandRegistry - Minecraft command registry
     */
    registerCommands(commands, customCommandRegistry) {
        commands.forEach(command => this.registerCommand(command, customCommandRegistry));
    }
    
    /**
     * Get a command by name
     * @param {string} name - Command name
     * @returns {BaseCommand|null} Command instance or null
     */
    getCommand(name) {
        return this.commands.get(name) || null;
    }
    
    /**
     * Get all registered commands
     * @returns {BaseCommand[]} Array of command instances
     */
    getAllCommands() {
        return Array.from(this.commands.values());
    }
    
    /**
     * Get commands by category (based on folder structure)
     * @param {string} category - Category name (hub, npc, system, test)
     * @returns {BaseCommand[]} Array of command instances
     */
    getCommandsByCategory(category) {
        return this.getAllCommands().filter(cmd => 
            cmd.name.startsWith(`ae:${category.toLowerCase()}`) || 
            cmd.name.startsWith(`ae:${category}`)
        );
    }
    
    /**
     * Log registration summary
     */
    logSummary() {
        const total = this.commands.size;
        const categories = {
            hub: this.getCommandsByCategory('hub').length,
            npc: this.getCommandsByCategory('npc').length,
            system: this.getCommandsByCategory('system').length,
            test: this.getCommandsByCategory('test').length
        };
        
        console.warn(`[CommandRegistry] Registered ${total} commands:`);
        console.warn(`[CommandRegistry] - Hub: ${categories.hub} commands`);
        console.warn(`[CommandRegistry] - NPC: ${categories.npc} commands`);
        console.warn(`[CommandRegistry] - System: ${categories.system} commands`);
        console.warn(`[CommandRegistry] - Test: ${categories.test} commands`);
    }
}
