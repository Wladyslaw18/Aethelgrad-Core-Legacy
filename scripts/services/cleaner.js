/**
 * @file services/cleaner.js
 * @description Ground item cleaner service
 * @job Automatically removes dropped items after specified time
 * 
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 Aethelgrad Studio and WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

import { world, system } from "@minecraft/server";

// Configuration
const CLEAN_INTERVAL = 6000; // 5 minutes in ticks
const ITEM_LIFETIME = 12000; // 10 minutes in ticks before cleanup
const PROTECTED_ITEMS = [
    "minecraft:netherite_sword",
    "minecraft:netherite_pickaxe",
    "minecraft:netherite_axe",
    "minecraft:elytra",
    "minecraft:totem_of_undying"
];

let isInitialized = false;
const itemSpawnTimes = new Map();

/**
 * Initialize item cleaner service
 * @returns {void}
 */
export function init() {
    if (isInitialized) {
        console.warn("[cleaner] Already initialized, skipping.");
        return;
    }

    try {
        // Start item tracking
        startItemTracking();
        isInitialized = true;
        console.warn("[cleaner] Item cleaner initialized successfully.");
    } catch (error) {
        console.error("[cleaner] Failed to initialize:", error);
        throw error;
    }
}

/**
 * Start tracking dropped items and cleaning old ones
 * @returns {void}
 */
function startItemTracking() {
    // Track new items as they spawn
    try {
        world.afterEvents.entitySpawn.subscribe(function(event) {
            if (event.entity.typeId === "minecraft:item") {
                const item = event.entity;
                if (item && item.typeId) {
                    itemSpawnTimes.set(item.id, system.currentTick);
                }
            }
        });
    } catch (error) {
        console.error("[cleaner] Failed to subscribe to entitySpawn event:", error);
        throw error;
    }

    // Clean old items periodically
    system.runInterval(function() {
        cleanOldItems();
    }, CLEAN_INTERVAL);
}

/**
 * Clean items that have been on the ground too long
 * @returns {void}
 */
function cleanOldItems() {
    const currentTick = system.currentTick;
    let cleanedCount = 0;
    const dimensions = ["overworld", "nether", "the_end"];

    try {
        for (const dimensionName of dimensions) {
            try {
                const dimension = world.getDimension(dimensionName);
                for (const entity of dimension.getEntities({ type: "minecraft:item" })) {
                    const spawnTime = itemSpawnTimes.get(entity.id);
                    
                    // Clean if item is too old or if spawn time is unknown
                    if (!spawnTime || (currentTick - spawnTime) > ITEM_LIFETIME) {
                        // Don't clean protected items
                        if (!isProtectedItem(entity.typeId)) {
                            entity.remove();
                            itemSpawnTimes.delete(entity.id);
                            cleanedCount++;
                        }
                    }
                }
            } catch (dimensionError) {
                console.warn(`[cleaner] Failed to clean dimension ${dimensionName}:`, dimensionError);
            }
        }

        // Clean up old spawn time records
        for (const [itemId, spawnTime] of itemSpawnTimes.entries()) {
            if ((currentTick - spawnTime) > ITEM_LIFETIME * 2) {
                itemSpawnTimes.delete(itemId);
            }
        }

        if (cleanedCount > 0) {
            console.warn(`[cleaner] Cleaned ${cleanedCount} old items.`);
        }
    } catch (error) {
        console.error("[cleaner] Error during cleanup:", error);
    }
}

/**
 * Check if an item type is protected from cleanup
 * @param {string} itemType - The item type ID
 * @returns {boolean} True if item is protected
 */
function isProtectedItem(itemType) {
    return PROTECTED_ITEMS.includes(itemType);
}

/**
 * Get current cleaner configuration
 * @returns {Object} Current configuration
 */
export function getConfig() {
    return {
        cleanInterval: CLEAN_INTERVAL,
        itemLifetime: ITEM_LIFETIME,
        protectedItems: [...PROTECTED_ITEMS],
        trackedItems: itemSpawnTimes.size,
        initialized: isInitialized
    };
}

/**
 * Force cleanup of all items immediately
 * @returns {number} Number of items cleaned
 */
export function forceCleanup() {
    let cleanedCount = 0;
    const dimensions = ["overworld", "nether", "the_end"];
    
    try {
        for (const dimensionName of dimensions) {
            try {
                const dimension = world.getDimension(dimensionName);
                for (const entity of dimension.getEntities({ type: "minecraft:item" })) {
                    if (!isProtectedItem(entity.typeId)) {
                        entity.remove();
                        itemSpawnTimes.delete(entity.id);
                        cleanedCount++;
                    }
                }
            } catch (dimensionError) {
                console.warn(`[cleaner] Failed to force clean dimension ${dimensionName}:`, dimensionError);
            }
        }
        console.warn(`[cleaner] Force cleaned ${cleanedCount} items.`);
        return cleanedCount;
    } catch (error) {
        console.error("[cleaner] Error during force cleanup:", error);
        return 0;
    }
}
