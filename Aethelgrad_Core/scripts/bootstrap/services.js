/**
 * @file bootstrap/services.js
 * @description Background services bootstrap for Aethelgrad Core
 * @job Initializes all background service modules from the services/ directory
 * 
 * This bootstrap loads and initializes:
 * - Broadcast system (broadcasts.js) - Server-wide announcements
 * - Ground item cleaner (cleaner.js) - Automatic cleanup system
 * - Natural regeneration (naturalRegen.js) - Health regeneration system
 * 
 * Each service is wrapped in try-catch for robust initialization
 * Failed services don't prevent other services from loading
 * 
 * PRIORITY 3: Services start with delay to ensure world stability
 * 
 * Loads: All files from services/ directory
 * Used by: main.js as part of startup sequence
 * 
 * Dependencies: world, dimensions, dynamic properties (delayed startup)
 */

import { init as initBroadcasts } from "../services/broadcasts.js";
import { init as initCleaner } from "../services/cleaner.js";
import { init as initNaturalRegen } from "../services/naturalRegen.js";
import { system } from "@minecraft/server";

// PRIORITY 1: Bootstrap Guard - Prevent double initialization
let initialized = false;

/**
 * Initializes all background services
 * @returns {boolean} True if initialization succeeded, false otherwise
 */
export function init() {
    // PRIORITY 1: Bootstrap Guard
    if (initialized) {
        console.warn("[bootstrap/services] Already initialized, skipping.");
        return true;
    }
    
    // PRIORITY 3: Delay service startup to ensure world stability
    // Services should not start immediately on Bedrock
    // Wait for world to stabilize before starting background services
    system.runTimeout(() => {
        initializeServices();
    }, 100); // 5 second delay at 20 ticks/sec
    
    // Mark as initialized immediately to prevent double calls
    initialized = true;
    console.warn("[bootstrap/services] Services scheduled for delayed startup.");
    return true;
}

/**
 * Internal function to actually initialize services
 * @returns {void}
 */
function initializeServices() {
    // WORKAROUND: Bedrock Module Loading Race Condition
    // PROBLEM: Modules sometimes fail to initialize silently on world load
    // WHY NEEDED: API doesn't guarantee module load order or success
    // NOTE: Improved in API 2.5.0 but kept for legacy stability
    // API VERSION: Updated from 2.4.0 to 2.5.0
    
    let success = true;
    let successCount = 0;
    let totalCount = 3;
    
    try { 
        initBroadcasts(); 
        successCount++;
        console.warn("[bootstrap/services] Broadcasts initialized successfully.");
    } catch (e) { 
        console.error("[bootstrap/services] initBroadcasts failed:", e); 
        success = false;
    }
    
    try { 
        initCleaner(); 
        successCount++;
        console.warn("[bootstrap/services] Cleaner initialized successfully.");
    } catch (e) { 
        console.error("[bootstrap/services] initCleaner failed:", e); 
        success = false;
    }
    
    try { 
        initNaturalRegen(); 
        successCount++;
        console.warn("[bootstrap/services] Natural regeneration initialized successfully.");
    } catch (e) { 
        console.error("[bootstrap/services] initNaturalRegen failed:", e); 
        success = false;
    }
    
    // PRIORITY 2: Return health status with detailed summary
    if (success) {
        console.warn(`[bootstrap/services] All ${successCount}/${totalCount} services initialized successfully.`);
    } else {
        console.error(`[bootstrap/services] Only ${successCount}/${totalCount} services initialized successfully.`);
    }
}