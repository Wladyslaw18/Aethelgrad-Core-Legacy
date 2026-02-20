/**
 * @file features/terms/termsUi.js
 * @description Terms of Service UI system for Aethelgrad Core
 * @job Displays server terms and rules to new players periodically
 * 
 * This system provides:
 * - Terms display on first player join
 * - Automatic re-display every 6 months
 * - Date tracking for last shown terms
 * - Player dynamic property storage
 * 
 * Used by: Bootstrap system for initialization
 * 
 * @example
 * // Terms are automatically shown to new players
 * // Players must agree to terms to continue playing
 */

import { world } from "@minecraft/server";

/**
 * Gets current date as YYYY-MM-DD format
 * @returns {string} Current date string
 */
function todayDate() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Converts date string to total days number
 * @param {string} str - Date string in YYYY-MM-DD format
 * @returns {number} Days since epoch
 */
function dateToDays(str) {
    const [y, m, d] = str.split("-").map(n => parseInt(n));
    return Math.floor(new Date(y, m - 1, d).getTime() / (1000 * 60 * 60 * 24));
}

/**
 * Shows disclaimer message to player
 * @param {Player} player - The player to show disclaimer to
 * @returns {void}
 */
function showDisclaimer(player) {
    player.sendMessage("§6==============================");
    player.sendMessage("§eBy playing on Æthelgrad, you agree to our Terms of Service & rules.");
    player.sendMessage("§cYou must be at least 13 years old, or have parent/guardian approval.");
    player.sendMessage("§6Æthelgrad staff are not responsible for personal info you share.");
    player.sendMessage("§4Inappropriate builds result in a permanent ban.");
    player.sendMessage("§aPlay fair, respect others, and enjoy your time on Æthelgrad!");
    player.sendMessage("§6==============================");
}

/**
 * Initializes terms UI system with player spawn event listener
 * @returns {void}
 */
export function init() {
    /// Show disclaimer on first join + after 6 months
    world.afterEvents.playerSpawn.subscribe(ev => {
        if (!ev.initialSpawn) return;
        const player = ev.player;

        const today = todayDate();
        let lastDisclaimer = player.getDynamicProperty("lastDisclaimer");

        if (!lastDisclaimer) {
            // First join → show disclaimer
            showDisclaimer(player);
            player.setDynamicProperty("lastDisclaimer", today);
        } else {
            const lastDays = dateToDays(lastDisclaimer);
            const nowDays = dateToDays(today);

            // Show again if 180+ days (6 months) since last shown
            if (nowDays - lastDays >= 180) {
                showDisclaimer(player);
            }

            // Always update timestamp
            player.setDynamicProperty("lastDisclaimer", today);
        }
    });
}