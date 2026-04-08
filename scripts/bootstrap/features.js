/**
 * @file bootstrap/features.js
 * @description Gameplay features bootstrap for Aethelgrad Core
 * @job Initializes all gameplay feature modules from the features/ directory
 * 
 * This bootstrap loads and initializes:
 * - Hub protection system (hubRules.js)
 * - NPC protection system (npcProtection.js)
 * - Starter kit system (starterKit.js) - utility function only
 * - Kit NPC interaction (kitNpc.js) - interaction handler
 * - Teleport NPC interaction (teleportNpc.js) - interaction handler
 * - Compass functionality (compass.js)
 * - Terms UI system (termsUi.js)
 * 
 * Each feature is wrapped in try-catch for robust initialization
 * Failed features don't prevent other features from loading
 * 
 * Loads: All files from features/ directory
 * Used by: main.js as part of startup sequence
 */

import { world, system } from "@minecraft/server";
import { init as initHubRules } from "../features/hub/hubRules.js";
import { init as initNpcProtection } from "../features/npc/npcProtection.js";
import { init as initNpcAnimations } from "../features/npc/npcAnimations.js";
import { init as initStarterKit, giveStarterKit } from "../features/kits/starterKit.js";
import { init as initKitNpc, handleKitNpc } from "../features/npc/kitNpc.js";
import { init as initTeleportNpc, handleTeleportNpc } from "../features/npc/teleportNpc.js";
import { init as initCompass } from "../features/compass/compass.js";
import { init as initTerms } from "../features/terms/termsUi.js";

// PRIORITY 1: Bootstrap Guard - Prevent double initialization
let initialized = false;

/**
 * Initializes all gameplay features
 * @returns {boolean} True if initialization succeeded, false otherwise
 */
export function init() {
    // PRIORITY 1: Bootstrap Guard
    if (initialized) {
        console.log("[bootstrap/features] Already initialized, skipping.");
        return true;
    }

    // WORKAROUND: Bedrock Module Loading Race Condition
    // PROBLEM: Modules sometimes fail to initialize silently on world load
    // WHY NEEDED: API doesn't guarantee module load order or success
    // NOTE: Improved in API 2.5.0 but kept for legacy stability
    // API VERSION: Updated from 2.4.0 to 2.5.0
    
    let success = true;
    
    try { 
        initHubRules(); 
    } catch (e) { 
        console.error("[bootstrap/features] initHubRules failed:", e); 
        success = false;
    }
    
    try { 
        initNpcProtection(); 
    } catch (e) { 
        console.error("[bootstrap/features] initNpcProtection failed:", e); 
        success = false;
    }
    
    try { 
        initNpcAnimations(); 
    } catch (e) { 
        console.error("[bootstrap/features] initNpcAnimations failed:", e); 
        success = false;
    }
    
    try { 
        initStarterKit(); 
    } catch (e) { 
        console.error("[bootstrap/features] initStarterKit failed:", e); 
        success = false;
    }
    
    try { 
        initKitNpc(); 
    } catch (e) { 
        console.error("[bootstrap/features] initKitNpc failed:", e); 
        success = false;
    }
    
    try { 
        initTeleportNpc(); 
    } catch (e) { 
        console.error("[bootstrap/features] initTeleportNpc failed:", e); 
        success = false;
    }
    
    try { 
        initCompass(); 
    } catch (e) { 
        console.error("[bootstrap/features] initCompass failed:", e); 
        success = false;
    }
    
    try { 
        initTerms(); 
    } catch (e) { 
        console.error("[bootstrap/features] initTerms failed:", e); 
        success = false;
    }
    
    // NPC Event Listeners
    try {
        // --- Interaction Listener (Stable) ---
        world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
            const { player, target } = ev;
            if (!target) return;

            // WORKAROUND: Bedrock UI Context Bug
            // PROBLEM: Entity interactions lose async context when calling UI functions directly
            // WHY NEEDED: @minecraft/server-ui requires preserved async context for modal forms
            // DO NOT REMOVE: Will cause "UI not available" errors on entity interactions
            // API VERSION: 2.4.0 Stable - confirmed broken in 1.21.90+
            system.run(async () => {
                if (target.typeId === "aethelgrad:kit_npc") {
                    await handleKitNpc(player);
                } else if (target.typeId === "aethelgrad:tp_npc") {
                    await handleTeleportNpc(player);
                }
            });
        });

        console.warn("[bootstrap/features] NPC Interaction Listener LOADED.");
    } catch (e) {
        console.error("[bootstrap/features] NPC event listeners failed:", e);
        success = false;
    }
    
    // PRIORITY 1: Mark as initialized
    initialized = true;
    
    // PRIORITY 2: Return health status
    if (success) {
        console.log("[bootstrap/features] All features initialized successfully.");
    } else {
        console.error("[bootstrap/features] Some features failed to initialize.");
    }
    
    return success;
}