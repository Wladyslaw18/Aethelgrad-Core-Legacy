// core/combatState.js
import { system } from "@minecraft/server";

const lastDamageTick = new Map();

export function markDamaged(player) {
    lastDamageTick.set(player.id, system.currentTick);
}

export function ticksSinceDamage(player) {
    const t = lastDamageTick.get(player.id);
    if (t === undefined) return Infinity;
    return system.currentTick - t;
}