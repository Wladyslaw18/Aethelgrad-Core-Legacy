    export const PERMISSION_LEVELS = {
    OWNER: ["AE", "admin", "Admin", "AEo_manager"],
    ADMIN: ["AE", "admin", "Admin", "AEa_manager"],
    MODERATOR: ["AE", "admin", "Admin", "AEm_manager"],
    HELPER: ["aethelgrad:helper"],
    BROADCAST_MANAGER: ["AE", "admin", "Admin", "AEb_manager"],
    HUB_MANAGER: ["AE", "admin", "Admin", "AEh_manager"]
};

/**
 * Check if player has required permission level
 * @param {Player} player - Player to check
 * @param {string} level - Permission level from PERMISSION_LEVELS
 * @returns {boolean} - Whether player has permission
 */
export function hasPermission(player, level) {
    if (!player || !level) return false;
    
    const requiredTags = PERMISSION_LEVELS[level];
    if (!requiredTags) return false;
    
    try {
        return player.getTags().some(tag => requiredTags.includes(tag));
    } catch (error) {
        console.warn(`[PermissionHelper] Error checking permissions: ${error.message}`);
        return false;
    }
}

/**
 * Get player's highest permission level
 * @param {Player} player - Player to check
 * @returns {string|null} - Highest permission level or null
 */
export function getPlayerRank(player) {
    if (!player) return null;
    
    try {
        const tags = player.getTags();
        
        // Check in order of hierarchy (highest to lowest)
        if (tags.some(tag => PERMISSION_LEVELS.OWNER.includes(tag))) return 'OWNER';
        if (tags.some(tag => PERMISSION_LEVELS.ADMIN.includes(tag))) return 'ADMIN';
        if (tags.some(tag => PERMISSION_LEVELS.MODERATOR.includes(tag))) return 'MODERATOR';
        if (tags.some(tag => PERMISSION_LEVELS.HELPER.includes(tag))) return 'HELPER';
        
        return 'PLAYER';
    } catch (error) {
        console.warn(`[PermissionHelper] Error getting player rank: ${error.message}`);
        return null;
    }
}

/**
 * Check if player can bypass hub restrictions
 * @param {Player} player - Player to check
 * @returns {boolean} - Whether player can bypass
 */
export function canBypassHub(player) {
    return hasPermission(player, 'HUB_MANAGER') || hasPermission(player, 'OWNER');
}

/**
 * Check if player can manage broadcasts
 * @param {Player} player - Player to check
 * @returns {boolean} - Whether player can manage broadcasts
 */
export function canManageBroadcasts(player) {
    return hasPermission(player, 'BROADCAST_MANAGER');
}
