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
// Tests numeric argument parsing with API 2.5.0

import { BaseCommand } from '../base/BaseCommand.js';
import { world, CommandPermissionLevel, CustomCommandStatus, CustomCommandParamType } from "@minecraft/server";

export class TestNumberCommand extends BaseCommand {
    constructor() {
        super({
            name: "ae:testnumber",
            description: "Test numeric argument parsing (API 2.5.0)",
            permissionLevel: 0, // FIX: Use numeric 0 instead of CommandPermissionLevel.Any for Stable API
            mandatoryParameters: [{
                name: "number",
                type: CustomCommandParamType.Float,
                description: "Number to test parsing"
            }]
        });
    }
    
    execute(origin, args) {
        const player = origin.sourceEntity;
        
        // FIXED: BaseCommand now provides mapped object { number: value }
        const number = args.number;
        
        player.sendMessage(`§6[API 2.5.0 Test] §rReceived argument: ${number} (type: ${typeof number})`);
        
        if (number === undefined) {
            return {
                status: CustomCommandStatus.Failure,
                message: `§c[FAIL] §rNo argument received`
            };
        }
        
        const numValue = Number(number);
        if (isNaN(numValue)) { // If it is NOT a number
            return {
                status: CustomCommandStatus.Failure,
                message: `§c[FAIL] §rCould not parse "${number}" as number`
            };
        }
        
        // SUCCESS PATH - Set hub radius as test
        world.setDynamicProperty("ae:hub_radius", numValue);
        player.sendMessage(`§e[TEST] §rSet hub radius to: ${numValue}`);
        
        return {
            status: CustomCommandStatus.Success,
            message: `Numeric argument test successful!`
        };
    }
}
