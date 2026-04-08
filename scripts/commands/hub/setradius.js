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
import { world, CustomCommandStatus } from "@minecraft/server";

export class SetRadiusCommand extends BaseCommand {
    constructor() {
        super({
            name: "setradius",
            description: "Set hub radius",
            department: "h" // Hub department requires AEH tag
        });
    }

    execute(sender, args) {
        // Permission handled by BaseCommand department system

        // args[0] is the radius because we bypassed the parser
        const radius = Number(args[0]);

        if (Number.isNaN(radius) || args[0] === undefined) {
            return { status: CustomCommandStatus.Failure, message: "§cUsage: /ae:setradius <number> or !ae setradius <number>" };
        }

        if (radius < 0 || radius > 10000) {
            return { 
                status: CustomCommandStatus.Failure, 
                message: "§cRadius must be between 0 and 10000." 
            };
        }
        
        world.setDynamicProperty("ae:hub_radius", radius);
        return { 
            status: CustomCommandStatus.Success, 
            message: `§eHub radius set to §a${radius}§e blocks.` 
        };
    }
}
