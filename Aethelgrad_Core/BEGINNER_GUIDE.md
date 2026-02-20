# Aethelgrad Core Legacy - Beginner's Guide

## 🎯 What This Addon Does

Aethelgrad Core Legacy protects your server hub area and provides useful NPC services. It's designed to be **safe and reliable** for Minecraft Bedrock Edition 1.21.130x.

## 🚀 Quick Start (3 Steps)

### Step 1: Install the Addon
1. Download the addon files
2. Copy to your server's behavior_packs folder
3. Enable in server settings

### Step 2: Set Up Hub Center
1. Go to where you want your hub center
2. Run command: `/ae:sethub` 
3. Set protection radius: `/ae:setradius 260` 

⚠️ **IMPORTANT**: In API 2.4.0, numeric command arguments are broken. Commands like `/ae:setradius 50` will cause syntax errors. Use the default values or edit the configuration files directly.

### Step 3: Configure Teleport NPC
1. Go to where you want players to teleport
2. Run command: `/ae:sethub`
3. Run command: `/ae:npctp`

That's it! Your hub is now protected and ready.

## 🛡️ What the Hub Protection Does

### Automatic Protection
- **Damage Immunity** - Players can't take damage in hub
- **No Block Breaking** - Protected from griefing
- **No Bad Items** - Removes TNT, lava buckets, etc.
- **No Hostile Mobs** - Automatically removes monsters
- **No Explosions** - Prevents explosion damage

### Effects Players Get
- **Resistance 255** - Immune to all damage
- **Regeneration 255** - Instant health regeneration
- **Weakness 255** - Can't attack others (balance)

## 🤖 NPC Services

### Kit NPC
- Gives starter kits to new players
- 1-hour cooldown between uses
- Configurable kit contents

### Teleport NPC
- Teleports players to spawn/other areas
- Destination set with `/ae:npctp` command
- Confirmation dialog before teleport

## 🎮 Commands You Can Use

### Hub Management
```
/ae:sethub          - Set hub center to your location
/ae:setradius 200   - SET RADIUS BY EDITING FILES (command broken in 2.4.0)
/ae:hubdebug        - Check if you're in hub zone
```

⚠️ **CRITICAL**: API 2.4.0 has broken command argument parsing. Any command with numbers (like `/ae:setradius 200`) will fail with syntax errors. You must edit configuration files directly instead.

### NPC Management
```
/ae:npctp           - Set teleport NPC destination
```

### Item Control
```
/ae:banitem         - Ban item you're holding from hub
```

## 🏷️ Permission System

### Admin Tags (Full Access)
- `AE` - Server owner
- `admin` or `Admin` - Server administrators
- `AEh_manager` - Hub managers
- `AEN` - Additional admin tag

### What Each Level Can Do
- **Owner (AE)**: Everything
- **Admin**: Hub management, item banning, NPC control
- **Players**: Basic hub use, NPCs

## 🔧 How to Customize

### Change Hub Location
1. Go to new hub center
2. Run `/ae:sethub`
3. Done! Location is saved automatically

### Change Hub Size
```
# BROKEN IN API 2.4.0 - /ae:setradius 300 will cause syntax error
# Instead, edit scripts/features/hub/hubRules.js and change:
const DEFAULT_HUB_RADIUS = 260;  # Change this number
```

### Ban Items from Hub
1. Hold the item you want to ban
2. Run `/ae:banitem` (this works - no arguments needed)
3. Item is automatically removed from inventories

Note: Only commands WITHOUT arguments work reliably in API 2.4.0.

### Set Teleport Destination
1. Go to where players should teleport
2. Run `/ae:npctp`
3. Teleport NPC now goes there

## 🐛 Troubleshooting

### "Effects aren't working"
- Run `/ae:hubdebug` to check if you're in hub zone
- Make sure you have the right admin tags

### "Can't break blocks in hub"
- This is normal! Hub is protected from griefing
- Admins with bypass tags can still build

### "NPCs don't work"
- Check if you have the right permission tags
- Make sure you're not too far from the NPC

### "Commands say 'permission denied'"
- Check if you have the required tags (`AE`, `admin`, etc.)
- Tags are case-sensitive
- If using argument commands, they're broken in API 2.4.0 - edit files instead

## 📁 Important Files

### Main Configuration
- `scripts/features/hub/hubRules.js` - Hub protection settings
- `scripts/utils/permissionHelper.js` - Permission system

### NPC Files
- `scripts/features/npc/kitNpc.js` - Kit NPC behavior
- `scripts/features/npc/teleportNpc.js` - Teleport NPC behavior

### Documentation
- `COMMANDS_HELP.md` - Complete command reference
- `WORKAROUNDS.md` - Technical explanations

## ⚠️ Important Notes

### This is a Legacy Release
- No future updates planned
- Designed for older Minecraft versions
- Works great but won't be improved
- **API 2.4.0 has broken command argument parsing**

### Not Plug-and-Play
- Requires some setup (commands above)
- Need to understand basic Minecraft commands
- Designed for server owners, not casual players

### API Limitations
- Some features have workarounds for Bedrock bugs
- Effect icons can't be hidden (Minecraft limitation)
- Position tracking can be imperfect at heights
- **Command argument parser is completely broken** - use file editing

## 🎯 Best Practices

### For Server Owners
1. Set hub center in a safe, flat area
2. Use reasonable radius (200-300 blocks)
3. Test all features before opening to players
4. Keep backup of configuration

### For Players
1. Use NPCs for kits and teleports
2. Report any issues to server admin
3. Understand hub is protected area
4. Enjoy the safe environment!

## 🆘 Need Help?

### Check These First
1. Run `/ae:hubdebug` to check your zone status
2. Verify you have correct permission tags
3. Check console for error messages
4. Read the command help above

### Common Issues
- **"Not in hub zone"** - Move closer to hub center
- **"Permission denied"** - Check your tags
- **"Command not found"** - Make sure addon is loaded

---

**Remember**: This is legacy software. It works well but won't receive updates. Perfect for stable servers that don't need new features.
