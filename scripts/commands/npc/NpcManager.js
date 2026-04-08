/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// NPC Manager Command
// Manages NPC interactions and teleport destinations

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CustomCommandStatus, system } from "@minecraft/server";

export class NpcManager extends BaseCommand {
    constructor() {
        super({
            name: "npc",
            description: "Manage NPC teleport destinations",
            department: "n" // NPC department requires AEN tag
        });
    }
    
    execute(sender, args) {
        // Permission handled by BaseCommand department system
        
        const subcommand = args[0]?.toLowerCase();
        
        switch (subcommand) {
            case "settp":
                return this.setTeleport(sender, args.slice(1));
            case "list":
                return this.listDestinations(sender);
            default:
                return { 
                    status: CustomCommandStatus.Failure, 
                    message: "§cUsage: !aen npc <settp|list>" 
                };
        }
    }
    
    setTeleport(sender, args) {
        const loc = sender.location;
        
        world.setDynamicProperty("ae:npc_tp_x", Math.floor(loc.x));
        world.setDynamicProperty("ae:npc_tp_y", Math.floor(loc.y));
        world.setDynamicProperty("ae:npc_tp_z", Math.floor(loc.z));
        
        return { 
            status: CustomCommandStatus.Success, 
            message: "§eNPC teleport location saved." 
        };
    }
    
    listDestinations(sender) {
        const x = world.getDynamicProperty("ae:npc_tp_x");
        const y = world.getDynamicProperty("ae:npc_tp_y");
        const z = world.getDynamicProperty("ae:npc_tp_z");
        
        if (x === undefined || y === undefined || z === undefined) {
            return { 
                status: CustomCommandStatus.Failure, 
                message: "§cNo NPC teleport destination set." 
            };
        }
        
        return { 
            status: CustomCommandStatus.Success, 
            message: `§eNPC Teleport: §a${x}, ${y}, ${z}` 
        };
    }
}
