// Hub-specific rules.
// These are server opinions, not general best practices.
// Adjust or remove for non-hub worlds.
// NOTE:
// Updated for @minecraft/server 2.5.0 - Command handling improved
// Many previously beta-only features now available in stable API
// Some workarounds may no longer be needed
import { 
    world, 
    system,
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType
} from "@minecraft/server";
import { canBypassHub } from "../../utils/permissionHelper.js";

// ====================
// CONFIGURATION
// ====================
const OVERWORLD = "overworld";
const BYPASS_TAGS = ["AE", "admin", "Admin", "AEh_manager"];

const DEFAULT_HUB_CENTER = { x: 9027, y: 100, z: 8978 };
const DEFAULT_HUB_RADIUS = 260;
const DEFAULT_HUB_SPAWN = { x: 9026.52, y: 236, z: 9033.47 };

// Items that are not allowed in hub area
const DEFAULT_BANNED_ITEMS = [
    "minecraft:lava_bucket", "minecraft:water_bucket", "minecraft:powder_snow_bucket",
    "minecraft:cod_bucket", "minecraft:salmon_bucket", "minecraft:pufferfish_bucket",
    "minecraft:tropical_fish_bucket", "minecraft:tadpole_bucket", "minecraft:axolotl_bucket",
    "minecraft:glow_squid_bucket", "minecraft:tnt"
];

// Hostile mobs that should be removed from hub
const HOSTILE_MOBS = [
    "minecraft:zombie", "minecraft:husk", "minecraft:drowned", "minecraft:skeleton",
    "minecraft:stray", "minecraft:creeper", "minecraft:spider", "minecraft:cave_spider",
    "minecraft:enderman", "minecraft:endermite", "minecraft:witch", "minecraft:vindicator",
    "minecraft:evoker", "minecraft:pillager", "minecraft:ravager", "minecraft:illusioner",
    "minecraft:slime", "minecraft:magma_cube", "minecraft:phantom", "minecraft:guardian",
    "minecraft:elder_guardian", "minecraft:hoglin", "minecraft:zoglin"
];

// ====================
// CONFIGURATION HELPERS
// ====================
function readHubCenter() {
    const x = world.getDynamicProperty("ae:hub_x");
    const y = world.getDynamicProperty("ae:hub_y");
    const z = world.getDynamicProperty("ae:hub_z");
    if (x === undefined || y === undefined || z === undefined) return null;
    return { x: Number(x), y: Number(y), z: Number(z) };
}

function readHubRadius() {
    const r = world.getDynamicProperty("ae:hub_radius");
    return r === undefined ? DEFAULT_HUB_RADIUS : Number(r);
}

function readBannedItems() {
    try {
        const s = world.getDynamicProperty("ae:banned_items");
        if (!s) return DEFAULT_BANNED_ITEMS;
        const arr = JSON.parse(s);
        return Array.isArray(arr) ? arr : DEFAULT_BANNED_ITEMS;
    } catch {
        return DEFAULT_BANNED_ITEMS;
    }
}

function getHubConfig() {
    const center = readHubCenter() ?? DEFAULT_HUB_CENTER;
    const radius = readHubRadius();
    const bannedItems = readBannedItems();
    return { center, radius, bannedItems };
}

// ====================
// PERMISSION HELPERS
// ====================
const isBypass = (player) => {
    // Check if player can bypass hub restrictions
    if (!player) return false;
    try {
        return canBypassHub(player);
    } catch {
        return false;
    }
};

// ====================
// ZONE DETECTION
// ====================
function inHub(loc, cfg) {
    if (!loc || !cfg || !cfg.center || cfg.radius <= 0) return false;
    
    // Calculate distances from hub center
    const dx = Math.abs(loc.x - cfg.center.x);
    const dz = Math.abs(loc.z - cfg.center.z);
    const dy = Math.abs(loc.y - cfg.center.y);
    
    // WORKAROUND: Bedrock Height Detection Issue
    // PROBLEM: Damage nullifier fails at extreme heights (flying, falling)
    // WHY NEEDED: API doesn't reliably track entity positions at high Y values
    // DO NOT REMOVE: Players will take damage when flying/falling in hub
    // API VERSION: 2.4.0 Stable - position tracking inconsistent above Y=200
    
    // Check horizontal distance AND reasonable height range
    const horizontalCheck = dx <= cfg.radius && dz <= cfg.radius;
    const heightCheck = dy <= 256; // Allow reasonable height range
    
    return horizontalCheck && heightCheck;
}

