/**
 *╔═══════════════════════════════════════════════════════════════════════════╗
   ║                                                                           ║
   ║  █████╗ ███████╗████████╗██╗  ██╗███████╗██╗     ██████╗  █████╗ ██████╗  ║
   ║ ██╔══██╗██╔════╝╚══██╔══╝██║  ██║██╔════╝██║     ██╔══██╗██╔══██╗██╔══██╗ ║
   ║ ███████║█████╗     ██║   ███████║█████╗  ██║     ██████╔╝███████║██║  ██║ ║
   ║ ██╔══██║██╔══╝     ██║   ██╔══██║██╔══╝  ██║     ██╔══██╗██╔══██║██║  ██║ ║
   ║ ██║  ██║███████╗   ██║   ██║  ██║███████╗███████╗██║  ██║██║  ██║██████╔╝ ║
   ║ ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ║
   ║                                                                           ║
   ║            ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ ███████╗         ║
   ║            ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗██╔════╝         ║
   ║            ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║███████╗         ║
   ║            ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║╚════██║         ║
   ║            ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝███████║         ║
   ║            ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ ╚══════╝         ║
   ║                                                                           ║
   ║                   •  L E G A C Y   E D I T I O N  •                       ║
   ║                                                                           ║
   ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 Aethelgrad Studio and WladyslawKW or Wladyslaw Kowalski
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Base Command Class - STABLE 1.26. 
// Provides consistent command structure and validation for all Aethelgrad commands

import { CustomCommandStatus, CustomCommandParamType } from "@minecraft/server";

export class BaseCommand {
    constructor(config) {
        this.name = config.name;
        this.description = config.description;
        this.permission = config.permissionLevel ?? 1;
        this.aliases = config.aliases || [];
        this.mandatoryParameters = config.mandatoryParameters || config.parameters || [];
        this.optionalParameters = config.optionalParameters || [];
    }

    validate(origin, args) {
        const player = origin?.sourceEntity;
        if (!player) {
            return {
                valid: false,
                status: CustomCommandStatus.Failure,
                message: "§cThis command must be run by a player."
            };
        }
        return { valid: true, player };
    }
    
    execute(origin, args) {
        throw new Error("execute() must be implemented in subclass");
    }

    register(customCommandRegistry) {
        const allParams = [...this.mandatoryParameters, ...this.optionalParameters];

        // 0. FIX: Register ALL Enums before command registration (Stable requirement)
        for (const param of allParams) {
            if (param.type === CustomCommandParamType.Enum && param.values) {
                try {
                    customCommandRegistry.registerEnum(param.name, param.values);
                    console.warn(`[BaseCommand] Registered enum: ${param.name} with values: [${param.values.join(', ')}]`);
                } catch (e) {
                    // Enum might already be registered, continue
                }
            }
        }

        // 1. Prepare parameters for registry
        const prepare = (params) => params.map(p => ({
            name: p.name,
            description: p.description ?? "",
            // Enums must use the enum name as the type string
            type: (p.type === CustomCommandParamType.Enum && p.values) ? p.name : (p.type ?? CustomCommandParamType.Integer)
        }));

        // 2. Register command (WITHOUT aliases property)
        customCommandRegistry.registerCommand({
            name: this.name,
            description: this.description,
            permissionLevel: this.permission,
            mandatoryParameters: prepare(this.mandatoryParameters),
            optionalParameters: prepare(this.optionalParameters)
        }, (origin, rawArgs) => {
            // 3. FIX: Use .get() because rawArgs is an object in Stable
            const mappedArgs = {};
            allParams.forEach((param) => {
                mappedArgs[param.name] = rawArgs.get(param.name);
            });

            const validation = this.validate(origin, mappedArgs);
            if (!validation.valid) return validation;

            return this.execute(origin, mappedArgs);
        });

        // 4. Register Aliases separately as required by Stable API
        for (const alias of this.aliases) {
            try {
                customCommandRegistry.registerAlias(alias, this.name);
            } catch (e) {}
        }
    }
}