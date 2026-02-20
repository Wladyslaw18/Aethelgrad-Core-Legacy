/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Broadcast Command
// Controls broadcast system

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType } from "@minecraft/server";
import { canManageBroadcasts } from "../../utils/permissionHelper.js";

export class BroadcastCommand extends BaseCommand {
    constructor() {
        super({
            name: "ae:bc",
            description: "Broadcast control",
            permissionLevel: 0, // FIX: Use numeric 0 instead of CommandPermissionLevel.Any for Stable API
            // FIX: Make enum optional with default for Stable API compatibility
            optionalParameters: [
                {
                    name: "subcommand", // This name is used as the Enum ID
                    type: CustomCommandParamType.Enum,
                    values: ["random", "reset", "help"],
                    description: "Broadcast subcommand to execute"
                }
            ]
        });
    }
    
    execute(origin, args) {
        const player = origin.sourceEntity;
        
        // FIXED: Use proper permission system
        if (!canManageBroadcasts(player)) {
            return { status: CustomCommandStatus.Failure, message: "§cNo permission." };
        }
        
        // FIXED: BaseCommand now provides mapped object { subcommand: "value" }
        const subcommand = args.subcommand || "help";
        
        switch (subcommand.toLowerCase()) {
            case "random":
                this.randomBroadcast();
                break;
                
            case "reset":
                const defaults = { pools: { common: ["Default broadcast message"] }, interval: 120 };
                world.setDynamicProperty("aethelgrad:broadcasts", JSON.stringify(defaults.pools));
                world.setDynamicProperty("aethelgrad:interval", defaults.interval);
                try { player.sendMessage("§eBroadcasts reset."); } catch {}
                break;
                
            case "help":
            default:
                try {
                    player.sendMessage("§e/ae:bc <random|reset|help>");
                } catch {}
                break;
        }
        
        return { status: CustomCommandStatus.Success };
    }
    
    rollRarity() {
        const weights = { common: 100 }; // Simplified for this example
        const entries = Object.entries(weights);
        let total = 0;
        for (const [, w] of entries) total += Number(w) || 0;
        const roll = Math.random() * (total || 100);
        let acc = 0;
        for (const [tier, weight] of entries) {
            acc += Number(weight) || 0;
            if (roll <= acc) return tier;
        }
        return entries.length ? entries[0][0] : "common";
    }
    
    randomBroadcast() {
        const tier = this.rollRarity();
        const pools = JSON.parse(world.getDynamicProperty("aethelgrad:broadcasts") || "{}");
        const pool = pools && pools[tier];
        
        if (!pool || pool.length === 0) {
            const common = pools && pools.common;
            if (!common || common.length === 0) return;
            
            for (const p of world.getPlayers()) {
                try { p.sendMessage(common[Math.floor(Math.random() * common.length)]); } catch {}
            }
            return;
        }
        
        const msg = pool[Math.floor(Math.random() * pool.length)];
        for (const p of world.getPlayers()) {
            try { p.sendMessage(msg); } catch {}
        }
    }
}
