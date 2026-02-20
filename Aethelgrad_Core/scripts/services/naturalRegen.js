//this Core meant to be used on Lifesteal Hard difficulty//
import { world, system } from "@minecraft/server";
import { ticksSinceDamage } from "../core/combatState.js";

const CHECK_INTERVAL = 20;        // 1 second
const REGEN_INTERVAL = 40;        // 2 seconds per half-heart
const COMBAT_GRACE = 60;          // 3s after last damage
const nextRegen = new Map();

/**
 * Initializes natural regeneration system
 * @returns {void}
 */
export function init() {
    startNaturalRegen();
}

export function startNaturalRegen() {
    system.runInterval(() => {
        for (const player of world.getPlayers()) {
            try {
                const health = player.getComponent("minecraft:health");
                if (!health) continue;

                // Full health
                if (health.currentValue >= health.effectiveMax) continue;

                // Recently in combat
                if (ticksSinceDamage(player) < COMBAT_GRACE) continue;

                const now = system.currentTick;
                const next = nextRegen.get(player.id) ?? 0;
                if (now < next) continue;

                // Bedrock-safe hunger proxy (won't save dying players)
                if (health.currentValue <= 10) continue;

                health.setCurrentValue(
                    Math.min(health.currentValue + 1, health.effectiveMax)
                );

                nextRegen.set(player.id, now + REGEN_INTERVAL);
            } catch {}
        }
    }, CHECK_INTERVAL);
}