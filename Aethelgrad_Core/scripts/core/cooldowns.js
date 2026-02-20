/**
 * @file core/cooldowns.js
 * @description Kit cooldown management system for Aethelgrad Core
 * @job Manages kit cooldowns using player tags to prevent kit spam and abuse
 * 
 * This system provides utilities to:
 * - Set kit cooldown timers on players
 * - Check remaining cooldown time
 * - Calculate minutes left for display
 * - Manage cooldown tags automatically
 * 
 * Used by: Kit NPCs, starter kit system, and any kit-related features
 * 
 * @example
 * // Set 1 minute cooldown
 * setKitReadyMs(player, 60000);
 * 
 * // Check if ready
 * const readyMs = getKitReadyMs(player);
 * if (readyMs > Date.now()) {
 *     const minsLeft = minsLeft(readyMs - Date.now());
 *     player.sendMessage(`§cKit ready in ${minsLeft} minutes`);
 * }
 */

const KIT_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour default cooldown
const KIT_TAG_PREFIX = "aeg:kitReadyMs:";

/**
 * Gets the kit ready timestamp from player tags
 * @param {Player} player - The player to check
 * @returns {number} Timestamp when kit becomes ready (0 if no cooldown)
 */
export function getKitReadyMs(player) {
    const tag = player.getTags().find(t => t.startsWith(KIT_TAG_PREFIX));
    return tag ? Number(tag.substring(KIT_TAG_PREFIX.length)) || 0 : 0;
}

/**
 * Sets kit cooldown on player by adding timestamp tag
 * @param {Player} player - The player to set cooldown on
 * @param {number} ms - Cooldown duration in milliseconds
 * @returns {void}
 */
export function setKitReadyMs(player, ms) {
    // Remove existing kit cooldown tags
    for (const t of player.getTags()) if (t.startsWith(KIT_TAG_PREFIX)) player.removeTag(t);
    // Add new cooldown tag with future timestamp
    player.addTag(KIT_TAG_PREFIX + String(Date.now() + ms));
}

/**
 * Converts milliseconds to minutes for display
 * @param {number} msRemaining - Milliseconds remaining
 * @returns {number} Minutes remaining (minimum 1)
 */
export function minsLeft(msRemaining) {
    return Math.max(1, Math.ceil(msRemaining / 60000));
}

export { KIT_COOLDOWN_MS };