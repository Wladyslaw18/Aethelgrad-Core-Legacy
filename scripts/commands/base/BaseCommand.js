/**
 * @file commands/base/BaseCommand.js
 * @description Base class for all Aethelgrad commands (Refactored to API 2.6.0)
 * @job Handles official command registration, permission checks, and argument routing.
 */

import { CustomCommandStatus, CommandPermissionLevel, CustomCommandParamType } from "@minecraft/server";
import { hasPermission, getDepartmentTag } from "../../utils/permissionHelper.js";

export class BaseCommand {
    constructor(config) {
        this.name = config.name;
        this.description = config.description || "Aethelgrad System Action";
        this.department = config.department || null;
        
        // Split arguments into mandatory and optional for official API
        const allArgs = config.arguments || [];
        this.mandatoryParameters = allArgs.filter(arg => !arg.optional);
        this.optionalParameters = allArgs.filter(arg => arg.optional);
    }

    /**
     * Registers the command with the Minecraft CustomCommandRegistry
     * @param {Object} customCommandRegistry 
     */
    register(customCommandRegistry) {
        const commandCallback = (origin, ...rest) => {
            const sender = origin.sourceEntity;
            
            if (!sender) {
                return { status: CustomCommandStatus.Failure, message: "§cOnly players can run this command." };
            }
            
            // Permission Check
            if (this.department && !hasPermission(sender, this.department)) {
                const tag = getDepartmentTag(this.department);
                return { status: CustomCommandStatus.Failure, message: `§cAccess Denied. Required: ${tag} tag.` };
            }

            // Route to execute
            try {
                // Diagnostics: Log what the engine is actually sending
                const debugRest = rest.map(arg => {
                    if (arg === null) return "null";
                    if (typeof arg === "object") return `Object(${Object.keys(arg).join(",")})`;
                    return `${typeof arg}(${arg})`;
                });
                console.warn(`[Command:${this.name}] Incoming Args: [${debugRest.join(", ")}]`);

                const args = {};
                const allParams = [...this.mandatoryParameters, ...this.optionalParameters];
                
                allParams.forEach((param, index) => {
                    let value = undefined;

                    // 1. Try Positional
                    if (rest.length > index) {
                        const potential = rest[index];
                        if (rest.length > 1 || (typeof potential !== "object" || potential === null)) {
                            value = potential;
                        }
                    }

                    // 2. Try Packed Object
                    if (value === undefined && rest[0] && typeof rest[0] === "object") {
                        const packed = rest[0];
                        if (typeof packed.get === "function") {
                            value = packed.get(param.name);
                        } else if (packed[param.name] !== undefined) {
                            value = packed[param.name];
                        }
                    }

                    // 3. Special Case
                    if (value === undefined && allParams.length === 1 && rest.length === 1) {
                        value = rest[0];
                    }

                    args[param.name] = value;
                    args[index] = value;
                });

                // Add helper methods to mimic array
                const argValues = allParams.map((p, i) => args[i]);
                args.slice = (...a) => argValues.slice(...a);
                args.map = (...a) => argValues.map(...a);
                args.join = (...a) => argValues.join(...a);
                args.length = argValues.filter(v => v !== undefined).length;

                const result = this.execute(sender, args);
                
                return {
                    status: result.status ?? CustomCommandStatus.Success,
                    message: result.message ?? ""
                };
            } catch (e) {
                console.error(`[Command:${this.name}] Execution error:`, e);
                return { status: CustomCommandStatus.Failure, message: "§cInternal error occurred." };
            }
        };

        const registrationData = {
            name: `ae:${this.name}`,
            description: this.description,
            permissionLevel: CommandPermissionLevel.Any
        };

        if (this.mandatoryParameters.length > 0) {
            registrationData.mandatoryParameters = this.mandatoryParameters.map(p => ({ name: p.name, type: p.type }));
        }

        if (this.optionalParameters.length > 0) {
            registrationData.optionalParameters = this.optionalParameters.map(p => ({ name: p.name, type: p.type }));
        }

        console.warn(`[BaseCommand] Registering /ae:${this.name} with ${this.mandatoryParameters.length} mandatory and ${this.optionalParameters.length} optional params.`);
        customCommandRegistry.registerCommand(registrationData, commandCallback);
    }

    /**
     * @param {Player} sender 
     * @param {Record<string, any>} args 
     */
    execute(sender, args) { throw "Subclass must implement execute"; }
}
