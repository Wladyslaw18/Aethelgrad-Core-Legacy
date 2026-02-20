import {
    system,
    world,
    CommandPermissionLevel,
    CustomCommandStatus
} from "@minecraft/server";

// ==============================
// AETHELGRAD HUB COMMANDS
// Updated for @minecraft/server 2.5.0
// ==============================

// ==============================
// CONFIGURATION
// ==============================
const COOLDOWN_SECONDS = 10;
const COMBAT_TAG_SECONDS = 15;

// ==============================
// STATE TRACKING
// ==============================
const lastUse = new Map();
const combatTag = new Map();

function ticksNow() { return system.currentTick; }
function secToTicks(sec) { return sec * 20; }

// ==============================
// HUB LOCATION (DYNAMIC)
// ==============================
function getHubLocation() {
    const x = world.getDynamicProperty("ae:hub_x");
    const y = world.getDynamicProperty("ae:hub_y");
    const z = world.getDynamicProperty("ae:hub_z");

    if (x === undefined || y === undefined || z === undefined) return null;

    return { x: Number(x), y: Number(y), z: Number(z) };
}

// ==============================
// COMBAT DETECTION
// ==============================
world.afterEvents.entityHurt.subscribe(ev => {
    try {
        const attacker = ev.damageSource?.damagingEntity;
        const victim = ev.hurtEntity;

        if (attacker?.typeId === "minecraft:player") {
            combatTag.set(attacker.name, ticksNow());
        }
        if (victim?.typeId === "minecraft:player") {
            combatTag.set(victim.name, ticksNow());
        }
    } catch {}
});

// ==============================
// COMMAND REGISTRATION
// ==============================
export function registerHubCommand(customCommandRegistry) {
    try {
        customCommandRegistry.registerCommand(
            {
                name: "ae:hub",
                description: "Teleport to the Aethelgrad Hub.",
                permissionLevel: CommandPermissionLevel.Any,
                cheatsRequired: false
            },
            (origin) => {
                const player = origin?.sourceEntity;
                if (!player) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "Must be run by a player."
                    };
                }

                const now = ticksNow();
                const name = player.name;

                // --- Hub exists check ---
                const hub = getHubLocation();
                if (!hub) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "§cHub location is not set."
                    };
                }

                // --- Combat check ---
                const lastCombat = combatTag.get(name);
                if (lastCombat !== undefined) {
                    const since = now - lastCombat;
                    const remainTicks = secToTicks(COMBAT_TAG_SECONDS) - since;

                    if (remainTicks > 0) {
                        return {
                            status: CustomCommandStatus.Failure,
                            message: `§cYou are in combat! Try again in ${Math.ceil(remainTicks / 20)}s.`
                        };
                    } else {
                        combatTag.delete(name);
                    }
                }

                // --- Cooldown check ---
                const last = lastUse.get(name) ?? 0;
                const since = now - last;
                const remainTicks = secToTicks(COOLDOWN_SECONDS) - since;

                if (remainTicks > 0) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: `§ePlease wait ${Math.ceil(remainTicks / 20)}s before using /ae:hub again.`
                    };
                }

                // --- Teleport ---
                // WORKAROUND: Bedrock Command Context Preservation
                // PROBLEM: Teleport after command execution can fail due to context loss
                // WHY NEEDED: system.run preserves execution context for teleport
                // NOTE: May no longer be needed in API 2.5.0, kept for stability
                // API VERSION: Updated from 2.4.0 to 2.5.0 - testing recommended
                system.run(() => {
                    try {
                        player.teleport(hub, {
                            dimension: world.getDimension("overworld"),
                            keepVelocity: false
                        });
                    } catch {}
                    try { player.sendMessage("§6[Aethelgrad] §rTeleported to the §eHub§r!"); } catch {}
                    try { player.runCommandAsync("playsound random.orb @s"); } catch {}
                });

                lastUse.set(name, now);

                return {
                    status: CustomCommandStatus.Success,
                    message: "Teleporting you to the Aethelgrad Hub..."
                };
            }
        );
        console.warn("[Aethelgrad Hub Command] /ae:hub registered (dynamic hub, cooldown, combat lock).");
    } catch (e) {
        console.error("[HubCommand] register failed:", e);
    }
}