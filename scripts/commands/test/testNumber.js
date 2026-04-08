/**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Test Number Command
// Tests numeric argument parsing

import { BaseCommand } from '../base/BaseCommand.js';
import { CustomCommandStatus } from "@minecraft/server";

export class TestNumberCommand extends BaseCommand {
    constructor() {
        super({
            name: "testnumber",
            description: "Test numeric argument parsing (API 2.6.0)",
            department: null // Test commands for admin use
        });
    }

    execute(sender, args) {
        // BaseCommand ensures sender is a player entity
        // No need for player check since commands are player-only

        const numbers = args.map(arg => {
            const num = Number(arg);
            return Number.isNaN(num) ? `§c"${arg}"§7` : `§a${num}§7`;
        });
        
        return { 
            status: CustomCommandStatus.Success, 
            message: `§6Number Test: §7[${numbers.join(", ")}] §7(${args.length} arguments)` 
        };
    }
}
