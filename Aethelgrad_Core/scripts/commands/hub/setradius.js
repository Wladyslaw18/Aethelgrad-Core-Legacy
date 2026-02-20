/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Set Radius Command
// Sets the hub protection radius

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType } from "@minecraft/server";
import { hasPermission } from "../../utils/permissionHelper.js";

export class SetRadiusCommand extends BaseCommand {
    constructor() {
        super({
            name: "ae:setradius",
            description: "Set protection radius for the hub.",
            permissionLevel: 0, // FIX: Use numeric 0 instead of CommandPermissionLevel.Any for Stable API
            mandatoryParameters: [{
                name: "radius",
                type: CustomCommandParamType.Integer, // <--- FIX: Use Integer, not Int
                description: "Protection radius in blocks (0-10000)"
            }]
        });
    }
    
    execute(origin, args) {
        const player = origin.sourceEntity;
        
        // CRITICAL: Use custom permission system instead of Admin level
        if (!hasPermission(player, 'HUB_MANAGER')) {
            return { status: CustomCommandStatus.Failure, message: "§cNo permission. Required: Hub Manager or higher." };
        }
        
        // FIXED: BaseCommand now provides mapped object { radius: 50 }
        const radius = args.radius;
        
        // Validation
        if (radius === undefined) {
            return { 
                status: CustomCommandStatus.Failure, 
                message: "§cUsage: /ae:setradius <radius>" 
            };
        }
        
        if (radius < 0 || radius > 10000) {
            return { 
                status: CustomCommandStatus.Failure, 
                message: "§cRadius must be between 0 and 10000 blocks." 
            };
        }
        
        world.setDynamicProperty("ae:hub_radius", radius);
        return { 
            status: CustomCommandStatus.Success, 
            message: `§eHub radius set to §a${radius}§e blocks.` 
        };
    }
}
