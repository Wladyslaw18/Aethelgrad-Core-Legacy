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
// Tests string argument parsing with API 2.5.0

import { BaseCommand } from '../base/BaseCommand.js';
import { CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType } from "@minecraft/server";

export class TestStringCommand extends BaseCommand {
    constructor() {
        super({
            name: "ae:teststring",
            description: "Test string argument parsing (API 2.5.0)",
            permissionLevel: 0, // FIX: Use numeric 0 instead of CommandPermissionLevel.Any for Stable API
            mandatoryParameters: [{
                name: "text",
                type: CustomCommandParamType.String,
                description: "Text to test parsing"
            }]
        });
    }
    
    execute(origin, args) {
        const player = origin.sourceEntity;
        
        // FIXED: BaseCommand now provides mapped object { text: "value" }
        const text = args.text || "no args";
        
        player.sendMessage(`§6[API 2.5.0 Test] §rString argument: "${text}"`);
        
        return {
            status: CustomCommandStatus.Success,
            message: `String argument test successful!`
        };
    }
}
