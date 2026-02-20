# Aethelgrad Core Legacy - Architecture Documentation

## Overview
Aethelgrad Core Legacy is a modular Minecraft Bedrock Edition addon system built on the @minecraft/server API 2.5.0. It provides essential server functionality including hub protection, NPC interactions, item management, and utility services.

**Version**: 2.0.0  
**API Version**: 2.5.0  
**Minimum Engine Version**: 1.21.90  
**License**: Apache-2.0  

## Project Structure
```
Aethelgrad_Core/
├── manifest.json              # Addon manifest and dependencies
├── package.json               # Node.js dependencies
├── entities/                  # Entity definitions
│   ├── kitNpc.json           # Starter Kit NPC entity
│   └── teleportNpc.json      # Teleporter NPC entity
├── scripts/                   # JavaScript modules
│   ├── main.js               # Entry point and initialization
│   ├── bootstrap/            # Core module initialization
│   │   ├── core.js          # Core systems bootstrap
│   │   ├── features.js       # Gameplay features bootstrap
│   │   └── services.js       # Background services bootstrap
│   ├── commands/             # Command system (NEW)
│   │   ├── index.js          # Centralized command registry
│   │   ├── base/             # Base command classes
│   │   │   ├── BaseCommand.js
│   │   │   └── CommandRegistry.js
│   │   ├── hub/              # Hub management commands
│   │   │   ├── sethub.js
│   │   │   ├── setradius.js
│   │   │   ├── hubdebug.js
│   │   │   └── banitem.js
│   │   ├── npc/              # NPC interaction commands
│   │   │   └── setTeleport.js
│   │   ├── system/            # System administration commands
│   │   │   ├── broadcast.js
│   │   │   └── cleaner.js
│   │   └── test/             # Development and testing commands
│   │       ├── testNumber.js
│   │       └── testString.js
│   ├── core/                 # Core utilities
│   │   ├── combatState.js    # Combat tracking system
│   │   └── cooldowns.js      # Cooldown management
│   ├── features/             # Feature modules
│   │   ├── compass/          # Compass functionality
│   │   ├── eastereggs/       # Easter egg system
│   │   ├── hub/              # Hub protection system
│   │   │   └── hubRules.js
│   │   ├── kits/             # Kit system
│   │   │   └── starterKit.js
│   │   ├── npc/              # NPC interactions
│   │   │   ├── kitNpc.js
│   │   │   ├── teleportNpc.js
│   │   │   └── npcProtection.js
│   │   └── terms/            # Terms UI system
│   │       └── termsUi.js
│   ├── services/             # Background services
│   │   ├── broadcasts.js     # Message broadcasting
│   │   ├── broadcasts_data.js # Broadcast message data
│   │   ├── cleaner.js        # Item cleanup service
│   │   └── naturalRegen.js   # Natural regeneration
│   ├── ui/                   # User interface utilities
│   │   ├── common.js         # Common UI functions
│   │   └── forms.js          # Modal form utilities
│   ├── utils/                # Utility modules
│   │   ├── permissionHelper.js # Permission management
│   │   └── performanceOptimizations.js # Performance utilities
│   └── documentation/             # Documentation files
│       └── ARCHITECTURE.md  # This file
└── resources/                 # Addon resources
    └── textures/              # Custom textures
```

## Core Architecture

### Entry Point (`scripts/main.js`)
The main entry point orchestrates system initialization in correct order:
1. **Test Commands**: Registers API 2.5.0 test commands for validation
2. **Module Bootstrap**: Sequentially initializes core, features, and service modules
3. **Error Handling**: Robust error catching for initialization failures
4. **Command System**: Registers all commands through centralized registry

### Bootstrap System
**Purpose**: Initialize core modules with robust error handling and race condition protection

#### Core Bootstrap (`scripts/bootstrap/core.js`)
- **Purpose**: Initializes core system utilities and global configurations
- **Strategy**: No file loading - only sets up core infrastructure
- **Components**: Performance optimizations, core utilities, global event listeners
- **Dependencies**: None (utility modules imported on-demand)

#### Features Bootstrap (`scripts/bootstrap/features.js`)
- **Purpose**: Initializes all gameplay feature modules from features/ directory
- **Strategy**: Try-catch wrapper for each feature to prevent cascading failures
- **Components**: Hub protection, NPC protection, starter kit, compass, terms, easter eggs
- **Dependencies**: All feature modules with proper error handling

#### Services Bootstrap (`scripts/bootstrap/services.js`)
- **Purpose**: Initializes all background service modules from services/ directory
- **Strategy**: Individual service initialization with error isolation
- **Components**: Broadcasts, ground item cleaner, natural regeneration
- **Dependencies**: All service modules with failure recovery

## Command System (NEW)

