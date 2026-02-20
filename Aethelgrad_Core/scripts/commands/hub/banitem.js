/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Ban Item Command
// Bans the item in player's hand from the hub

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
import { hasPermission } from "../../utils/permissionHelper.js";

export class BanItemCommand extends BaseCommand {
    constructor() {
        super({
            name: "ae:banitem",
            description: "Ban the item in your hand from the hub.",
            permissionLevel: 0 // FIX: Use numeric 0 instead of CommandPermissionLevel.Any for Stable API
        });
    }
    
    execute(origin, args) {
        const player = origin.sourceEntity;
        
        // CRITICAL: Use custom permission system instead of Admin level
        if (!hasPermission(player, 'HUB_MANAGER')) {
            return { status: CustomCommandStatus.Failure, message: "§cNo permission. Required: Hub Manager or higher." };
        }
        
        const inv = player.getComponent("minecraft:inventory")?.container;
        const item = inv?.getItem(player.selectedSlotIndex);
        
        if (!item) {
            return { 
                status: CustomCommandStatus.Failure, 
                message: "§cHold an item to ban it." 
            };
        }
        
        try {
            const current = JSON.parse(world.getDynamicProperty("ae:banned_items") ?? "[]");
            if (!Array.isArray(current)) current.length = 0;
            
            if (!current.includes(item.typeId)) {
                current.push(item.typeId);
                world.setDynamicProperty("ae:banned_items", JSON.stringify(current));
            }
        } catch {
            world.setDynamicProperty("ae:banned_items", JSON.stringify([item.typeId]));
        }
        
        return { 
            status: CustomCommandStatus.Success, 
            message: `§eBanned §c${item.typeId} §efrom the Hub.` 
        };
    }
}
