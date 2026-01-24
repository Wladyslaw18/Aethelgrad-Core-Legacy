// NPC-based starter/kit logic.
// Makes assumptions about items, balance, and progression.
// Not intended for use in survival/economy-focused servers without changes.
import { ItemStack } from "@minecraft/server";

export function giveStarterKit(p) {
    const inv = p.getComponent("minecraft:inventory")?.container;
    if (!inv) return;

    const items = [
        "minecraft:iron_sword", "minecraft:iron_pickaxe",
        "minecraft:iron_axe", "minecraft:iron_shovel",
        "minecraft:iron_hoe", "minecraft:iron_helmet",
        "minecraft:iron_chestplate", "minecraft:iron_leggings",
        "minecraft:iron_boots", "minecraft:cooked_beef", "minecraft:oak_planks"
    ];

    for (const id of items) {
        try {
            // VERIFIED: addItem is the stable standard
            const amount = (id.includes("beef") || id.includes("planks")) ? 64 : 1;
            inv.addItem(new ItemStack(id, amount));
        } catch (err) {
            console.error(`Failed to add ${id}: ${err.message}`);
        }
    }

    p.sendMessage("§aYou received the Starter Iron Kit!");
}