### Centralized Registry (`scripts/commands/index.js`)
**Purpose**: Professional command registration with clean separation of concerns
- **Architecture**: Framework-quality design for scalability and maintainability
- **Features**:
- **Auto-discovery**: Commands automatically loaded from folder structure
- **Validation**: Command registration with comprehensive error checking
- **Logging**: Detailed registration summary and execution tracking
- **Single Source of Truth**: One registry instance for entire addon

### Command Categories
- **Hub Commands** (`commands/hub/`): Hub management and configuration
- **NPC Commands** (`commands/npc/`): NPC interaction and teleportation
- **System Commands** (`commands/system/`): Server administration and maintenance
- **Test Commands** (`commands/test/`): Development and validation commands

### Base Command Classes (`scripts/commands/base/`)
- **BaseCommand.js**: Abstract base class with common command patterns
- **CommandRegistry.js**: Registry management and validation utilities

## Core Systems

### 1. Permission System (`scripts/utils/permissionHelper.js`)
**Architecture**: Tag-based permission hierarchy for role-based access control

**Permission Levels**:
- `OWNER`: ["AE", "aethelgrad:owner"]
- `ADMIN`: ["admin", "Admin", "AE"]
- `MODERATOR`: ["aethelgrad:moderator"]
- `HELPER`: ["aethelgrad:helper"]
- `BROADCAST_MANAGER`: ["AE", "admin", "Admin", "AEb_manager"]
- `HUB_MANAGER`: ["AE", "admin", "Admin", "AEh_manager"]

**Key Functions**:
- `hasPermission(player, level)`: Check specific permission
- `getPlayerRank(player)`: Get highest permission level
- `canBypassHub(player)`: Hub bypass check
- `canManageBroadcasts(player)`: Broadcast management check

**Limitations**:
- Tag-based system requires manual tag management
- No fine-grained permissions
- No permission inheritance beyond hierarchy

### 2. Hub Protection System (`scripts/features/hub/hubRules.js`)
**Purpose**: Zone-based protection system with configurable parameters

**Protection Features**:
- **Zone-based Protection**: Configurable radius and center
- **Inventory Enforcement**: Automatic removal of banned items
- **Effect Management**: Resistance, weakness, regeneration effects
- **Block Protection**: Prevents breaking and interacting
- **Damage Nullification**: Prevents all damage in hub zone
- **Mob Purging**: Removes hostile mobs automatically
- **Explosion Protection**: Cancels explosions in hub area

**Configuration**:
- **Dynamic Properties**: `ae:hub_x`, `ae:hub_y`, `ae:hub_z`, `ae:hub_radius`, `ae:banned_items`
- **Default Center**: {x: 9027, y: 100, z: 8978}
- **Default Radius**: 260 blocks
- **Default Banned Items**: Buckets, TNT, and various mob buckets

**Commands**:
- `/ae:sethub`: Set hub center to current location
- `/ae:setradius <radius>`: Set protection radius
- `/ae:banitem`: Ban held item from hub
- `/ae:hubdebug`: Check hub zone status

**Limitations**:
- Height detection issues above Y=200 (workaround implemented)
- Effect icons cannot be completely hidden
- Performance impact with many players in hub

### 3. NPC System (`scripts/features/npc/`)
**Purpose**: Interactive NPC system with protection and teleportation

#### Kit NPC (`scripts/features/npc/kitNpc.js`)
- **Functionality**: Distributes starter kits with cooldown enforcement
- **Cooldown**: 60 minutes between claims
- **UI**: ActionFormData for interaction
- **Dependencies**: cooldowns.js, starterKit.js

#### Teleport NPC (`scripts/features/npc/teleportNpc.js`)
- **Functionality**: Teleports players to configured destination
- **Configuration**: Dynamic properties for destination
- **Safety**: Confirmation dialog before teleport
- **Dependencies**: teleportNpc.js

#### NPC Protection (`scripts/features/npc/npcProtection.js`)
- **Features**: Prevents damage to NPCs with sensor components
- **Implementation**: Damage sensor components in entity definitions
- **Dependencies**: None

**Entity Definitions** (`entities/`):
- `kitNpc.json`: Starter kit NPC with interaction components
- `teleportNpc.json`: Teleporter NPC with interaction components

**Limitations**:
- UI context preservation required for reliable interactions
- No persistent NPC state beyond dynamic properties
- Limited to predefined interaction types

### 4. Cooldown System (`scripts/core/cooldowns.js`)
**Purpose**: Tag-based cooldown management for kit system

**Architecture**: Player tags for cooldown storage
**Functions**:
- `getKitReadyMs(player)`: Get cooldown expiry time
- `setKitReadyMs(player, ms)`: Set cooldown expiry
- `minsLeft(msRemaining)`: Calculate remaining minutes

**Constants**:
- `KIT_COOLDOWN_MS`: 60 minutes in milliseconds
- `KIT_TAG_PREFIX`: "aeg:kitReadyMs:"

**Limitations**:
- Tag-based storage limited by Minecraft tag system
- No persistent storage across server restarts
- Limited to one cooldown type per implementation

