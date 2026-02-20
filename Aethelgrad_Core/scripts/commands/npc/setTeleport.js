/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Set Teleport NPC Command
// Sets the destination for the teleport NPC

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
import { hasPermission } from "../../utils/permissionHelper.js";

export class SetTeleportCommand extends BaseCommand {
    constructor() {
        super({
            name: "ae:npctp",
            description: "Set teleport NPC destination to your current location",
            permissionLevel: 0 // FIX: Use numeric 0 instead of CommandPermissionLevel.Any for Stable API
        });
    }
    
    execute(origin, args) {
        const player = origin.sourceEntity;
        
        // FIXED: Use custom permission system instead of Admin level
        if (!hasPermission(player, 'ADMIN')) {
            return { 
                status: CustomCommandStatus.Failure, 
                message: "§cNo permission. Required: AE, AEN, Admin, or admin" 
            };
        }
        
        const loc = player.location;
        world.setDynamicProperty("ae:tp_npc_x", Number(loc.x.toFixed(2)));
        world.setDynamicProperty("ae:tp_npc_y", Number(loc.y.toFixed(2)));
        world.setDynamicProperty("ae:tp_npc_z", Number(loc.z.toFixed(2)));
        
        return { 
            status: CustomCommandStatus.Success, 
            message: `§eTeleport NPC destination set to §aX:${loc.x.toFixed(2)} Y:${loc.y.toFixed(2)} Z:${loc.z.toFixed(2)}` 
        };
    }
}
