/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Hub Debug Command
// Shows hub zone information and player status

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";

export class HubDebugCommand extends BaseCommand {
    constructor() {
        super({
            name: "ae:hubdebug",
            description: "Check if you're in the hub protection zone",
            permissionLevel: 0 // FIX: Use numeric 0 instead of CommandPermissionLevel.Any for Stable API
        });
    }
    
    getHubConfig() {
        const x = world.getDynamicProperty("ae:hub_x");
        const y = world.getDynamicProperty("ae:hub_y");
        const z = world.getDynamicProperty("ae:hub_z");
        const radius = world.getDynamicProperty("ae:hub_radius");
        
        if (x === undefined || y === undefined || z === undefined) {
            return null;
        }
        
        return {
            center: { x: Number(x), y: Number(y), z: Number(z) },
            radius: radius === undefined ? 260 : Number(radius)
        };
    }
    
    isBypass(player) {
        return player.hasTag("AE") || 
               player.hasTag("admin") || 
               player.hasTag("Admin") || 
               player.hasTag("AEh_manager");
    }
    
    execute(origin, args) {
        const player = origin.sourceEntity;
        const cfg = this.getHubConfig();
        
        if (!cfg) {
            return {
                status: CustomCommandStatus.Failure,
                message: "§cHub location is not set."
            };
        }
        
        const loc = player.location;
        const dx = Math.abs(loc.x - cfg.center.x);
        const dz = Math.abs(loc.z - cfg.center.z);
        const dy = Math.abs(loc.y - cfg.center.y);
        
        const horizontalCheck = dx <= cfg.radius && dz <= cfg.radius;
        const heightCheck = dy <= 256;
        const inHubZone = horizontalCheck && heightCheck;
        const bypass = this.isBypass(player);
        
        return { 
            status: CustomCommandStatus.Success, 
            message: `§eHub Debug:\n` +
                   `§7Position: §a${loc.x.toFixed(2)}, ${loc.y.toFixed(2)}, ${loc.z.toFixed(2)}\n` +
                   `§7Center: §a${cfg.center.x.toFixed(2)}, ${cfg.center.y.toFixed(2)}, ${cfg.center.z.toFixed(2)}\n` +
                   `§7Radius: §a${cfg.radius}\n` +
                   `§7Distance X: §a${dx.toFixed(2)} §7| Z: §a${dz.toFixed(2)} §7| Y: §a${dy.toFixed(2)}\n` +
                   `§7In Hub Zone: ${inHubZone ? '§aYes' : '§cNo'}\n` +
                   `§7Bypass: ${bypass ? '§aYes' : '§cNo'}`
        };
    }
}
