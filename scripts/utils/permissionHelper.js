    // Permission Helper - Clean permission system for Aethelgrad Core
// Focuses only on permission checking, no command logic

export const DEPARTMENT_TAGS = {
    hub: "AEH",        // Hub Manager
    h: "AEH",          // Hub Manager (short code)
    broadcast: "AEB",  // Broadcast Manager
    b: "AEB",          // Broadcast Manager (short code)
    cleaner: "AEC",    // Cleaner Manager
    c: "AEC",          // Cleaner Manager (short code)
    npc: "AEN",        // NPC Manager
    n: "AEN",          // NPC Manager (short code)
    admin: "AE"        // Master Admin
};

export function hasPermission(player, department) {
    if (!player) return false;
    
    const tags = player.getTags();
    const requiredTag = DEPARTMENT_TAGS[department.toLowerCase()];
    
    if (!requiredTag) return false; // Invalid department
    
    // Debug logging
    console.log(`[Permission Check] Player: ${player.name}, Tags: [${tags.join(', ')}], Required: ${requiredTag}, Department: ${department}`);
    
    // Logic: Master Admin OR Department Manager
    const hasPermission = tags.some(t => ["AE", "Admin", "admin", requiredTag].includes(t));
    console.log(`[Permission Check] Result: ${hasPermission}`);
    
    return hasPermission;
}

export function getDepartmentTag(department) {
    return DEPARTMENT_TAGS[department.toLowerCase()];
}

export function getPlayerPermissions(player) {
    if (!player) return [];
    
    const tags = player.getTags();
    const permissions = [];
    
    // Check each department permission
    for (const [dept, tag] of Object.entries(DEPARTMENT_TAGS)) {
        if (tags.some(t => ["AE", "Admin", "admin", tag].includes(t))) {
            permissions.push(dept);
        }
    }
    
    return permissions;
}

export function canBypassHub(player) {
    if (!player) return false;
    
    const tags = player.getTags();
    // Check if player has hub bypass permissions
    return tags.some(t => ["AE", "admin", "Admin", "AEH"].includes(t));
}

export function canManageBroadcasts(player) {
    if (!player) return false;
    
    const tags = player.getTags();
    // Check if player has broadcast management permissions
    return tags.some(t => ["AE", "admin", "Admin", "AEB"].includes(t));
}
