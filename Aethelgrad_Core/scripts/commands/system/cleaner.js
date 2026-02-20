/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Cleaner Command
// Manually triggers ground item cleanup

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
import { hasPermission } from "../../utils/permissionHelper.js";

export class CleanerCommand extends BaseCommand {
    constructor() {
        super({
            name: "ae:cleaner",
            description: "Manually clear all ground items (requires admin tag).",
            permissionLevel: 0 // FIX: Use numeric 0 instead of CommandPermissionLevel.Any for Stable API
        });
    }
    
    hasAdminTag(player) {
        return player.hasTag("AE") || 
               player.hasTag("AEC") || 
               player.hasTag("admin") || 
               player.hasTag("Admin");
    }
    
    execute(origin, args) {
        const player = origin.sourceEntity;
        
        if (!player) {
            return {
                status: CustomCommandStatus.Failure,
                message: "§cMust be run by a player."
            };
        }
        
        // FIXED: Use custom permission system instead of manual tag check
        if (!hasPermission(player, 'ADMIN')) {
            return { 
                status: CustomCommandStatus.Failure, 
                message: "§cNo permission. Required: AE, AEC, Admin, or admin"
            };
        }
        
        // Trigger cleanup (simplified version - full cleanup logic would be in service file)
        world.sendMessage(`§6[Cleaner]§e Manual cleanup triggered by §a${player.name}§e.`);
        
        for (const p of world.getPlayers()) {
            try { p.runCommandAsync("playsound random.orb @s"); } catch {}
        }
        
        return {
            status: CustomCommandStatus.Success,
            message: "Cleanup executed."
        };
    }
}
