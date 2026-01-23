# Aethelgrad Core Legacy

**A foundational behavior addon for Minecraft Bedrock Edition servers, built for the harsh realities of the stable API.**

> ⚠️ **Legacy Release** - This is the original Aethelgrad Core, released as-is for public use. No updates planned unless the Bedrock API significantly improves.

## 🚀 Quick Start

1. Download the latest release
2. Extract to your server's `behavior_packs` folder  
3. Enable the behavior pack in your world/server settings
4. Restart and verify entities and commands are working

## ⚠️ Important - Read This First

This addon was **NOT** designed to be plug-and-play. It was built for a specific server with hardcoded configurations. 

**Expect to edit scripts directly.** There are no configuration files.

**This is intentional.**

## 📋 Features

- **NPC System** - Kit and teleport NPCs with interaction handling
- **Hub Protection** - Configurable safe zone with item restrictions and mob clearing
- **Broadcast System** - Automated server announcements with rarity tiers
- **Item Management** - Compass distribution and cleanup utilities
- **Command Framework** - Core commands with permission handling
- **Cooldown System** - Time-based restrictions for various actions

## 🛠️ Technical Details

- **API Version**: 2.4.0 Stable (intentionally NOT using 2.5.0 Beta)
- **Minecraft**: 1.21.130
- **Dependencies**: `@minecraft/server`, `@minecraft/server-ui`
- **License**: MIT

## 🐛 Known Issues & Workarounds

This addon contains numerous workarounds for Bedrock API limitations. **Do not remove these without understanding the consequences.**

See [`scripts/WORKAROUNDS.md`](scripts/WORKAROUNDS.md) for detailed explanations of every workaround and why it's necessary.

### Common Issues
- Commands may require world restarts to function properly
- Some logic only works after world reload  
- Debug output is minimal or misleading
- API behavior changes between minor Minecraft versions

**This is normal.**

## 📚 Documentation

- [`scripts/WORKAROUNDS.md`](scripts/WORKAROUNDS.md) - Detailed explanation of all workarounds
- [`scripts/IMPORTANT.md`](scripts/IMPORTANT.md) - Technical notes about the Bedrock API
- [`scripts/README!.md`](scripts/README!.md) - Design philosophy and limitations

## 🔧 Configuration

**No configuration files exist.** Settings are hardcoded:

- Hub coordinates: `{x: 9027, y: 100, z: 8978}`
- Hub radius: `260` blocks
- Permission tags: `AE`, `admin`, `Admin`, `AEb_manager`, `AEh_manager`

**You must edit the scripts directly** to change these values.

## 🤝 Contributing

Feel free to fork and modify. The original codebase will not receive updates unless:
- Mojang fixes the underlying API issues, OR
- The community creates better forks

## ❓ Asked Questions

**Q: Will this be updated?**  
A: No. Unless the Bedrock API significantly improves, this addon will not be updated. By the time that happens, this code will likely be obsolete or have better community forks.

**Q: Why use API 2.4.0 instead of 2.5.0 Beta?**  
A: Beta APIs at Mojang can vanish overnight. 2.4.0 is "stable" in the sense that it won't suddenly disappear, even though 2.5.0 Beta works better.

**Q: Why are there so many workarounds?**  
A: The Bedrock addon API is incomplete and inconsistent. Every workaround exists because something is broken in the API.

**Q: Can I make this plug-and-play?**  
A: Not without significant refactoring. The addon was intentionally designed for a specific server configuration.

**Q: Will you add feature X?**  
A: No. This is a legacy release as-is.

## 📄 License

MIT License - Do whatever you want with it. If it breaks, check the Minecraft version, then check the API version, then accept that this is how Bedrock addon development works.

## 🔗 Links

- [Discord](https://discord.gg/NRCnPVUp) – General server community (not dedicated addon support)

---

> **This is intentional.**  
> The design choices, workarounds, and limitations exist for specific reasons. If something seems overengineered, you haven't been broken by the Bedrock addon API yet. You will be.
