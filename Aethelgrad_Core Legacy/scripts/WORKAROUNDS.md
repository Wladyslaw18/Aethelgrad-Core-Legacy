# Aethelgrad Core Legacy - Workaround Documentation

This document explains every workaround in the codebase and why they are necessary.

## Table of Contents
- [Module Loading Workarounds](#module-loading-workarounds)
- [UI Context Workarounds](#ui-context-workarounds)
- [Inventory Timing Workarounds](#inventory-timing-workarounds)
- [Command Context Workarounds](#command-context-workarounds)
- [Entity Protection Workarounds](#entity-protection-workarounds)
- [Error Handling Workarounds](#error-handling-workarounds)

---

## Module Loading Workarounds

### Location: `scripts/bootstrap/services.js`
```javascript
// WORKAROUND: Bedrock Module Loading Race Condition
// PROBLEM: Modules sometimes fail to initialize silently on world load
// WHY NEEDED: API 2.4.0 doesn't guarantee module load order or success
// DO NOT REMOVE: Without try-catch, entire addon may fail silently
// API VERSION: 2.4.0 Stable - inconsistent behavior across game versions
```

**Explanation:** The Bedrock addon API doesn't guarantee that modules will load in a predictable order or even successfully. Without individual try-catch blocks, one failed module could crash the entire initialization sequence silently.

**Symptoms if removed:** Random addon failures on world load with no error messages.

**Tested versions:** Broken in 1.21.90+, still broken in 1.21.130

---

## UI Context Workarounds

### Location: `scripts/bootstrap/npc.js`
```javascript
// WORKAROUND: Bedrock UI Context Bug
// PROBLEM: Entity interactions lose async context when calling UI functions directly
// WHY NEEDED: @minecraft/server-ui requires preserved async context for modal forms
// DO NOT REMOVE: Will cause "UI not available" errors on entity interactions
// API VERSION: 2.4.0 Stable - confirmed broken in 1.21.90+
```

**Explanation:** When a player interacts with an entity, the async context needed for modal forms (UI) is lost. Wrapping the interaction handler in `system.run()` preserves this context.

**Symptoms if removed:** Modal forms won't open when clicking NPCs, error "UI not available in current context".

**Tested versions:** Broken in 1.21.90+, still broken in 1.21.130

---

## Inventory Timing Workarounds

### Location: `scripts/features/compass/compass.js`
```javascript
// WORKAROUND: Bedrock Inventory Loading Race Condition
// PROBLEM: Player inventory not fully available on initial spawn event
// WHY NEEDED: Component system loads inventory asynchronously after spawn
// DO NOT REMOVE: Compass will fail to appear on first join
// API VERSION: 2.4.0 Stable - inventory timing inconsistent
```

**Explanation:** The `playerSpawn` event fires before the inventory component is fully loaded. The 20-tick delay ensures the inventory is accessible.

**Symptoms if removed:** New players won't receive the compass on first join.

**Tested versions:** Broken in 1.21.40+, still broken in 1.21.130

---

## Command Context Workarounds

### Location: `scripts/features/hub/hubCommand.js`
```javascript
// WORKAROUND: Bedrock Command Context Preservation
// PROBLEM: Teleport after command execution can fail due to context loss
// WHY NEEDED: system.run preserves execution context for teleport
// DO NOT REMOVE: Hub teleport will fail intermittently
// API VERSION: 2.4.0 Stable - command/teleport timing issues
```

**Explanation:** Command handlers execute in a context that doesn't always support immediate teleportation. `system.run()` ensures the teleport happens in a stable context.

**Symptoms if removed:** `/ae:hub` command will fail intermittently with no error message.

**Tested versions:** Broken in 1.21.90+, still broken in 1.21.130

---

## Entity Protection Workarounds

### Location: `scripts/features/npc/npcProtection.js`
```javascript
// NPC protection logic.
// Bedrock does not provide reliable native NPC protection.
// This is a defensive workaround and may block other addons.
```

**Explanation:** Minecraft Bedrock doesn't have built-in NPC protection like Java Edition. This workaround manually blocks damage to NPCs but may interfere with other addons that also modify entity damage.

**Symptoms if removed:** NPCs can be killed by players.

**Known conflicts:** May conflict with other damage-modifying addons.

---

## Error Handling Workarounds

### Multiple Locations: Various `try {} catch {}` blocks

**Explanation:** Many API calls can fail silently or throw unexpected errors due to API inconsistencies. The try-catch blocks prevent these from crashing entire systems.

**Common patterns:**
```javascript
try { player.sendMessage(msg); } catch {}
try { player.runCommandAsync("command"); } catch {}
try { entity.kill(); } catch {}
```

**Symptoms if removed:** Random crashes when API calls fail unexpectedly.

---

## General Principles

1. **Never remove a workaround without testing** - Workarounds exist because the API is broken
2. **API version matters** - Most workarounds are specific to 2.4.0 Stable
3. **Test across Minecraft versions** - Behavior changes between minor versions
4. **Document new workarounds** - If you discover new issues, add them here

## Testing Checklist

When modifying workarounds:
- [ ] Test on fresh world load
- [ ] Test after world reload
- [ ] Test with multiple players
- [ ] Test on different Minecraft versions
- [ ] Check console for errors

## Future Compatibility

These workarounds may become obsolete when:
- Mojang fixes the underlying API issues
- API 2.5.0 Beta becomes stable and reliable
- New APIs provide better alternatives

Until then, these workarounds are necessary for stable operation.
