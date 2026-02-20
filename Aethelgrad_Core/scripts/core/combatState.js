/**
 * @file core/combatState.js
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 * 
 * Used by: Hub commands, Kit NPCs, and any feature that needs combat state awareness
 * 
 * @example
 * // Check if player is in combat
 * const timeSinceDamage = ticksSinceDamage(player);
 * if (timeSinceDamage < 200) { // 10 seconds at 20 ticks/sec
 *     player.sendMessage("§cYou are in combat!");
 *     return;
 * }
 */

import { system } from "@minecraft/server";

const lastDamageTick = new Map();

/**
 * Marks a player as damaged by recording the current tick
 * @param {Player} player - The player who took damage
 * @returns {void}
 */
export function markDamaged(player) {
    lastDamageTick.set(player.id, system.currentTick);
}

/**
 * Calculates how many ticks have passed since player last took damage
 * @param {Player} player - The player to check
 * @returns {number} Ticks since last damage (Infinity if never damaged)
 */
export function ticksSinceDamage(player) {
    const t = lastDamageTick.get(player.id);
    if (t === undefined) return Infinity;
    return system.currentTick - t;
}