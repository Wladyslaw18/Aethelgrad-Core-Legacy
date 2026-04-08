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
import { world, CustomCommandStatus } from "@minecraft/server";

export class SetHubCommand extends BaseCommand {
    constructor() {
        super({
            name: "sethub",
            description: "Set hub center to your current location.",
            department: "h" // Hub department requires AEH tag
        });
    }
    
    execute(sender, args) {
        // BaseCommand ensures sender is a player entity
        // No need for player check since commands are player-only
        
        // Permission handled by BaseCommand department system
        
        const loc = sender.location;
        
        world.setDynamicProperty("ae:hub_x", Math.floor(loc.x));
        world.setDynamicProperty("ae:hub_y", Math.floor(loc.y));
        world.setDynamicProperty("ae:hub_z", Math.floor(loc.z));
        
        return { 
            status: CustomCommandStatus.Success, 
            message: "§eHub location saved." 
        };
    }
}
