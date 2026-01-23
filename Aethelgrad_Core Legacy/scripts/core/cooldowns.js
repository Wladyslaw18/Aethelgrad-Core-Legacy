const KIT_COOLDOWN_MS = 60 * 60 * 1000;
const KIT_TAG_PREFIX = "aeg:kitReadyMs:";

export function getKitReadyMs(player) {
    const tag = player.getTags().find(t => t.startsWith(KIT_TAG_PREFIX));
    return tag ? Number(tag.substring(KIT_TAG_PREFIX.length)) || 0 : 0;
}

export function setKitReadyMs(player, ms) {
    for (const t of player.getTags()) if (t.startsWith(KIT_TAG_PREFIX)) player.removeTag(t);
    player.addTag(KIT_TAG_PREFIX + String(ms));
}

export function minsLeft(msRemaining) {
    return Math.max(1, Math.ceil(msRemaining / 60000));
}

export { KIT_COOLDOWN_MS };