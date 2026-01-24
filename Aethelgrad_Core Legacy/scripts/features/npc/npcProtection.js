// NPC protection logic.
// Bedrock does not provide reliable native NPC protection.
// This is a defensive workaround and may block other addons.
import { world } from "@minecraft/server";

export function registerNpcProtection() {
    try {
        world.afterEvents.entityHitEntity.subscribe((ev) => {
            const victim = ev.hitEntity;
            if (victim && (victim.typeId === "aethelgrad:kit_npc" || victim.typeId === "aethelgrad:tp_npc")) {
                const health = victim.getComponent("minecraft:health");
                if (health) {
                    // Instantly restore health to mimic invincibility
                    health.setCurrentValue(health.effectiveMax);
                }
            }
        });
        console.warn("[AethelgradNPCs] NPC Protection LOADED (Stable Mode).");
    } catch (e) {
        // FIXED: Corrected string interpolation syntax
        console.error(`[AethelgradNPCs] Protection Error: ${e.message}`);
    }
}