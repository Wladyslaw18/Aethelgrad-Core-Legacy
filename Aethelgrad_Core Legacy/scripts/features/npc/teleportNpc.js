// NPC-triggered teleport logic.
// No permissions, cooldowns, or safety validation, Hardcoded.
// Modify if your server requires stricter control.

import { world } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";

export async function handleTeleportNpc(player) {
    const confirm = new MessageFormData()
        .title("§cLifesteal Teleporter")
        .body("§7Teleport to the Aethelgrad spawn?\n§8(X:19704, Y:70, Z:-4781)")
        .button1("§aYes")
        .button2("§cNo");

    const res = await confirm.show(player);
    if (res.selection !== 0) return;

    const dim = world.getDimension("overworld");
    player.teleport({ x: 19704.81, y: 70, z: -4781.52 }, { dimension: dim, keepVelocity: false });
    player.runCommand("gamemode survival @s");
    player.sendMessage("§bTeleported to Aethelgrad Spawn!");
}