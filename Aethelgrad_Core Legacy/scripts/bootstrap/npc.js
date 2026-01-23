import { world, system } from "@minecraft/server";
import { handleKitNpc } from "../features/npc/kitNpc.js";
import { handleTeleportNpc } from "../features/npc/teleportNpc.js";
import { registerNpcProtection } from "../features/npc/npcProtection.js";

export function init() {
    // --- Interaction Listener (Stable) ---
    world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
        const { player, target } = ev;
        if (!target) return;

        // WORKAROUND: Bedrock UI Context Bug
        // PROBLEM: Entity interactions lose async context when calling UI functions directly
        // WHY NEEDED: @minecraft/server-ui requires preserved async context for modal forms
        // DO NOT REMOVE: Will cause "UI not available" errors on entity interactions
        // API VERSION: 2.4.0 Stable - confirmed broken in 1.21.90+
        system.run(async () => {
            if (target.typeId === "aethelgrad:kit_npc") {
                await handleKitNpc(player);
            } else if (target.typeId === "aethelgrad:tp_npc") {
                await handleTeleportNpc(player);
            }
        });
    });

    // --- Protection Listener ---
    registerNpcProtection();

    console.warn("[AethelgradNPCs] Interaction Listener LOADED.");
}