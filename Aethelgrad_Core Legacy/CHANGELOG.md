# Aethelgrad Core Legacy - Changelog

## Version 1.0.0 - Legacy Release

### 🆕 New Features
- **Data-driven Teleport NPC** - Added `/ae:npctp` command to set teleport destination dynamically
- **Permission Helper System** - Centralized permission checking with standardized rank hierarchy
- **Debug Commands** - Added `/ae:hubdebug` for troubleshooting hub protection zones
- **Comprehensive Documentation** - Added workaround documentation and public release guides

### 🔧 Improvements
- **Hub Protection Enhanced** - Fixed damage nullifier at extreme heights
- **Effect Duration Increased** - Extended hub protection effects from 80 to 100 ticks
- **Better Error Handling** - Added detailed logging for effect application
- **Standardized Naming** - Consistent rank hierarchy and permission tags

### 🐛 Bug Fixes
- **Damage Nullifier Height Issue** - Protection now works at all altitudes within hub zone
- **Teleport Context Preservation** - Fixed NPC teleport reliability with proper context handling
- **Effect Application Logging** - Added debug output to track effect application issues

### 📚 Documentation
- **Workaround Documentation** - Detailed explanations for all Bedrock API workarounds
- **GitHub README** - Complete public release documentation
- **CurseForge Description** - Platform-specific release description
- **Important Notices** - Clear warnings about legacy status and requirements

### ⚠️ Important Notes
- **Legacy Release** - No future updates planned unless Bedrock API improves
- **Not Plug-and-Play** - Requires JavaScript knowledge for configuration
- **API Limitations** - Effect icons cannot be hidden due to Bedrock API constraints
- **Developer-Focused** - Designed for technical users comfortable with code editing

---

## Technical Changes

### Core Systems
- Added `permissionHelper.js` for centralized permission management
- Enhanced `hubRules.js` with height-based protection checks
- Updated `teleportNpc.js` with dynamic location storage
- Improved error handling throughout the codebase

### API Workarounds Documented
- Module loading race conditions
- UI context preservation for entity interactions
- Inventory timing issues on player spawn
- Command context preservation for teleports
- Height detection limitations in position tracking
- Effect icon visibility constraints

### Commands Added
- `/ae:npctp` - Set teleport NPC destination
- `/ae:hubdebug` - Check hub protection zone status
- Existing commands: `/ae:sethub`, `/ae:setradius`, `/ae:banitem`

---

## Known Issues
- Effect icons remain visible (Bedrock API limitation)
- Position tracking may be unreliable at extreme heights
- Some workarounds required due to API 2.4.0 instability

## Compatibility
- **Minecraft Bedrock Edition** - API 2.4.0 Stable
- **Tested Versions** - 1.21.130x
- **Legacy Status** - No updates planned for future API versions
