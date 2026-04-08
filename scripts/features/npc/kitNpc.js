import { ActionFormData } from "@minecraft/server-ui";
import { getKitReadyMs, setKitReadyMs, minsLeft, KIT_COOLDOWN_MS } from "../../core/cooldowns.js";
import { giveStarterKit } from "../kits/starterKit.js";
import { world, system } from "@minecraft/server";

/**
 * Initializes kit NPC system
 * @returns {void}
 */
export function init() {
    // Kit NPC is event-based, no initialization needed
    // This function exists for bootstrap architecture compatibility
    
    // Add Right Click event listener for NPC interactions
    world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
        if (ev.target.typeId === "aethelgrad:kit_npc") {
            system.run(() => handleKitNpc(ev.player));
        }
    });
}

export async function handleKitNpc(player) {
    const form = new ActionFormData()
        .title("§aStarter Kit")
        .body("Claim your Starter Iron Kit (Cooldown: 60 minutes).")
        .button("§lGet Kit");

    const res = await form.show(player);
    if (res.canceled) return;

    const now = Date.now();
    const ready = getKitReadyMs(player);
    if (ready && now < ready) {
        player.sendMessage(`§cYou can claim again in ~${minsLeft(ready - now)} minute(s).`);
        return;
    }

    giveStarterKit(player);
    setKitReadyMs(player, now + KIT_COOLDOWN_MS);
}