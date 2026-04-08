/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Test String Command
// Tests string argument parsing

import { BaseCommand } from '../base/BaseCommand.js';
import { CustomCommandStatus } from "@minecraft/server";

export class TestStringCommand extends BaseCommand {
    constructor() {
        super({
            name: "teststring",
            description: "Test string argument parsing (API 2.5.0)",
            department: null // Test commands for admin use
        });
    }

    execute(sender, args) {
        // BaseCommand ensures sender is a player entity
        // No need for player check since commands are player-only

        const testString = args.join(" ");
        
        return { 
            status: CustomCommandStatus.Success, 
            message: `§6String Test: §f"${testString}" §7(${args.length} arguments)` 
        };
    }
}
