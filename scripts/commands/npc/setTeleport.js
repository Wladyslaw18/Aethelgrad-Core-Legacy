/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Set Teleport Command
// Sets NPC teleport destination to player's current location

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CustomCommandStatus } from "@minecraft/server";

export class SetTeleportCommand extends BaseCommand {
    constructor() {
        super({
            name: "npctp",
            description: "Set NPC teleport destination",
            department: "n" // NPC department requires AEN tag
        });
    }
    
    execute(sender, args) {
        // BaseCommand ensures sender is a player entity
        // No need for player check since commands are player-only
        
        // Permission handled by BaseCommand department system
        
        const loc = sender.location;
        
        world.setDynamicProperty("ae:npc_tp_x", Math.floor(loc.x));
        world.setDynamicProperty("ae:npc_tp_y", Math.floor(loc.y));
        world.setDynamicProperty("ae:npc_tp_z", Math.floor(loc.z));
        
        return { 
            status: CustomCommandStatus.Success, 
            message: "§eNPC teleport location saved." 
        };
    }
}
