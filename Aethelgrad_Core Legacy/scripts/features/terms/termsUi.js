// Simple rules/terms UI.
// This is informational only and not legally binding.
// Content and behavior are server-specific.
import { world } from "@minecraft/server";

/// Helper → get current date as YYYY-MM-DD
function todayDate() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/// Convert date string → total days number
function dateToDays(str) {
    const [y, m, d] = str.split("-").map(n => parseInt(n));
    return Math.floor(new Date(y, m - 1, d).getTime() / (1000 * 60 * 60 * 24));
}

/// Disclaimer message text
function showDisclaimer(player) {
    player.sendMessage("§6==============================");
    player.sendMessage("§eBy playing on Æthelgrad, you agree to our Terms of Service & rules.");
    player.sendMessage("§cYou must be at least 13 years old, or have parent/guardian approval.");
    player.sendMessage("§6Æthelgrad staff are not responsible for personal info you share.");
    player.sendMessage("§4Inappropriate builds result in a permanent ban.");
    player.sendMessage("§aPlay fair, respect others, and enjoy your time on Æthelgrad!");
    player.sendMessage("§6==============================");
}

export function init() {
    /// Show disclaimer on first join + after 6 months
    world.afterEvents.playerSpawn.subscribe(ev => {
        if (!ev.initialSpawn) return;
        const player = ev.player;

        const today = todayDate();
        let lastDisclaimer = player.getDynamicProperty("lastDisclaimer");

        if (!lastDisclaimer) {
            // First join → show disclaimer
            showDisclaimer(player);
            player.setDynamicProperty("lastDisclaimer", today);
        } else {
            const lastDays = dateToDays(lastDisclaimer);
            const nowDays = dateToDays(today);

            // Show again if 180+ days (6 months) since last shown
            if (nowDays - lastDays >= 180) {
                showDisclaimer(player);
            }

            // Always update timestamp
            player.setDynamicProperty("lastDisclaimer", today);
        }
    });
}