/**
 * @file services/broadcasts.js
 * @description Broadcast system for server-wide announcements
 * @job Handles periodic announcements and server messages
 * 
 * Aethelgrad Core Legacy
 * Copyright (C) 2026 Aethelgrad Studio and WladyslawKW
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 */

import { world, system } from "@minecraft/server";

// Configuration
const BROADCAST_INTERVAL = 6000; // 5 minutes in ticks (20 ticks/sec * 300 sec)
const BROADCAST_MESSAGES = [
    "§eWelcome to Aethelgrad! Use /hub to return to spawn.",
    "§6Need help? Ask staff or check the rules with /rules.",
    "§bJoin our Discord community for updates and events!",
    "§aReport bugs and issues to help improve the server.",
    "§cFollow server rules and respect other players."
];

let broadcastIndex = 0;
let isInitialized = false;

/**
 * Initialize the broadcast system
 * @returns {void}
 */
export function init() {
    if (isInitialized) {
        console.warn("[broadcasts] Already initialized, skipping.");
        return;
    }

    try {
        // Start the broadcast loop
        startBroadcastLoop();
        isInitialized = true;
        console.warn("[broadcasts] Broadcast system initialized successfully.");
    } catch (error) {
        console.error("[broadcasts] Failed to initialize:", error);
        throw error;
    }
}

/**
 * Start the periodic broadcast loop
 * @returns {void}
 */
function startBroadcastLoop() {
    system.runInterval(() => {
        try {
            const message = BROADCAST_MESSAGES[broadcastIndex];
            if (message) {
                // Send message to all players
                for (const player of world.getAllPlayers()) {
                    player.sendMessage(`§7[§6Broadcast§7] ${message}`);
                }
                
                // Move to next message
                broadcastIndex = (broadcastIndex + 1) % BROADCAST_MESSAGES.length;
                console.warn(`[broadcasts] Sent broadcast: ${message}`);
            }
        } catch (error) {
            console.error("[broadcasts] Error during broadcast:", error);
        }
    }, BROADCAST_INTERVAL);
}

/**
 * Send an immediate broadcast to all players
 * @param {string} message - The message to broadcast
 * @returns {void}
 */
export function sendBroadcast(message) {
    try {
        for (const player of world.getAllPlayers()) {
            player.sendMessage(`§7[§6Broadcast§7] ${message}`);
        }
        console.warn(`[broadcasts] Immediate broadcast sent: ${message}`);
    } catch (error) {
        console.error("[broadcasts] Error sending immediate broadcast:", error);
    }
}

/**
 * Get current broadcast configuration
 * @returns {Object} Current configuration
 */
export function getConfig() {
    return {
        interval: BROADCAST_INTERVAL,
        messageCount: BROADCAST_MESSAGES.length,
        currentIndex: broadcastIndex,
        initialized: isInitialized
    };
}
