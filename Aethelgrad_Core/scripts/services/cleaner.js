import {
    system,
    world,
    CommandPermissionLevel,
    CustomCommandStatus
} from "@minecraft/server";

//  CONFIGURATION
const ADMIN_TAGS = ["AE", "AEC", "admin", "Admin"];
const CLEAN_INTERVAL = 20 * 60 * 20;      // every 20 minutes
const ANNOUNCE_INTERVAL = 5 * 60 * 20;    // announce every 5 minutes
const COUNTDOWN_SECONDS = 10;
const VOID_COORDS = { x: 0, y: -256, z: 0 };
const FOLLOWUP_ATTEMPTS = 4;
const FOLLOWUP_INTERVAL_TICKS = 20;

//  INTERNAL STATE
let ticksSinceLastClean = 0;

//  Try to remove entity safely
function tryRemoveEntity(entity) {
    try {
        if (typeof entity.remove === "function") {
            entity.remove();
            return true;
        }
    } catch {}
    try {
        if (typeof entity.kill === "function") {
            entity.kill();
            return true;
        }
    } catch {}
    try {
        if (typeof entity.teleport === "function") {
            entity.teleport(VOID_COORDS);
            return "teleported";
        }
    } catch {}
    return false;
}

//  Perform cleanup pass
function performCleanupPass() {
    let initial = 0;
    let removed = 0;
    let teleported = 0;

    const dims = (typeof world.getDimensions === "function")
        ? [...world.getDimensions()]
        : [
            world.getDimension("overworld"),
            world.getDimension("nether"),
            world.getDimension("the_end")
        ];

    for (const dim of dims) {
        if (!dim) continue;
        const items = dim.getEntities({ type: "minecraft:item" }) || [];
        initial += items.length;

        for (const it of items) {
            const res = tryRemoveEntity(it);
            if (res === true) removed++;
            else if (res === "teleported") teleported++;
        }
    }

    let remaining = 0;
    for (const dim of dims) {
        if (!dim) continue;
        const items = dim.getEntities({ type: "minecraft:item" }) || [];
        remaining += items.length;
    }

    return { initial, removed, teleported, remaining };
}

//  Retry leftover items a few times
function followupRetries(callback) {
    let attempts = 0;
    const id = system.runInterval(() => {
        attempts++;
        const dims = (typeof world.getDimensions === "function")
            ? [...world.getDimensions()]
            : [
                world.getDimension("overworld"),
                world.getDimension("nether"),
                world.getDimension("the_end")
            ];

        let removedThisPass = 0;
        let teleportedThisPass = 0;

        for (const dim of dims) {
            if (!dim) continue;
            const items = dim.getEntities({ type: "minecraft:item" }) || [];
            for (const it of items) {
                const res = tryRemoveEntity(it);
                if (res === true) removedThisPass++;
                else if (res === "teleported") teleportedThisPass++;
            }
        }

        let remaining = 0;
        for (const dim of dims) {
            if (!dim) continue;
            remaining += (dim.getEntities({ type: "minecraft:item" }) || []).length;
        }

        if (remaining === 0 || attempts >= FOLLOWUP_ATTEMPTS) {
            system.clearRun(id);
            callback({ attempts, removedThisPass, teleportedThisPass, remaining });
        }
    }, FOLLOWUP_INTERVAL_TICKS);
}

//  Core cleanup routine
function clearGroundItems() {
    const pass = performCleanupPass();

    if (pass.initial === 0) {
        world.sendMessage("§eCleaner: No dropped items found.");
        return;
    }

    if (pass.remaining === 0) {
        world.sendMessage(`§eAll dropped items cleared. Removed: §7${pass.removed}§e.`);
        for (const p of world.getPlayers()) {
            try { p.runCommandAsync("playsound random.orb @s"); } catch {}
        }
        return;
    }

    followupRetries(({ attempts, removedThisPass, teleportedThisPass, remaining }) => {
        const totalRemoved = pass.removed + removedThisPass;
        world.sendMessage(`§6[Cleaner]§e Cleared §a${totalRemoved}§e items. Remaining: §c${remaining}§e.`);
        for (const p of world.getPlayers()) {
            try { p.runCommandAsync("playsound random.orb @s"); } catch {}
        }
        if (remaining > 0) {
            console.warn(`[Cleaner] Some items remain after ${attempts} attempts (${remaining} left).`);
        }
    });
}

//  Countdown to cleanup
function startCountdown() {
    let remaining = COUNTDOWN_SECONDS;
    const id = system.runInterval(() => {
        if (remaining <= 0) {
            system.clearRun(id);
            clearGroundItems();
            return;
        }
        world.sendMessage(`§6[Cleaner]§e Clearing all ground items in §c${remaining}s§e...`);
        remaining--;
    }, 20);
}

export function init() {
    //  Automatic timed cleanup loop
    system.runInterval(() => {
        ticksSinceLastClean += 20;

        if (ticksSinceLastClean % ANNOUNCE_INTERVAL === 0 && ticksSinceLastClean < CLEAN_INTERVAL) {
            const remainingMin = Math.floor((CLEAN_INTERVAL - ticksSinceLastClean) / 1200);
            world.sendMessage(`§6[Cleaner]§e Ground items will be cleared in §c${remainingMin} minutes§e.`);
        }

        if (ticksSinceLastClean >= CLEAN_INTERVAL) {
            world.sendMessage("§6[Cleaner]§e Cleanup starting in §c10 seconds§e...");
            startCountdown();
            ticksSinceLastClean = 0;
        }
    }, 20);

    //  Manual cleaner command
    system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
        customCommandRegistry.registerCommand({
            name: "ae:cleaner",
            description: "Manually clear all ground items (requires admin tag).",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false
        }, (origin) => {
            const player = origin?.sourceEntity;
            if (!player) {
                return { status: CustomCommandStatus.Failure, message: "Must be run by a player." };
            }
            const hasAdminTag = ADMIN_TAGS.some(tag => player.hasTag(tag));
            if (!hasAdminTag) {
                return { status: CustomCommandStatus.Failure, message: "§cYou do not have permission to use this command." };
            }

            world.sendMessage(`§6[Cleaner]§e Manual cleanup triggered by §a${player.name}§e.`);
            clearGroundItems();
            return { status: CustomCommandStatus.Success, message: "Cleanup executed." };
        });
        console.warn("[Aethelgrad Lag Cleaner] loaded (20-minute cycle).");
    });
}