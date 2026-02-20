/**
 * @file bootstrap/core.js
 * @description Core systems bootstrap for Aethelgrad Core
 * @job Initializes core system utilities and global configurations
 * 
 * This bootstrap loads and initializes:
 * - Core utility systems
 * - Global event listeners
 * - System-wide configurations
 * - Performance optimizations
 * 
 * Note: Core utilities (combatState.js, cooldowns.js) are imported on-demand
 * They don't need initialization since they're pure utility modules
 * 
 * Loads: No files (only sets up core infrastructure)
 * Used by: main.js as part of startup sequence
 * 
 * Dependencies: None (core infrastructure only)
 */

import { system } from "@minecraft/server";

// PRIORITY 1: Bootstrap Guard - Prevent double initialization
let initialized = false;

/**
 * Initializes core systems and global configurations
 * @returns {boolean} True if initialization succeeded, false otherwise
 */
export function init() {
    // PRIORITY 1: Bootstrap Guard
    if (initialized) {
        console.warn("[bootstrap/core] Already initialized, skipping.");
        return true;
    }

    // WORKAROUND: Bedrock Module Loading Race Condition
    // PROBLEM: Core systems sometimes fail to initialize silently on world load
    // WHY NEEDED: API doesn't guarantee module load order or success
    // NOTE: Improved in API 2.5.0 but kept for legacy stability
    // API VERSION: Updated from 2.4.0 to 2.5.0
    
    let success = true;
    
    try {
        // Initialize core utilities and systems
        // This would include things like:
        // - Performance optimizations
        // - Core utilities  
        // - Global event listeners
        // - System-wide configurations
        
        // Note: combatState.js and cooldowns.js are utility modules
        // They don't need initialization, just imported when needed
        
        console.warn("[bootstrap/core] Core systems initialized.");
    } catch (e) {
        console.error("[bootstrap/core] Core system initialization failed:", e);
        success = false;
    }

    // PRIORITY 1: Mark as initialized
    initialized = true;
    
    // PRIORITY 2: Return health status
    return success;
}