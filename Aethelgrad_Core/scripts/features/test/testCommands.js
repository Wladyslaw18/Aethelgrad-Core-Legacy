// Test command for API 2.5.0 argument parsing
// Tests if numeric arguments now work properly

import { 
    world, 
    CommandPermissionLevel, 
    CustomCommandStatus,
    CustomCommandParamType
} from "@minecraft/server";

export function registerTestCommands(customCommandRegistry) {
    try {
        // Test numeric argument command
        customCommandRegistry.registerCommand(
            {
                name: "ae:testnumber",
                description: "Test numeric argument parsing (API 2.5.0)",
                permissionLevel: CommandPermissionLevel.Admin,
                cheatsRequired: false,
                parameters: [{
                    name: "number",
                    type: CustomCommandParamType.Float,
                    description: "Number to test parsing"
                }]
            },
            (origin, args) => {
                const player = origin?.sourceEntity;
                if (!player) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "Must be run by a player."
                    };
                }

                // Try to access numeric argument
                const number = args.number;
                
                try {
                    player.sendMessage(`§6[API 2.5.0 Test] §rReceived argument: ${number} (type: ${typeof number})`);
                    
                    if (number !== undefined) {
                        const numValue = Number(number);
                        if (!isNaN(numValue)) {
                            player.sendMessage(`§a[SUCCESS] §rParsed as number: ${numValue}`);
                            
                            // Test setting hub radius with this number
                            world.setDynamicProperty("ae:hub_radius", numValue);
                            player.sendMessage(`§e[TEST] §rSet hub radius to: ${numValue}`);
                            
                            return {
                                status: CustomCommandStatus.Success,
                                message: `Numeric argument test successful! Set radius to ${numValue}`
                            };
                        } else {
                            return {
                                status: CustomCommandStatus.Failure,
                                message: `§c[FAIL] §rCould not parse "${number}" as number`
                            };
                        }
                    } else {
                        return {
                            status: CustomCommandStatus.Failure,
                            message: "§c[FAIL] §rNo argument received"
                        };
                    }
                } catch (error) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: `§c[ERROR] §r${error.message}`
                    };
                }
            }
        );

        // Test string argument command
        customCommandRegistry.registerCommand(
            {
                name: "ae:teststring",
                description: "Test string argument parsing (API 2.5.0)",
                permissionLevel: CommandPermissionLevel.Admin,
                cheatsRequired: false,
                parameters: [{
                    name: "text",
                    type: CustomCommandParamType.String,
                    description: "Text to test parsing"
                }]
            },
            (origin, args) => {
                const player = origin?.sourceEntity;
                if (!player) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "Must be run by a player."
                    };
                }

                const text = args.text || "no args";
                player.sendMessage(`§6[API 2.5.0 Test] §rString argument: "${text}"`);
                
                return {
                    status: CustomCommandStatus.Success,
                    message: `String argument test successful!`
                };
            }
        );

        console.warn("[TestCommands] API 2.5.0 argument parsing test commands registered");
        console.warn("[TestCommands] Use /ae:testnumber 250 to test numeric arguments");
        console.warn("[TestCommands] Use /ae:teststring hello world to test string arguments");
        
    } catch (error) {
        console.error("[TestCommands] Registration failed:", error);
    }
}
