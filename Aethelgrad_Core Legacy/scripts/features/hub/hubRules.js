// Hub-specific rules.
// These are server opinions, not general best practices.
// Adjust or remove for non-hub worlds.
// NOTE:
// Command handling in @minecraft/server 2.4.0 is incomplete.
// Many commands remain beta-only and some actions cannot be blocked.
// This is a Bedrock API limitation, not a bug in this addon.
// Use beta APIs at your own risk.
import { world, system } from "@minecraft/server";
import { canBypassHub } from "../../utils/permissionHelper.js";

// ==============================
// CONFIG: default fallback values
// ==============================
const OVERWORLD = "overworld";
const BYPASS_TAGS = ["AE", "admin", "Admin", "AEh_manager"];

const DEFAULT_HUB_CENTER = { x: 9027, y: 100, z: 8978 };
const DEFAULT_HUB_RADIUS = 260;
const DEFAULT_HUB_SPAWN = { x: 9026.52, y: 236, z: 9033.47 };

const DEFAULT_BANNED_ITEMS = [
    "minecraft:lava_bucket", "minecraft:water_bucket", "minecraft:powder_snow_bucket",
    "minecraft:cod_bucket", "minecraft:salmon_bucket", "minecraft:pufferfish_bucket",
    "minecraft:tropical_fish_bucket", "minecraft:tadpole_bucket", "minecraft:axolotl_bucket",
    "minecraft:glow_squid_bucket", "minecraft:tnt"
];

const HOSTILE_MOBS = [
    "minecraft:zombie", "minecraft:husk", "minecraft:drowned", "minecraft:skeleton",
    "minecraft:stray", "minecraft:creeper", "minecraft:spider", "minecraft:cave_spider",
    "minecraft:enderman", "minecraft:endermite", "minecraft:witch", "minecraft:vindicator",
    "minecraft:evoker", "minecraft:pillager", "minecraft:ravager", "minecraft:illusioner",
    "minecraft:slime", "minecraft:magma_cube", "minecraft:phantom", "minecraft:guardian",
    "minecraft:elder_guardian", "minecraft:hoglin", "minecraft:zoglin"
];

// ==============================
// HELPERS: read dynamic properties (data-driven)
// ==============================
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

const isBypass = (player) => {
    // LEGACY: Using new permission helper for consistency
    // Old BYPASS_TAGS kept for reference but not used
    if (!player) return false;
    try {
        return canBypassHub(player);
    } catch {
        return false;
    }
};

