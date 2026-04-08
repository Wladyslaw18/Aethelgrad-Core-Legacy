// NEW BaseCommand.js
import { CustomCommandStatus, CommandPermissionLevel } from "@minecraft/server";
import { hasPermission, getDepartmentTag } from "../../utils/permissionHelper.js";

export class BaseCommand {
    constructor(config) {
        this.name = config.name;
        this.department = config.department || null; // e.g. "h" for Hub, "b" for Broadcast
        this.description = config.description || "Aethelgrad System Action";
    }

    // Official Registry (Zero-Param Bypass)
    register(customCommandRegistry) {
        const commandCallback = (origin) => {
            const sender = origin.sourceEntity;
            
            // Debug logging
            console.log(`[BaseCommand] Command: ${this.name}, Department: ${this.department}, Sender: ${sender?.name || 'null'}`);
            
            // Check if player exists
            if (!sender) {
                return { status: CustomCommandStatus.Failure, message: "§cOnly players can run this command." };
            }
            
            // Check if player has required permission using department system
            if (this.department && !hasPermission(sender, this.department)) {
                const departmentTag = getDepartmentTag(this.department);
                return { status: CustomCommandStatus.Failure, message: `§cAccess Denied. Required: ${departmentTag} tag or higher.` };
            }
            // Commands run via official / registry with empty args
            const result = this.execute(sender, []);
            // Ensure result has proper status property for Minecraft CustomCommandResult
            return result.status !== undefined ? result : { status: CustomCommandStatus.Success, message: result.message ?? "" };
        };

        customCommandRegistry.registerCommand({
            name: `ae:${this.name}`,
            description: this.description || "Aethelgrad System Action",
            permissionLevel: CommandPermissionLevel.Any
        }, commandCallback);
    }

    
    execute(sender, args) { throw "Subclass must implement execute"; }
}
