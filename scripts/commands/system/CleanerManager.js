/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Cleaner Manager Command
// Manages the ground item cleaner service

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CustomCommandStatus } from "@minecraft/server";

export class CleanerManager extends BaseCommand {
    constructor() {
        super({
            name: "cleaner",
            description: "Manage ground item cleaner",
            department: "c" // Cleaner department requires AEC tag
        });
    }

    execute(sender, args) {
        const subcommand = args[0]?.toLowerCase();
        
        if (subcommand === "status") {
            return this.showStatus(sender);
        } else if (subcommand === "clear") {
            return this.clearItems(sender);
        } else {
            return this.showHelp(sender);
        }
    }

    showStatus(sender) {
        const dimensions = ["overworld", "nether", "the_end"];
        let totalItems = 0;
        
        for (const dimName of dimensions) {
            try {
                const dimension = world.getDimension(dimName);
                const items = dimension.getEntities({ type: "minecraft:item" });
                totalItems += items.length;
            } catch (error) {
                console.warn(`[CleanerManager] Failed to check dimension ${dimName}:`, error);
            }
        }
        
        return {
            status: CustomCommandStatus.Success,
            message: `§6Cleaner Status: §a${totalItems} §6items on ground`
        };
    }

    clearItems(sender) {
        // Permission handled by BaseCommand department system
        // Additional check for clear subcommand specifically
        if (subcommand === "clear" && !sender.hasTag("AEC") && !sender.hasTag("AE") && !sender.hasTag("Admin") && !sender.hasTag("admin")) {
            return { status: CustomCommandStatus.Failure, message: "§cNo permission to clear items." };
        }
        
        let itemsRemoved = 0;
        const dimensions = ["overworld", "nether", "the_end"];
        
        for (const dimName of dimensions) {
            try {
                const dimension = world.getDimension(dimName);
                const items = dimension.getEntities({ type: "minecraft:item" });
                
                for (const item of items) {
                    try {
                        item.remove();
                        itemsRemoved++;
                    } catch (error) {
                        console.warn(`[CleanerManager] Failed to remove item:`, error);
                    }
                }
            } catch (error) {
                console.warn(`[CleanerManager] Failed to clear dimension ${dimName}:`, error);
            }
        }
        
        return {
            status: CustomCommandStatus.Success,
            message: `§6Cleared §a${itemsRemoved} §6items from all dimensions`
        };
    }

    showHelp(sender) {
        return {
            status: CustomCommandStatus.Success,
            message: `§6Cleaner Commands:\n§7!aec cleaner status §f- Show item count\n§7!aec cleaner clear §f- Clear all items`
        };
    }
}
