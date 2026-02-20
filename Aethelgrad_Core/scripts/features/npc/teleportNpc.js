// NPC-triggered teleport logic.
// No permissions, cooldowns, or safety validation, Data-driven.
// Modify if your server requires stricter control.

import { 
    world, 
    system,
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType
} from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";
import { hasPermission } from "../../utils/permissionHelper.js";

/**
 * Initializes teleport NPC system
 * @returns {void}
 */
export function init() {
    // Teleport NPC is event-based, no initialization needed
    // This function exists for bootstrap architecture compatibility
}

// ==============================
// TELEPORT LOCATION (DYNAMIC)
// ==============================
function getTeleportLocation() {
    const x = world.getDynamicProperty("ae:tp_npc_x");
    const y = world.getDynamicProperty("ae:tp_npc_y");
    const z = world.getDynamicProperty("ae:tp_npc_z");

    if (x === undefined || y === undefined || z === undefined) {
        // Fallback to default location
        return { x: 19681.49, y: 71.00, z: -4748.79 };
    }

    return { x: Number(x), y: Number(y), z: Number(z) };
}

export async function handleTeleportNpc(player) {
    const location = getTeleportLocation();
    
    const confirm = new MessageFormData()
        .title("§cLifesteal Teleporter")
        .body(`§7Teleport to the Aethelgrad spawn?\n§8(X:${Math.floor(location.x)}, Y:${Math.floor(location.y)}, Z:${Math.floor(location.z)})`)
        .button1("§aYes")
        .button2("§cNo");

    const res = await confirm.show(player);
    if (res.selection !== 0) return;

    // WORKAROUND: Bedrock UI Context Preservation
    // PROBLEM: Teleport after UI interaction can fail due to context loss
    // WHY NEEDED: system.run preserves execution context for teleport
    // DO NOT REMOVE: NPC teleport will fail intermittently
    // API VERSION: 2.4.0 Stable - UI/teleport timing issues
    system.run(() => {
        try {
            const dim = world.getDimension("overworld");
            player.teleport(location, { dimension: dim, keepVelocity: false });
            player.runCommand("gamemode survival @s");
            player.sendMessage("§bTeleported to Aethelgrad Spawn!");
        } catch (error) {
            console.warn("[TeleportNPC] Teleport failed:", error);
            player.sendMessage("§cTeleport failed! Please try again.");
        }
    });
}

// ==============================
// COMMAND REGISTRATION
// ==============================
export function registerTeleportNpcCommand(customCommandRegistry) {
    try {
        customCommandRegistry.registerCommand({
            name: "ae:npctp",
            description: "Set teleport NPC destination to your current location",
            permissionLevel: CommandPermissionLevel.Admin
        }, (origin) => {
            const player = origin?.sourceEntity;
            if (!player) {
                return { status: CustomCommandStatus.Failure, message: "Only players can run this." };
            }

            // Check permissions
            if (!hasPermission(player, 'ADMIN') && !player.getTags().includes('AEN')) {
                return { status: CustomCommandStatus.Failure, message: "§cNo permission. Required: AE, AEN, Admin, or admin" };
            }

            const loc = player.location;
            world.setDynamicProperty("ae:tp_npc_x", Number(loc.x.toFixed(2)));
            world.setDynamicProperty("ae:tp_npc_y", Number(loc.y.toFixed(2)));
            world.setDynamicProperty("ae:tp_npc_z", Number(loc.z.toFixed(2)));

            return { 
                status: CustomCommandStatus.Success, 
                message: `§eTeleport NPC destination set to §aX:${loc.x.toFixed(2)} Y:${loc.y.toFixed(2)} Z:${loc.z.toFixed(2)}` 
            };
        });
        
        console.warn("[TeleportNPC] /ae:npctp command registered.");
    } catch (e) {
        console.warn("[TeleportNPC] command registration failed:", e);
    }
}