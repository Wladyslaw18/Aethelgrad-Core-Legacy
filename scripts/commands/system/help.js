/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Help Command
// Shows all available commands and their functions

import { BaseCommand } from '../base/BaseCommand.js';
import { CustomCommandStatus } from "@minecraft/server";

export class HelpCommand extends BaseCommand {
    constructor() {
        super({
            name: "help",
            description: "Shows all available commands and their functions",
            department: null // Anyone can use help
        });
    }
    
    execute(sender, args) {
        // BaseCommand ensures sender is a player entity
        // No need for player check since commands are player-only
        
        const helpText = [
            "§6=== Aethelgrad Core Commands ===",
            "",
            "§eHub Commands (requires AEH tag):",
            "§7/ae:sethub §f- Set hub location to your position",
            "§7/ae:setradius <radius> §f- Set hub protection radius",
            "§7/ae:banitem §f- Ban held item from hub area",
            "",
            "§ePlayer Commands:",
            "§7/ae:hub §f- Teleport to hub location",
            "§7/ae:hubdebug §f- Check hub zone status",
            "",
            "§eNPC Commands (requires AEN tag):",
            "§7/ae:npctp §f- Set NPC teleport destination",
            "",
            "§eSystem Commands:",
            "§7/ae:bc §f- Broadcast system control (AEB tag)",
            "§7/ae:cleaner §f- Ground item cleaner (AEC tag)",
            "§7/ae:help §f- Show this help",
            "",
            "§6Permission Tags:",
            "§7AEH §f- Hub Manager | §7AEN §f- NPC Manager",
            "§7AEB §f- Broadcast Manager | §7AEC §f- Cleaner Manager",
            "§7AE §f- Master Admin (access to all)",
            "",
            "§6Use /ae:help for command assistance"
        ];
        
        return { 
            status: CustomCommandStatus.Success, 
            message: helpText.join("\n") 
        };
    }
}