### 5. Combat State System (`scripts/core/combatState.js`)
**Purpose**: Track player damage timing for combat-related features

**Functions**:
- `markDamaged(player)`: Record damage timestamp
- `ticksSinceDamage(player)`: Calculate time since last damage

**Storage**: In-memory Map using player IDs as keys

**Usage**: Hub commands, Kit NPCs, combat-aware features

**Limitations**:
- Non-persistent state (resets on restart)
- Memory usage grows with player count
- No automatic cleanup of offline players

## Service Systems

### 1. Broadcast Service (`scripts/services/broadcasts.js`)
**Purpose**: Weighted random message broadcasting system

**Features**:
- **Rarity System**: Weighted message pools (common, rare, etc.)
- **Dynamic Configuration**: Adjustable intervals and message pools
- **Persistence**: World dynamic properties for storage
- **Commands**: `/ae:bc <random|reset|help>`

**Configuration**:
- `intervalSeconds`: Broadcast interval (default: 120 seconds)
- `pools`: Message pools by rarity
- `rarityWeights`: Selection weights for each rarity

**Limitations**:
- Limited to text messages only
- No scheduling or timed broadcasts
- Message editing requires restart or command

### 2. Cleaner Service (`scripts/services/cleaner.js`)
**Purpose**: Automatic ground item cleanup to reduce lag

**Features**:
- **Timed Cleanup**: 20-minute intervals with announcements
- **Multi-dimension Support**: Overworld, Nether, End
- **Retry Logic**: Follow-up attempts for stubborn items
- **Manual Trigger**: `/ae:cleaner` command for admins

**Configuration**:
- `CLEAN_INTERVAL`: 20 minutes
- `ANNOUNCE_INTERVAL`: 5 minutes
- `COUNTDOWN_SECONDS`: 10 seconds warning
- `ADMIN_TAGS`: ["AE", "AEC", "admin", "Admin"]

**Limitations**:
- Cannot remove items in unloaded chunks
- May interfere with legitimate item storage systems
- No whitelist/blacklist for specific items

### 3. Natural Regeneration Service (`scripts/services/naturalRegen.js`)
**Purpose**: Natural health and hunger regeneration system

**Features**:
- **Regeneration**: Health and hunger restoration over time
- **Combat Integration**: Prevents regeneration during combat
- **Configuration**: Adjustable regeneration rates

**Limitations**:
- Configuration not documented in current implementation
- May conflict with other regeneration systems
- Performance impact with many players

## Data Synchronization

### Command ↔ Feature Communication
Commands and feature systems synchronize through shared data sources:

**Dynamic Properties**: Global state storage
- Commands write: `world.setDynamicProperty("ae:hub_radius", radius)`
- Features read: `const radius = world.getDynamicProperty("ae:hub_radius")`

**Player Data**: Tags and components
- Commands set: `player.addTag("combat_123456789")`
- Features check: `player.getTags().find(tag => tag.startsWith("combat_"))`

**World Events**: Real-time state updates
- Commands trigger: Hub location changes
- Features react: Protection system updates immediately

## API Compliance

### Minecraft Bedrock Edition API 2.5.0
- **Module**: `@minecraft/server`
- **Key Classes**: `world`, `system`, `Player`, `Entity`
- **Key Enums**: `CommandPermissionLevel`, `CustomCommandStatus`, `CustomCommandParamType`
- **Events**: `beforeEvents`, `afterEvents`
- **Dynamic Properties**: Persistent world storage
- **Components**: Entity and block component systems

## Development Guidelines

### Adding New Commands
1. Create command class extending `BaseCommand`
2. Add to appropriate category folder (hub/, npc/, system/, test/)
3. Import in `commands/index.js`
4. Command auto-registers on next server restart

### Adding New Features
1. Create feature module in appropriate category folder
2. Add initialization call to relevant bootstrap
3. Follow existing patterns for error handling
4. Document with JSDoc comments

### Code Standards
- **JSDoc Documentation**: All files include comprehensive documentation
- **Error Handling**: Try-catch wrappers for robustness
- **API Compliance**: Use proper enums and methods
- **Performance**: Consider impact of frequent operations
- **Modularity**: Clear separation of concerns

## Limitations

### Current System Constraints
- **Tag-based Systems**: Limited by Minecraft tag storage capacity
- **Dynamic Properties**: Limited to world-scoped storage
- **Performance**: Hub protection may impact server performance with many players
- **UI Context**: Bedrock requires special handling for entity interactions
- **Memory Usage**: In-memory storage grows with player count

### Future Improvements
- **Database Integration**: Replace dynamic properties with persistent storage
- **Permission Refinement**: More granular permission system
- **Performance Optimization**: Chunk-based hub protection
- **Command Framework**: Subcommand support and validation
- **Configuration System**: In-game configuration interface

---

*Last Updated: Version 2.0.0*
