# Aethelgrad Core Legacy

**Legacy Release - Apache 2.0 Licensed**

Aethelgrad Core Legacy is the original Bedrock Edition addon that powered the Aethelgrad server before migration to PocketMine-MP. This is a legacy release provided as-is for public use.

## ⚠️ Important Notice

**Not beginner-friendly** - This is not a plug-and-play plugin. Requires JavaScript knowledge and direct file editing.

**No updates planned** - This is a legacy release. Future updates depend on Bedrock API improvements.

## Quick Start

1. Install the addon to your Bedrock server
2. Configure by editing JavaScript files directly
3. Set up hub center with `/ae:sethub`
4. Configure teleport NPC with `/ae:npctp`

## Features

- **Hub Protection System** - Configurable safe zones with damage nullification
- **Data-Driven NPCs** - Kit and teleport systems with dynamic locations
- **Permission Management** - Tag-based rank system
- **Item Control** - Ban items from hub areas
- **Broadcast System** - Automated server messages
- **Debug Tools** - `/ae:hubdebug` for troubleshooting

## Technical Details

- **Engine**: Minecraft Bedrock API 2.4.0 Stable
- **Tested Version**: 1.21.130x
- **License**: Apache 2.0
- **Architecture**: JavaScript modules

## Known Issues & Workarounds

This addon contains numerous workarounds for Bedrock API limitations. See [WORKAROUNDS.md](scripts/WORKAROUNDS.md) for detailed explanations.

## Documentation

- [Commands & Permissions](COMMANDS_HELP.md) - Complete command reference
- [Workarounds](scripts/WORKAROUNDS.md) - API limitation explanations
- [Changelog](CHANGELOG.md) - Version history
- [CurseForge Description](CURSEFORGE_DESCRIPTION.md) - Platform-specific info

## Configuration

**Direct script editing required** - This addon uses hardcoded configurations that must be modified in the JavaScript files.

Key configuration areas:
- Hub center and radius in `hubRules.js`
- Permission tags in `permissionHelper.js`
- Broadcast messages in `broadcasts_data.js`
- NPC locations via commands

## Requirements

- Minecraft Bedrock Edition server
- API 2.4.0 Stable support
- JavaScript knowledge for configuration
- Understanding of Bedrock addon limitations

## FAQ

**Will this be updated?**
No, unless the Bedrock API improves significantly. By the time that happens, this will probably be dead or have better forks.

**Is this plug-and-play?**
No. Requires direct JavaScript file editing and configuration.

**Can I modify this?**
Yes, under Apache 2.0 license. See LICENSE file for terms.

## Contributing

This is a legacy release. Contributions are welcome but understand the API limitations and legacy nature of the codebase.

## License

Licensed under Apache License 2.0. See [LICENSE](LICENSE) for full terms.

## Links

- Discord: https://discord.gg/NRCnPVUp
- Legacy Status: Migrated from Bedrock API 2.4.0 to PHP/PocketMine-MP

---

*This was the core system that powered Aethelgrad server before migration. Released for public use as-is.*
