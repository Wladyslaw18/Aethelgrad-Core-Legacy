# Aethelgrad Core Legacy - Command & Permission Guide

## Commands Reference

### Hub Management Commands

**`/ae:sethub`**
- **Description**: Set the hub center to your current location
- **Permission**: Admin level (AE, admin, Admin, AEh_manager)
- **Usage**: Stand at desired hub center and run command
- **Storage**: Saves to world dynamic properties `ae:hub_x`, `ae:hub_y`, `ae:hub_z`

**`/ae:setradius <radius>`**
- **Description**: Set protection radius for the hub
- **Permission**: Admin level (AE, admin, Admin, AEh_manager)
- **Usage**: BROKEN in API 2.4.0 - edit files instead
- **Storage**: Saves to world dynamic property `ae:hub_radius`
- **⚠️ CRITICAL**: Numeric arguments cause syntax errors in API 2.5.0

**`/ae:hubdebug`**
- **Description**: Check if you're in the hub protection zone
- **Permission**: Anyone can use
- **Usage**: Run command to see detailed zone information
- **Output**: Position, distances, zone status, bypass status

### NPC Management Commands

**`/ae:npctp`**
- **Description**: Set teleport NPC destination to your current location
- **Permission**: Admin level + AEN tag
- **Usage**: Stand at desired destination and run command
- **Storage**: Saves to world dynamic properties `ae:tp_npc_x`, `ae:tp_npc_y`, `ae:tp_npc_z`
- **Default**: Falls back to `19681.49, 71.00, -4748.79` if not set

### Item Control Commands

**`/ae:banitem`**
- **Description**: Ban the item in your hand from the hub
- **Permission**: Admin level (AE, admin, Admin, AEh_manager)
- **Usage**: Hold item and run command
- **Storage**: Saves to world dynamic property `ae:banned_items` as JSON array
- **Default Items**: Lava/water buckets, TNT, various bucket types

---

## Permission System

### Permission Hierarchy (Highest to Lowest)

**OWNER Level**
- Tags: `AE`, `aethelgrad:owner`
- Access: All commands and features
- Bypass: All restrictions

**ADMIN Level** 
- Tags: `admin`, `Admin`, `AEb_manager`
- Access: Hub management, item banning, broadcast control
- Bypass: Hub restrictions

**MODERATOR Level**
- Tags: `aethelgrad:moderator`
- Access: Limited admin features
- Bypass: Some restrictions

**HELPER Level**
- Tags: `aethelgrad:helper`
- Access: Basic helper features
- Bypass: Limited restrictions

**PLAYER Level**
- Tags: None (default)
- Access: Basic features only
- Bypass: No restrictions

---

## Required Tags by Feature

### Hub Management
- **Hub Center Setting**: `AE`, `admin`, `Admin`, `AEh_manager`
- **Hub Radius Setting**: `AE`, `admin`, `Admin`, `AEh_manager`
- **Hub Zone Bypass**: `AE`, `admin`, `Admin`, `AEh_manager`

### NPC Management
- **Teleport NPC Setting**: `AE`, `admin`, `Admin`, `AEN`
- **NPC Interaction**: Anyone can use NPCs

### Broadcast System
- **Broadcast Management**: `AE`, `admin`, `Admin`, `AEb_manager`

### Item Control
- **Item Banning**: `AE`, `admin`, `Admin`, `AEh_manager`
- **Item Enforcement**: Automatic for all players in hub

### Debug Tools
- **Hub Debug**: Anyone can use
- **Effect Logging**: Automatic console output

---

## Dynamic Properties Storage

### Hub Configuration
- `ae:hub_x` - Hub center X coordinate
- `ae:hub_y` - Hub center Y coordinate  
- `ae:hub_z` - Hub center Z coordinate
- `ae:hub_radius` - Hub protection radius

### Teleport NPC
- `ae:tp_npc_x` - Teleport destination X
- `ae:tp_npc_y` - Teleport destination Y
- `ae:tp_npc_z` - Teleport destination Z

### Item Management
- `ae:banned_items` - JSON array of banned item IDs

---

## Important Notes

### Command Registration
- All commands register on server startup
- Commands use Bedrock's custom command registry
- Some commands may fail if registry is full

### Permission Checking
- Uses tag-based system (not permission levels)
- Multiple tags can grant same access level
- Case-sensitive tag matching

### API 2.4.0 Critical Limitations
- **Command argument parsing is completely broken**
- Any command with numbers (like `/ae:setradius 50`) causes syntax errors
- Only commands without arguments work reliably
- Must edit configuration files directly for numeric values

### Default Values
- Hub center: `9027, 100, 8978` (if not set)
- Hub radius: `260` blocks (if not set)
- Teleport destination: `19681.49, 71.00, -4748.79` (if not set)
- Banned items: Predefined list of dangerous items

### Error Handling
- Commands include validation and error messages
- Graceful fallbacks for missing configurations
- Console logging for debugging issues

---

## Configuration Tips

### Setting Up Hub
1. Stand at desired hub center
2. Run `/ae:sethub` to save location (works - no arguments)
3. Edit `scripts/features/hub/hubRules.js` to change radius (command broken)
4. Use `/ae:hubdebug` to verify zone

⚠️ **API 2.4.0 LIMITATION**: Commands with arguments fail with syntax errors.

### Configuring Teleport NPC
1. Stand at desired destination
2. Run `/ae:npctp` to save location
3. Test by interacting with teleport NPC
4. Verify coordinates in dialog

### Managing Banned Items
1. Hold item to ban in hub
2. Run `/ae:banitem` to add to list
3. Items are automatically removed from inventories
4. List persists across server restarts

---

## Troubleshooting

### Commands Not Working
- Check player has required tags
- Verify command registration in console
- Ensure world is fully loaded
- **If using arguments**: API 2.4.0 argument parsing is broken - edit files instead

### Hub Protection Issues
- Use `/ae:hubdebug` to check zone status
- Verify hub center and radius are set
- Check console for effect application logs

### Permission Problems
- Verify exact tag spelling (case-sensitive)
- Check for multiple conflicting tags
- Use permission helper functions in custom code
