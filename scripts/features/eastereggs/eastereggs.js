/**
 * @file features/eastereggs/eastereggs.js
 * @description Easter egg system for Aethelgrad Core
 * @job Provides hidden commands and special interactions for players
 * 
 * This system provides:
 * - Hidden command: ae::wobistdu (German phrase)
 * - Chat message interception
 * - Special sound effects and responses
 * - Command cancellation for hidden commands
 * 
 * Used by: Bootstrap system for initialization
 * 
 * @example
 * // Player types: ae::wobistdu
 * // System responds with German message and thunder sound
 */

import { world, system } from "@minecraft/server";

/**
 * Handles easter egg command detection and responses
 * @param {Player} player - The player who sent the message
 * @param {string} message - The chat message to check
 * @returns {boolean} True if easter egg command was handled
 */
function handleEasterEggCommand(player, message) {
    if (message === "ae::wobistdu") {
        player.sendMessage("§8» §7Ich suche dich unter jedem Stein...");
        player.playSound("ambient.weather.thunder", { pitch: 0.5, volume: 1.0 });
        return true;
    }
    return false;
}

/**
 * Initializes easter egg system with chat event listener
 * @returns {void}
 */
export function init() {
    console.warn("[eastereggs] Aethelgrad Legacy Easter Eggs initialized");
    
    // Register chat event listener for easter egg commands
    // FIXED: Use correct chat event API for 2026 - world.beforeEvents.chatSend
    world.beforeEvents.chatSend.subscribe((event) => {
        const { message, sender: player } = event;
        
        // Check for easter egg commands
        if (handleEasterEggCommand(player, message)) {
            // Cancel the event so the message doesn't appear in chat
            event.cancel = true;
            console.log(`[eastereggs] Player ${player.name} used easter egg: ${message}`);
        }
    });
    
    console.warn("[eastereggs] Easter egg command listener registered");
}
