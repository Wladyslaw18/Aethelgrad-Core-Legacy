import { BaseCommand } from "../base/BaseCommand.js";
import { world, CustomCommandStatus } from "@minecraft/server";

export class BroadcastCommand extends BaseCommand {
    constructor() {
        super({
            name: "bc",
            description: "Broadcast system control",
            department: "b" // Broadcast department requires AEB tag
        });
    }

    execute(sender, args) {
        const sub = args[0]?.toLowerCase();
        const value = args[1];

        switch (sub) {
            case "random":
                return this.sendRandom(sender);
            case "reset":
                return this.reset(sender);
            case "interval":
                return this.setInterval(sender, value);
            default:
                return this.showHelp(sender);
        }
    }

    sendRandom(sender) {
        const messages = [
            "§6Welcome to Aethelgrad! §7- §eEnjoy your stay!",
            "§bNeed help? §7- §eAsk our staff team!",
            "§aServer Rules: §7- §eRespect others and have fun!",
            "§cPvP is disabled in safe zones!",
            "§dJoin our Discord for updates and events!"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        world.sendMessage(`§6[§eBroadcast§6] §f${message}`);
        
        return { status: CustomCommandStatus.Success, message: "§aRandom broadcast sent!" };
    }

    reset(sender) {
        world.setDynamicProperty("ae:bc_interval", 300);
        return { status: CustomCommandStatus.Success, message: "§aBroadcast interval reset to 5 minutes." };
    }

    setInterval(sender, value) {
        const interval = Number.parseInt(value);
        if (Number.isNaN(interval) || interval < 60) {
            return { status: CustomCommandStatus.Failure, message: "§cInterval must be at least 60 seconds." };
        }
        
        world.setDynamicProperty("ae:bc_interval", interval);
        return { status: CustomCommandStatus.Success, message: `§aBroadcast interval set to ${interval} seconds.` };
    }

    showHelp(sender) {
        return { 
            status: CustomCommandStatus.Success,
            message: `§6Broadcast Commands:\n` +
                   `§e/ae:bc random §7- Send random message\n` +
                   `§e/ae:bc reset §7- Reset interval to 5 minutes\n` +
                   `§e/ae:bc interval <seconds> §7- Set broadcast interval`
        };
    }
}
