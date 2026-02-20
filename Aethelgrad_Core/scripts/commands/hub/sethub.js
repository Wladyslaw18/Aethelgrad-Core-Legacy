/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Set Hub Command
// Sets the hub center to player's current location

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
import { hasPermission } from "../../utils/permissionHelper.js";

export class SetHubCommand extends BaseCommand {
    constructor() {
        super({
            name: "ae:sethub",
            description: "Set hub center to your current location.",
            permissionLevel: 0 // FIX: Use numeric 0 instead of CommandPermissionLevel.Any for Stable API
        });
    }
    
    execute(origin, args) {
        const player = origin.sourceEntity;
        if (!player) {
            return { status: CustomCommandStatus.Failure, message: "Only players can run this command." };
        }
        
        // CRITICAL: Use custom permission system instead of Admin level
        if (!hasPermission(player, 'HUB_MANAGER')) {
            return { status: CustomCommandStatus.Failure, message: "§cNo permission. Required: Hub Manager or higher." };
        }
        
        const loc = player.location;
        
        world.setDynamicProperty("ae:hub_x", Math.floor(loc.x));
        world.setDynamicProperty("ae:hub_y", Math.floor(loc.y));
        world.setDynamicProperty("ae:hub_z", Math.floor(loc.z));
        
        return { 
            status: CustomCommandStatus.Success, 
            message: "§eHub location saved." 
        };
    }
}
