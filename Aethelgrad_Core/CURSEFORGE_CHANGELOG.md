# Aethelgrad Core Legacy - CurseForge Changelog

## Legacy Release - Version 1.0.0

**IMPORTANT: This is a LEGACY release from my private server. I've moved from Bedrock API 2.4.0 to PHP/PocketMine-MP, so I'm releasing this for public use.**

---

### Major Features Added

**Data-Driven Teleport System**
- `/ae:npctp` command - Set teleport NPC destination to your current location
- Dynamic location storage using world properties
- Fallback to default coordinates if not configured

**Enhanced Hub Protection**
- Fixed damage nullifier at extreme heights (flying/falling)
- Extended effect duration for better coverage
- Added height-based zone detection

**Permission System Overhaul**
- Centralized permission helper with standardized ranks
- Consistent tag checking across all systems
- Clear hierarchy: OWNER > ADMIN > MODERATOR > HELPER > PLAYER

**Debug Tools**
- `/ae:hubdebug` command - Check if you're in hub protection zone
- Real-time effect application logging
- Detailed zone boundary information

---

### Technical Improvements

**API Workarounds Documented**
- Module loading race conditions
- UI context preservation for NPC interactions
- Inventory timing issues on player spawn
- Command context preservation for teleports
- Height detection limitations
- Effect icon visibility constraints

**Enhanced Error Handling**
- Graceful failure recovery
- Detailed console logging
- Better user feedback messages

---

### Documentation Package

**Complete Public Release Kit**
- Comprehensive GitHub README
- Detailed workaround documentation
- Platform-specific CurseForge description
- Command reference guide
- Permission tag requirements

---

### Important Notices

**NOT Beginner-Friendly**
- Requires JavaScript knowledge
- Not plug-and-play
- Direct script editing needed

**Legacy Status**
- No future updates planned
- Unless Bedrock API improves significantly
- This will probably be dead by then or have better forks

**API Limitations**
- Effect icons cannot be hidden (API limitation)
- Position tracking unreliable at extreme heights
- Various API 2.4.0 stability issues

---

### Commands Available

**Hub Management**
- `/ae:sethub` - Set hub center to your location
- `/ae:setradius <number>` - Set hub protection radius
- `/ae:hubdebug` - Check hub zone status

**NPC Management**
- `/ae:npctp` - Set teleport NPC destination

**Item Control**
- `/ae:banitem` - Ban held item from hub

---

### Permission Tags Required

**Admin Level**
- `AE` - Server owner
- `admin` / `Admin` - Server administrators  
- `AEh_manager` - Hub managers
- `AEN` - Additional admin tag

**Special Tags**
- `AEb_manager` - Broadcast managers
- `aethelgrad:moderator` - Moderators
- `aethelgrad:helper` - Helpers

---

### Technical Specs

- **Engine**: Minecraft Bedrock API 2.4.0 Stable
- **Tested Version**: 1.21.130x
- **Architecture**: JavaScript modules
- **Storage**: World dynamic properties
- **Compatibility**: Legacy addon system

---

### Known Issues

- Effect icons remain visible (API limitation)
- Position tracking issues at extreme heights
- Some workarounds needed for API stability

---

### License

Licensed under Apache License 2.0. See LICENSE file for full terms.

## Links

- Discord: https://discord.gg/NRCnPVUp
- Legacy Status: Migrated from Bedrock API 2.4.0 to PHP/PocketMine-MP

---

*This was the core system that powered my Aethelgrad server before migrating to PocketMine-MP. Releasing for public use as-is.*
