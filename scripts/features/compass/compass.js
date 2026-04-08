/**
 * @file features/compass/compass.js
 * @description Companion compass system for Aethelgrad Core
 * @job Provides players with a custom compass for server navigation
 * 
 * This system provides:
 * - Automatic compass distribution on first join
 * - Custom compass naming and slot management
 * - Duplicate compass removal
 * - Bedrock inventory loading race condition workaround
 * 
 * Used by: Bootstrap system for initialization
 * 
 * @example
 * // Compass is automatically given to new players
 * // Players can also manually craft and use compasses
 */

import { world, system, ItemStack } from "@minecraft/server";

const COMPASS_ID = "minecraft:compass";
const COMPASS_NAME = "§r§bAethelgrad Menu Compass";
const PREFERRED_SLOT = 8; // 9th hotbar slot

/**
 * Ensures player has a properly named compass in the correct slot
 * @param {Player} player - The player to check/give compass to
 * @returns {void}
 */
function ensureCompass(player) {
    try {
        const inv = player.getComponent("minecraft:inventory")?.container;
        if (!inv) return;

        let found = false;
        let oldSlot = -1;

        // First pass: look for compass and correct name tag
        for (let i = 0; i < inv.size; i++) {
            const item = inv.getItem(i);
            if (item && item.typeId === COMPASS_ID) {
                if (found) {
                    // Found more than one. Remove the extra one.
                    inv.setItem(i, undefined);
                } else {
                    found = true;
                    oldSlot = i;
                    // Ensure custom name is always applied
                    item.nameTag = COMPASS_NAME;
                    inv.setItem(i, item);
                }
            }
        }

        if (!found) {
            // Not found, create and place in the preferred slot (9)
            const compass = new ItemStack(COMPASS_ID, 1);
            compass.nameTag = COMPASS_NAME;
            inv.setItem(PREFERRED_SLOT, compass);
        } else if (oldSlot !== PREFERRED_SLOT) {
            // Found but in the wrong slot. Move it.
            const item = inv.getItem(oldSlot);
            if (item) {
                inv.setItem(oldSlot, undefined); // Clear the old slot
                inv.setItem(PREFERRED_SLOT, item); // Place in the new slot
            }
        }

    } catch (e) {
        console.warn("ensureCompass error:", e);
    }
}

/**
 * Initializes compass system with player spawn event listener
 * @returns {void}
 */
export function init() {
    // On initial spawn/join give compass
    world.afterEvents.playerSpawn.subscribe(ev => {
        if (ev.initialSpawn) {
            // WORKAROUND: Bedrock Inventory Loading Race Condition
            // PROBLEM: Player inventory not fully available on initial spawn event
            // WHY NEEDED: Component system loads inventory asynchronously after spawn
            // DO NOT REMOVE: Compass will fail to appear on first join
            // API VERSION: 2.4.0 Stable - inventory timing inconsistent
            system.runTimeout(() => ensureCompass(ev.player), 20);
        }
    });
    console.warn("[Aethelgrad Compass] Loaded (Polling Removed).");
}