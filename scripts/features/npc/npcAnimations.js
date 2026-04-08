/**
 * NPC Animation System
 * Adds idle animations and improved movement behavior to NPCs
 */

import { system, world } from "@minecraft/server";

// Animation states
const ANIMATION_STATES = {
    IDLE: "idle",
    INTERACTING: "interact"
};

// Track NPC animation states
const npcAnimationStates = new Map();

/**
 * Initialize NPC animation system
 */
export function init() {
    // Start idle animation loop
    system.runInterval(() => {
        updateNpcAnimations();
    }, 20); // Update every second (20 ticks)
}

/**
 * Update NPC animations
 */
function updateNpcAnimations() {
    for (const player of world.getAllPlayers()) {
        const nearbyNpcs = player.dimension.getEntities({
            families: ["npc", "aethelgrad_npc"],
            location: player.location,
            maxDistance: 16
        });
        
        for (const npc of nearbyNpcs) {
            const npcId = npc.typeId;
            const currentState = npcAnimationStates.get(npc.id) || ANIMATION_STATES.IDLE;
            
            // Determine if NPC should be animating
            const shouldAnimate = shouldNpcAnimate(npc, player);
            
            if (shouldAnimate) {
                // Simple head bobbing animation
                const time = system.currentTick * 0.1;
                const headY = Math.sin(time) * 2 + 20;
                const headX = Math.cos(time * 0.5) * 5;
                
                // Apply rotation to head (limited range)
                npc.setHeadRotation({ x: headX, y: headY });
                
                // Subtle body sway
                const bodySway = Math.sin(time * 0.3) * 1;
                npc.setBodyRotation({ x: 0, y: bodySway });
            } else {
                // Reset to neutral position
                npc.setHeadRotation({ x: 0, y: 20 });
                npc.setBodyRotation({ x: 0, y: 0 });
            }
            
            // Update animation state
            npcAnimationStates.set(npc.id, shouldAnimate ? ANIMATION_STATES.INTERACTING : ANIMATION_STATES.IDLE);
        }
    }
}

/**
 * Determine if NPC should animate based on player proximity
 */
function shouldNpcAnimate(npc, player) {
    const distance = Math.sqrt(
        Math.pow(npc.location.x - player.location.x, 2) +
        Math.pow(npc.location.y - player.location.y, 2) +
        Math.pow(npc.location.z - player.location.z, 2)
    );
    
    // Animate when player is within 8 blocks
    return distance <= 8;
}

/**
 * Add interaction effects to NPCs
 */
export function addInteractionEffect(npc, player) {
    // Particle effect for interaction
    const dimension = player.dimension;
    
    // Create heart particles around NPC
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const offsetX = Math.cos(angle) * 1.5;
        const offsetZ = Math.sin(angle) * 1.5;
        
        dimension.spawnParticle(
            "minecraft:heart_particle",
            {
                x: npc.location.x + offsetX,
                y: npc.location.y + 2,
                z: npc.location.z + offsetZ
            }
        );
    }
    
    // Brief glow effect
    npc.addEffect("minecraft:glowing", 40, { amplifier: 0, showParticles: false });
    
    // Reset after 2 seconds
    system.runTimeout(() => {
        npc.removeEffect("minecraft:glowing");
    }, 40);
}