// ====================
// EFFECT MANAGEMENT
// ====================
function applyHubEffects(player) {
    // WORKAROUND: Bedrock Effect Icon Visibility Issue
    // PROBLEM: showParticles:false hides particles but NOT effect icons
    // WHY NEEDED: No API method exists to completely hide effect icons
    // DO NOT REMOVE: Effects provide protection, icons are unavoidable
    // API VERSION: 2.4.0 Stable - effect visibility not controllable
    try {
        player.addEffect("resistance", 100, { amplifier: 255, showParticles: false });
        player.addEffect("weakness", 100, { amplifier: 255, showParticles: false });
        player.addEffect("regeneration", 100, { amplifier: 255, showParticles: false });
        
        console.log(`[HubEffects] Applied effects to ${player.name} at X:${player.location.x.toFixed(2)} Y:${player.location.y.toFixed(2)} Z:${player.location.z.toFixed(2)}`);
    } catch (error) {
        console.warn(`[HubEffects] Failed to apply effects to ${player.name}:`, error);
    }
}

// ====================
// INVENTORY MANAGEMENT
// ====================
function enforceInventoryRules(player, bannedItems) {
    try {
        const inv = player.getComponent("minecraft:inventory")?.container;
        if (!inv) return;
        
        for (let i = 0; i < inv.size; i++) {
            try {
                const item = inv.getItem(i);
                if (item && bannedItems.includes(item.typeId)) {
                    inv.setItem(i, null);
                    try { 
                        player.sendMessage(`§c${item.typeId.replace("minecraft:", "")} is not allowed in the Hub!`); 
                    } catch {}
                }
            } catch {}
        }
    } catch {}
}

/**
 * Initializes hub protection system
 * @returns {void}
 */
export function init() {
    initHubRules();
}

// ====================
// MAIN PROTECTION ENGINE
// ====================
export function initHubRules() {
    // Effects and inventory enforcement - runs every 20 ticks (1 second)
    system.runInterval(() => {
        const cfg = getHubConfig();
        if (!cfg || !cfg.center) return;

        // Process all players in hub
        for (const player of world.getPlayers()) {
            if (!player || !player.location) continue;
            if (!inHub(player.location, cfg) || isBypass(player)) continue;

            // Apply protection effects
            applyHubEffects(player);
            
            // Enforce inventory rules
            enforceInventoryRules(player, cfg.bannedItems);
        }
    }, 20);

    // 2) Spawn enforcement (teleport to configured hub on first join)
    world.afterEvents.playerSpawn.subscribe(ev => {
        if (!ev.initialSpawn) return;
        const p = ev.player;
        if (!p) return;
        const cfg = getHubConfig();
        if (!cfg || !cfg.center) return;
        try { p.teleport(cfg.center, { dimension: world.getDimension(OVERWORLD), keepVelocity: false }); } catch {}
        if (!isBypass(p)) {
            try {
                p.setSpawnPoint({
                    dimension: world.getDimension(OVERWORLD),
                    x: Math.floor(cfg.center.x),
                    y: Math.floor(cfg.center.y),
                    z: Math.floor(cfg.center.z)
                });
            } catch {}
        }
    });

    // 3) Block break / interact protections
    world.beforeEvents.playerBreakBlock.subscribe(ev => {
        const cfg = getHubConfig();
        if (!cfg) return;
        try {
            if (!isBypass(ev.player) && ev.block && inHub(ev.block.location, cfg)) {
                ev.cancel = true;
                try { ev.player.sendMessage("§cYou cannot break blocks in the Hub!"); } catch {}
            }
        } catch {}
    });

    world.beforeEvents.playerInteractWithBlock.subscribe(ev => {
        const cfg = getHubConfig();
        if (!cfg) return;
        try {
            if (!isBypass(ev.player) && ev.block && inHub(ev.block.location, cfg)) {
                ev.cancel = true;
            }
        } catch {}
    });

    // 4) Item use protection
    world.beforeEvents.itemUse.subscribe(ev => {
        const cfg = getHubConfig();
        if (!cfg) return;
        try {
            if (!isBypass(ev.source) && ev.source && ev.source.location && inHub(ev.source.location, cfg) && cfg.bannedItems.includes(ev.itemStack?.typeId)) {
                ev.cancel = true;
            }
        } catch {}
    });

    // 5) Damage nullifier for anything inside hub
    world.afterEvents.entityHurt.subscribe(ev => {
        const cfg = getHubConfig();
        const victim = ev.hurtEntity;
        if (!victim || !victim.location) return;
        if (!cfg || !inHub(victim.location, cfg)) return;
        try {
            const hp = victim.getComponent("minecraft:health");
            if (hp) hp.setCurrentValue(hp.effectiveMax);
        } catch {}
    });

    // 6) Hostile mob purge
    system.runInterval(() => {
        const cfg = getHubConfig();
        if (!cfg || !cfg.center) return;
        const dim = world.getDimension(OVERWORLD);
        for (const e of dim.getEntities()) {
            if (!e || !e.location) continue;
            if (inHub(e.location, cfg) && HOSTILE_MOBS.includes(e.typeId)) {
                try { e.kill(); } catch {}
            }
        }
    }, 40);

    // 7) Explosion protection
    world.beforeEvents.explosion.subscribe(ev => {
        const cfg = getHubConfig();
        if (cfg && ev.location && inHub(ev.location, cfg)) ev.cancel = true;
    });

    console.warn("[Aethelgrad HubRules] initialized (data-driven hub).");
}