function inHub(loc, cfg) {
    if (!loc || !cfg || !cfg.center || cfg.radius <= 0) return false;
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

// ==============================
// PROTECTION ENGINE
// ==============================
export function initHubRules() {
    // 1) Effects + inventory enforcement loop (lightweight)
    system.runInterval(() => {
        const cfg = getHubConfig();
        if (!cfg || !cfg.center) return;

        for (const p of world.getPlayers()) {
            if (!p || !p.location) continue;
            if (!inHub(p.location, cfg) || isBypass(p)) continue;

            // apply effects (attempt to hide particles; API may or may not show)
            // WORKAROUND: Bedrock Effect Icon Visibility Issue
            // PROBLEM: showParticles:false hides particles but NOT effect icons
            // WHY NEEDED: No API method exists to completely hide effect icons
            // DO NOT REMOVE: Effects provide protection, icons are unavoidable
            // API VERSION: 2.4.0 Stable - effect visibility not controllable
            try {
                p.addEffect("resistance", 100, { amplifier: 255, showParticles: false });
                p.addEffect("weakness", 100, { amplifier: 255, showParticles: false });
                p.addEffect("regeneration", 100, { amplifier: 255, showParticles: false });
                
                // DEBUG: Log effect application
                console.log(`[HubEffects] Applied effects to ${p.name} at X:${p.location.x.toFixed(2)} Y:${p.location.y.toFixed(2)} Z:${p.location.z.toFixed(2)}`);
            } catch (error) {
                console.warn(`[HubEffects] Failed to apply effects to ${p.name}:`, error);
            }

            // Inventory enforcement
            try {
                const inv = p.getComponent("minecraft:inventory")?.container;
                if (!inv) continue;
                for (let i = 0; i < inv.size; i++) {
                    try {
                        const item = inv.getItem(i);
                        if (item && cfg.bannedItems.includes(item.typeId)) {
                            inv.setItem(i, null);
                            try { p.sendMessage(`§c${item.typeId.replace("minecraft:", "")} is not allowed in the Hub!`); } catch {}
                        }
                    } catch {}
                }
            } catch {}
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

    // 8) Admin command registrations (sethub/setradius/banitem)
    system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
        try {
            // /ae:sethub
            customCommandRegistry.registerCommand({
                name: "ae:sethub",
                description: "Set the hub center to your current location.",
                permissionLevel: 1
            }, (origin) => {
                const p = origin.sourceEntity;
                if (!p) return { status: 1, message: "Only players can run this." };
                const loc = p.location;
                world.setDynamicProperty("ae:hub_x", Math.floor(loc.x));
                world.setDynamicProperty("ae:hub_y", Math.floor(loc.y));
                world.setDynamicProperty("ae:hub_z", Math.floor(loc.z));
                return { status: 0, message: "Hub location saved." };
            });

            // /ae:setradius <radius>
            customCommandRegistry.registerCommand({
                name: "ae:setradius",
                description: "Set protection radius for the hub.",
                permissionLevel: 1,
                arguments: [{ name: "radius", type: "int" }]
            }, (origin, args) => {
                const radius = Number(args.radius);
                if (Number.isNaN(radius) || radius < 0) return { status: 1, message: "Radius must be 0 or greater." };
                world.setDynamicProperty("ae:hub_radius", radius);
                return { status: 0, message: `Hub radius set to ${radius}.` };
            });

            // /ae:hubdebug - Check if player is in hub zone
            customCommandRegistry.registerCommand({
                name: "ae:hubdebug",
                description: "Check if you're in the hub protection zone",
                permissionLevel: 0 // Anyone can run
            }, (origin) => {
                const p = origin.sourceEntity;
                if (!p) return { status: 1, message: "Only players can run this." };
                
                const cfg = getHubConfig();
                const loc = p.location;
                const dx = Math.abs(loc.x - cfg.center.x);
                const dz = Math.abs(loc.z - cfg.center.z);
                const dy = Math.abs(loc.y - cfg.center.y);
                
                const horizontalCheck = dx <= cfg.radius && dz <= cfg.radius;
                const heightCheck = dy <= 256;
                const inHubZone = horizontalCheck && heightCheck;
                const bypass = isBypass(p);
                
                return { 
                    status: 0, 
                    message: `§eHub Debug:\n` +
                           `§7Position: §a${loc.x.toFixed(2)}, ${loc.y.toFixed(2)}, ${loc.z.toFixed(2)}\n` +
                           `§7Center: §a${cfg.center.x.toFixed(2)}, ${cfg.center.y.toFixed(2)}, ${cfg.center.z.toFixed(2)}\n` +
                           `§7Radius: §a${cfg.radius}\n` +
                           `§7Distance X: §a${dx.toFixed(2)} §7| Z: §a${dz.toFixed(2)} §7| Y: §a${dy.toFixed(2)}\n` +
                           `§7In Hub Zone: ${inHubZone ? '§aYes' : '§cNo'}\n` +
                           `§7Bypass: ${bypass ? '§aYes' : '§cNo'}`
                };
            });
            customCommandRegistry.registerCommand({
                name: "ae:banitem",
                description: "Ban the item in your hand from the hub.",
                permissionLevel: 1
            }, (origin) => {
                const p = origin.sourceEntity;
                if (!p) return { status: 1, message: "Only players can run this." };
                const inv = p.getComponent("minecraft:inventory")?.container;
                const item = inv?.getItem(p.selectedSlotIndex);
                if (!item) return { status: 1, message: "Hold an item to ban it." };
                try {
                    const current = JSON.parse(world.getDynamicProperty("ae:banned_items") ?? "[]");
                    if (!Array.isArray(current)) current.length = 0;
                    if (!current.includes(item.typeId)) {
                        current.push(item.typeId);
                        world.setDynamicProperty("ae:banned_items", JSON.stringify(current));
                    }
                } catch {
                    world.setDynamicProperty("ae:banned_items", JSON.stringify([item.typeId]));
                }
                return { status: 0, message: `Banned ${item.typeId} from the Hub.` };
            });
        } catch (e) {
            console.warn("[HubRules] command registration failed:", e);
        }
    });

    console.warn("[Aethelgrad HubRules] initialized (data-driven hub).");
}
// This is intentianl.