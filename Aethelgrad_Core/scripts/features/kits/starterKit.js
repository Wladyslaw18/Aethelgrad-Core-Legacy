/**
 * @file features/kits/starterKit.js
 * @description Starter kit utility functions for Aethelgrad Core
 * @job Provides starter kit distribution functionality for new players
 * 
 * This utility provides:
 * - Starter kit item distribution
 * - Iron tool and armor set
 * - Food and building materials
 * - Error handling for inventory operations
 * 
 * Used by: Kit NPC system (kitNpc.js) for giving starter kits
 * 
 * Note: This is a utility module - no initialization required
 * Functions are imported and called directly by other modules
 * 
 * @example
 * // Give starter kit to player
 * giveStarterKit(player);
 */

import { ItemStack } from "@minecraft/server";

/**
 * Initializes the starter kit system
 * @returns {void}
 * Note: This is a utility module, init() is provided for bootstrap compatibility
 * but doesn't need to do anything since giveStarterKit() handles everything
 */
export function init() {
    // No initialization needed - utility functions are called on-demand
    // This function exists for bootstrap architecture compatibility
}

/**
 * Gives a starter kit to the specified player
 * @param {Player} p - The player to receive the starter kit
 * @returns {void}
 */
export function giveStarterKit(p) {
    const inv = p.getComponent("minecraft:inventory")?.container;
    if (!inv) return;

    const items = [
        "minecraft:iron_sword", "minecraft:iron_pickaxe",
        "minecraft:iron_axe", "minecraft:iron_shovel",
        "minecraft:iron_hoe", "minecraft:iron_helmet",
        "minecraft:iron_chestplate", "minecraft:iron_leggings",
        "minecraft:iron_boots", "minecraft:cooked_beef", "minecraft:oak_planks"
    ];

    for (const id of items) {
        try {
            // VERIFIED: addItem is the stable standard
            const amount = (id.includes("beef") || id.includes("planks")) ? 64 : 1;
            inv.addItem(new ItemStack(id, amount));
        } catch (err) {
            console.error(`Failed to add ${id}: ${err.message}`);
        }
    }

    p.sendMessage("§aYou received the Starter Iron Kit!");
}