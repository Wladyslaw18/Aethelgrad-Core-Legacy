/**
 * @file services/naturalRegen.js
 * @description Natural health regeneration service
 * @job Provides passive health regeneration to players
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
const REGEN_INTERVAL = 1200; // 1 minute in ticks (20 ticks/sec * 60 sec)
const REGEN_AMOUNT = 1; // Health points to regenerate
const MAX_HEALTH = 20; // Maximum health for players
const REGEN_DELAY_AFTER_DAMAGE = 2400; // 2 minutes after taking damage

let isInitialized = false;
const lastDamageTimes = new Map();

/**
 * Initialize natural regeneration service
 * @returns {void}
 */
export function init() {
    if (isInitialized) {
        console.warn("[naturalRegen] Already initialized, skipping.");
        return;
    }

    try {
        // Start damage tracking
        startDamageTracking();
        
        // Start regeneration loop
        startRegenerationLoop();
        
        isInitialized = true;
        console.warn("[naturalRegen] Natural regeneration initialized successfully.");
    } catch (error) {
        console.error("[naturalRegen] Failed to initialize:", error);
        throw error;
    }
}

/**
 * Start tracking player damage events
 * @returns {void}
 */
function startDamageTracking() {
    try {
        world.afterEvents.entityHurt.subscribe(function(event) {
            const player = event.hurtEntity;
            
            // Only track player damage
            if (player.typeId === "minecraft:player") {
                lastDamageTimes.set(player.id, system.currentTick);
            }
        });
    } catch (error) {
        console.error("[naturalRegen] Failed to subscribe to entityHurt event:", error);
        throw error;
    }
}

/**
 * Start the regeneration loop
 * @returns {void}
 */
function startRegenerationLoop() {
    system.runInterval(function() {
        regeneratePlayers();
    }, REGEN_INTERVAL);
}

/**
 * Regenerate health for eligible players
 * @returns {void}
 */
function regeneratePlayers() {
    const currentTick = system.currentTick;
    let regenCount = 0;

    try {
        for (const player of world.getAllPlayers()) {
            if (shouldRegenerate(player, currentTick)) {
                const currentHealth = player.getComponent("minecraft:health")?.currentValue || 0;
                
                if (currentHealth < MAX_HEALTH) {
                    const newHealth = Math.min(currentHealth + REGEN_AMOUNT, MAX_HEALTH);
                    const healthComponent = player.getComponent("minecraft:health");
                    
                    if (healthComponent) {
                        healthComponent.setCurrentValue(newHealth);
                        player.sendMessage("§a+1 Health (Natural Regeneration)");
                        regenCount++;
                    }
                }
            }
        }

        // Clean up old damage records
        cleanupOldDamageRecords(currentTick);

        if (regenCount > 0) {
            console.warn(`[naturalRegen] Regenerated health for ${regenCount} players.`);
        }
    } catch (error) {
        console.error("[naturalRegen] Error during regeneration:", error);
    }
}

/**
 * Check if a player should regenerate health
 * @param {import("@minecraft/server").Player} player - The player to check
 * @param {number} currentTick - Current server tick
 * @returns {boolean} True if player should regenerate
 */
function shouldRegenerate(player, currentTick) {
    // Check if player is in combat (recently damaged)
    const lastDamageTime = lastDamageTimes.get(player.id);
    
    if (lastDamageTime) {
        const timeSinceDamage = currentTick - lastDamageTime;
        if (timeSinceDamage < REGEN_DELAY_AFTER_DAMAGE) {
            return false; // Still in combat
        }
    }

    // Check if player is at full health
    const healthComponent = player.getComponent("minecraft:health");
    if (!healthComponent) {
        return false;
    }

    const currentHealth = healthComponent.currentValue;
    return currentHealth < MAX_HEALTH;
}

/**
 * Clean up old damage records to prevent memory leaks
 * @param {number} currentTick - Current server tick
 * @returns {void}
 */
function cleanupOldDamageRecords(currentTick) {
    const maxAge = REGEN_DELAY_AFTER_DAMAGE * 2; // Keep records for 4 minutes
    
    for (const [playerId, lastDamage] of lastDamageTimes.entries()) {
        if (currentTick - lastDamage > maxAge) {
            lastDamageTimes.delete(playerId);
        }
    }
}

/**
 * Get current regeneration configuration
 * @returns {Object} Current configuration
 */
export function getConfig() {
    return {
        regenInterval: REGEN_INTERVAL,
        regenAmount: REGEN_AMOUNT,
        maxHealth: MAX_HEALTH,
        regenDelayAfterDamage: REGEN_DELAY_AFTER_DAMAGE,
        trackedPlayers: lastDamageTimes.size,
        initialized: isInitialized
    };
}

/**
 * Force regenerate health for all players
 * @returns {number} Number of players regenerated
 */
export function forceRegenerate() {
    let regenCount = 0;
    try {
        for (const player of world.getAllPlayers()) {
            const healthComponent = player.getComponent("minecraft:health");
            if (healthComponent && healthComponent.currentValue < MAX_HEALTH) {
                healthComponent.setCurrentValue(MAX_HEALTH);
                player.sendMessage("§aHealth fully restored!");
                regenCount++;
            }
        }
        console.warn(`[naturalRegen] Force regenerated ${regenCount} players.`);
        return regenCount;
    } catch (error) {
        console.error("[naturalRegen] Error during force regeneration:", error);
        return 0;
    }
}