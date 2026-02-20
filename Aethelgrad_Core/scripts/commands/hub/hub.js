/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Hub Command
// Teleports player to hub location with combat state checking and cooldown

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CommandPermissionLevel, CustomCommandStatus, system } from "@minecraft/server";
import { ticksSinceDamage } from "../../core/combatState.js";

// Cooldown tracking (5 seconds)
const hubCooldowns = new Map();

export class HubCommand extends BaseCommand {
    constructor() {
        super({
            name: "ae:hub",
            description: "Teleport to the hub location",
            permissionLevel: 0, // FIX: Use numeric 0 instead of CommandPermissionLevel.Any for Stable API
            // Add alias so players can use /hub instead of /ae:hub
            aliases: ["hub"]
        });
    }
    
    execute(origin, args) {
        const player = origin.sourceEntity;
        if (!player) {
            return { status: CustomCommandStatus.Failure, message: "§cOnly players can run this command." };
        }
        
        // Check cooldown (5 seconds)
        const now = system.currentTick;
        const lastUse = hubCooldowns.get(player.id) ?? 0;
        if (now - lastUse < 100) { // 100 ticks = 5 seconds
            return { 
                status: CustomCommandStatus.Failure, 
                message: "§cPlease wait 5 seconds before using /hub again." 
            };
        }
        
        // Check combat state (15 seconds)
        const inCombat = ticksSinceDamage(player) < 300; // 300 ticks = 15 seconds
        if (inCombat) {
            return { 
                status: CustomCommandStatus.Failure, 
                message: "§cCannot use /hub while in combat! Wait 15 seconds after combat." 
            };
        }
        
        // Get hub location from dynamic properties
        const hubX = world.getDynamicProperty("ae:hub_x");
        const hubY = world.getDynamicProperty("ae:hub_y");
        const hubZ = world.getDynamicProperty("ae:hub_z");
        
        if (hubX === undefined || hubY === undefined || hubZ === undefined) {
            return { 
                status: CustomCommandStatus.Failure, 
                message: "§cHub location not set. Ask an admin to set it with /ae:sethub" 
            };
        }
        
        // Update cooldown BEFORE run, so they can't spam while the tick waits
        hubCooldowns.set(player.id, now);
        
        // FIX: Wrap teleport in system.run() for proper execution context
        system.run(() => {
            try {
                // Fetch dimension fresh inside the mutable tick
                const playerDim = player.dimension;
                const targetDim = world.getDimension("overworld");
                
                // Multi-dimension support: teleport from any dimension to overworld hub
                player.teleport(
                    { x: Number(hubX), y: Number(hubY), z: Number(hubZ) }, 
                    { dimension: targetDim, keepVelocity: false }
                );
                
                player.sendMessage("§aTeleported to hub!");
            } catch (teleportError) {
                // We notify the player here because 'return' from execute is long gone
                player.sendMessage("§cTeleport failed: " + teleportError.message);
            }
        });
        
        return { 
            status: CustomCommandStatus.Success, 
            message: "§aTeleporting..." // Present tense since it's queued
        };
    }
}
