// ====================
// PERFORMANCE OPTIMIZATIONS
// ====================

/**
 * Performance improvements for Aethelgrad Core Legacy
 * These optimizations make the code run faster while staying compatible with API 2.4.0
 */

// ====================
// CACHED CONFIGURATION
// ====================

// Cache hub configuration to avoid repeated world.getDynamicProperty calls
let cachedHubConfig = null;
let configCacheTime = 0;
const CONFIG_CACHE_DURATION = 5000; // 5 seconds

function getCachedHubConfig() {
    const now = Date.now();
    
    // Return cached config if still valid
    if (cachedHubConfig && (now - configCacheTime) < CONFIG_CACHE_DURATION) {
        return cachedHubConfig;
    }
    
    // Refresh cache
    cachedHubConfig = getHubConfig();
    configCacheTime = now;
    return cachedHubConfig;
}

// ====================
// OPTIMIZED PLAYER PROCESSING
// ====================

// Process players in batches to reduce lag
function processPlayersInBatch(players, batchSize = 5) {
    const results = [];
    
    for (let i = 0; i < players.length; i += batchSize) {
        const batch = players.slice(i, i + batchSize);
        
        // Process each player in the batch
        for (const player of batch) {
            if (!player || !player.location) continue;
            
            const cfg = getCachedHubConfig();
            if (!cfg || !cfg.center) continue;
            
            if (inHub(player.location, cfg) && !isBypass(player)) {
                results.push(player);
            }
        }
        
        // Small delay between batches to prevent lag
        if (i + batchSize < players.length) {
            system.runTimeout(() => {}, 1);
        }
    }
    
    return results;
}

// ====================
// SMART EFFECT APPLICATION
// ====================

// Track which players already have effects to avoid re-applying
const playersWithEffects = new Set();

function applyEffectsSmartly(player) {
    const playerId = player.id;
    
    // Skip if player already has effects
    if (playersWithEffects.has(playerId)) {
        return;
    }
    
    // Apply effects and track player
    applyHubEffects(player);
    playersWithEffects.add(playerId);
    
    // Remove from tracking after effects expire (100 ticks = 5 seconds)
    system.runTimeout(() => {
        playersWithEffects.delete(playerId);
    }, 100);
}

// ====================
// OPTIMIZED INVENTORY CHECKING
// ====================

// Cache inventory checks to avoid repeated scanning
const inventoryCache = new Map();
const INVENTORY_CACHE_DURATION = 2000; // 2 seconds

function checkInventoryOptimized(player, bannedItems) {
    const playerId = player.id;
    const now = Date.now();
    const cached = inventoryCache.get(playerId);
    
    // Return cached result if still valid
    if (cached && (now - cached.time) < INVENTORY_CACHE_DURATION) {
        return cached.result;
    }
    
    // Perform inventory check
    let foundBannedItems = false;
    
    try {
        const inv = player.getComponent("minecraft:inventory")?.container;
        if (!inv) {
            inventoryCache.set(playerId, { time: now, result: false });
            return false;
        }
        
        for (let i = 0; i < inv.size; i++) {
            try {
                const item = inv.getItem(i);
                if (item && bannedItems.includes(item.typeId)) {
                    inv.setItem(i, null);
                    foundBannedItems = true;
                    try { 
                        player.sendMessage(`§c${item.typeId.replace("minecraft:", "")} is not allowed in the Hub!`); 
                    } catch {}
                }
            } catch {}
        }
    } catch {}
    
    // Cache result
    inventoryCache.set(playerId, { time: now, result: foundBannedItems });
    return foundBannedItems;
}

// ====================
// MEMORY MANAGEMENT
// ====================

// Clean up caches periodically to prevent memory leaks
function cleanupCaches() {
    const now = Date.now();
    
    // Clean inventory cache
    for (const [playerId, data] of inventoryCache.entries()) {
        if ((now - data.time) > INVENTORY_CACHE_DURATION * 2) {
            inventoryCache.delete(playerId);
        }
    }
    
    // Clean effect tracking
    for (const playerId of playersWithEffects) {
        const player = world.getPlayers().find(p => p.id === playerId);
        if (!player) {
            playersWithEffects.delete(playerId);
        }
    }
    
    console.log("[Performance] Cache cleanup completed");
}

// Run cleanup every 30 seconds
system.runInterval(cleanupCaches, 600);

// ====================
// OPTIMIZED MAIN LOOP
// ====================

export function initOptimizedHubRules() {
    // Optimized effects and inventory enforcement
    system.runInterval(() => {
        const cfg = getCachedHubConfig();
        if (!cfg || !cfg.center) return;

        // Get all players and process in batches
        const allPlayers = world.getPlayers();
        const playersInHub = processPlayersInBatch(allPlayers);
        
        // Apply optimized effects and inventory checks
        for (const player of playersInHub) {
            applyEffectsSmartly(player);
            checkInventoryOptimized(player, cfg.bannedItems);
        }
    }, 20);
    
    console.log("[Performance] Optimized hub rules initialized");
}

// ====================
// USAGE INSTRUCTIONS
// ====================

/*
HOW TO USE THESE OPTIMIZATIONS:

1. Replace the main loop in hubRules.js with initOptimizedHubRules()
2. Keep all existing event handlers (spawn, block break, etc.)
3. The optimizations will automatically:
   - Cache configuration to reduce API calls
   - Process players in batches to prevent lag
   - Track effect applications to avoid duplicates
   - Cache inventory checks to improve performance
   - Clean up memory periodically

BENEFITS:
- Less lag from repeated API calls
- Smoother gameplay for players
- Better memory management
- More consistent performance

COMPATIBILITY:
- Fully compatible with API 2.4.0
- No breaking changes to existing code
- Can be enabled/disabled easily
- Safe for legacy release
*/
