  /**
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

// Broadcast Service
// Manages periodic message broadcasting

import {
    world,
    system,
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
} from "@minecraft/server";

import { defaults } from "./broadcasts_data.js";
import { canManageBroadcasts } from "../utils/permissionHelper.js";

// ==============================
//        STATE
// ==============================
let pools = JSON.parse(JSON.stringify(defaults.pools || {}));
let intervalSeconds = defaults.interval || 120;
let tickCounter = 0;

// ==============================
//      PERMISSIONS
// ==============================
// DEPRECATED: Use permissionHelper.js instead
// This function kept for backward compatibility
function isBroadcastManager(player) {
    if (!player) return false;
    return (
        player.hasTag("AE") ||
        player.hasTag("admin") ||
        player.hasTag("Admin") ||
        player.hasTag("AEb_manager")
    );
}

// ==============================
// SAVE / LOAD (WORLD DYNAMIC)
// ==============================
function saveToDynamic() {
    try {
        world.setDynamicProperty("aethelgrad:broadcasts", JSON.stringify(pools));
        world.setDynamicProperty("aethelgrad:interval", intervalSeconds);
    } catch {}
}

function loadFromDynamic() {
    try {
        const savedPools = world.getDynamicProperty("aethelgrad:broadcasts");
        const savedInterval = world.getDynamicProperty("aethelgrad:interval");

        if (savedPools) {
            try { pools = JSON.parse(savedPools); } catch {}
        }
        if (savedInterval !== undefined) intervalSeconds = Number(savedInterval);
    } catch {}
}

// ==============================
//      BROADCAST CORE
// ==============================
function sendBroadcast(msg) {
    for (const p of world.getPlayers()) {
        try { p.sendMessage(msg); } catch {}
    }
}

function rollRarity() {
    // defaults.rarityWeights may be a map like { common: 100 }
    const weights = defaults.rarityWeights || { common: 100 };
    const entries = Object.entries(weights);
    let total = 0;
    for (const [, w] of entries) total += Number(w) || 0;
    const roll = Math.random() * (total || 100);
    let acc = 0;
    for (const [tier, weight] of entries) {
        acc += Number(weight) || 0;
        if (roll <= acc) return tier;
    }
    return entries.length ? entries[0][0] : "common";
}

function randomBroadcast() {
    const tier = rollRarity();
    const pool = pools && pools[tier];
    if (!pool || pool.length === 0) {
        // fallback to any common pool if present
        const common = pools && pools.common;
        if (!common || common.length === 0) return;
        sendBroadcast(common[Math.floor(Math.random() * common.length)]);
        return;
    }
    const msg = pool[Math.floor(Math.random() * pool.length)];
    sendBroadcast(msg);
}

// ==============================
//       COMMAND HANDLER
// ==============================
function handleBroadcastCommand(origin, args) {
    const player = origin?.sourceEntity;
    // LEGACY: Using new permission helper for consistency
    if (!canManageBroadcasts(player)) {
        return { status: CustomCommandStatus.Failure, message: "§cNo permission." };
    }

    const sub = (args?.subcommand ?? "").toString().toLowerCase();

    switch (sub) {
        case "random":
            randomBroadcast();
            break;

        case "reset":
            pools = JSON.parse(JSON.stringify(defaults.pools || {}));
            intervalSeconds = defaults.interval || 120;
            saveToDynamic();
            try { player.sendMessage("§eBroadcasts reset."); } catch {}
            break;

        case "help":
        default:
            try {
                player.sendMessage("§e/ae:bc <random|reset|help>");
            } catch {}
            break;
    }

    return { status: CustomCommandStatus.Success };
}

// ==============================
//            INIT
// ==============================
export function init() {
    loadFromDynamic();

    // register command with proper parameter types so args arrives
    system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
        try {
            customCommandRegistry.registerCommand(
                {
                    name: "ae:bc",
                    description: "Broadcast control",
                    permissionLevel: CommandPermissionLevel.Any,
                    parameters: [
                        {
                            name: "subcommand",
                            type: CustomCommandParamType.Enum,
                            values: ["random", "reset", "help"],
                            description: "Broadcast subcommand to execute"
                        }
                    ]
                },
                handleBroadcastCommand
            );
        } catch (e) {
            console.warn("[Broadcasts] command register failed:", e);
        }
    });

    // ticker: run once per second and count ticks properly
    system.runInterval(() => {
        tickCounter++;
        if (tickCounter >= (intervalSeconds * 20)) {
            tickCounter = 0;
            randomBroadcast();
        }
    }, 1);

    console.warn("[AethelgradBroadcasts] system online.");
}