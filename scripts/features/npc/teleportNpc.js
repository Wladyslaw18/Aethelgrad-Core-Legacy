// NPC-triggered teleport logic.
// No permissions, cooldowns, or safety validation, Data-driven.
// Modify if your server requires stricter control.

import { 
    world, 
    system,
    GameMode
} from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";

/**
 * Initializes teleport NPC system
 * @returns {void}
 */
export function init() {
    // Teleport NPC is event-based, no initialization needed
    // This function exists for bootstrap architecture compatibility
    
    // Add Right Click event listener for NPC interactions
    world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
        if (ev.target.typeId === "aethelgrad:tp_npc") {
            system.run(() => handleTeleportNpc(ev.player));
        }
    });
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
    system.run(async () => {
        try {
            const dim = world.getDimension("overworld");
            player.teleport(location, { dimension: dim, keepVelocity: false });
            player.setGameMode(GameMode.survival);
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
// NOTE: Commands are now registered in scripts/commands/ folder
// This file only contains NPC interaction logic