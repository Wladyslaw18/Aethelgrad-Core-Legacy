/**
 * @file commands/hub/setradius.js
 * @description Command to set the hub protection radius (Refactored to DOD)
 */

import { BaseCommand } from '../base/BaseCommand.js';
import { CustomCommandStatus, CustomCommandParamType } from "@minecraft/server";
import { configManager } from "../../core/ConfigManager.js";

export class SetRadiusCommand extends BaseCommand {
    constructor() {
        super({
            name: "setradius",
            description: "Set hub radius",
            department: "h",
            arguments: [
                {
                    name: "radius",
                    type: CustomCommandParamType.Integer
                }
            ]
        });
    }

    execute(sender, args) {
        const radius = args.radius ?? args[0];

        if (radius === undefined || Number.isNaN(radius)) {
            return { status: CustomCommandStatus.Failure, message: "§cUsage: /ae:setradius <radius>" };
        }

        configManager.set("hub.radius", radius);
        configManager.save("hub.radius");

        return { 
            status: CustomCommandStatus.Success, 
            message: `§eHub radius set to §a${radius}§e blocks.` 
        };
    }
}
