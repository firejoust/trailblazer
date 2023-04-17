import { Bot, ControlStateStatus } from "mineflayer"
import { AvoidBlocks, hazards } from "mineflayer-pathfinder-lite"
import { Vec3 } from "vec3"
import Heuristics from "mineflayer-movement/src/heuristics"

type MovementGoal = Heuristics.Goal

export function plugin(bot: Bot): void

declare interface Goal {
    destination: () => Vec3 | null,
    heuristic: (position: Vec3) => number,
    complete: (position: Vec3) => boolean
}

export interface goals {
    Radius: (destination: Vec3, radius?: number) => Goal
    RadiusCB: (callback: () => Vec3, radius?: number) => Goal
    Avoid: (position: Vec3, distance?: number) => Goal
    AvoidCB: (callback: () => Vec3, distance?: number) => Goal 
}

type Hazard = hazards.Block | hazards.Entity | hazards.Position

export interface hazards {
    Block: hazards.Block,
    Entity: hazards.Entity,
    Position: hazards.Position
}

declare namespace Configurable {
    interface Movement {
        goalHeadless: (goal: MovementGoal) => void
        goalGround: (goal: MovementGoal) => void
        goalAirborne: (goal: MovementGoal) => void
        goalSwimming: (goal: MovementGoal) => void
        goalClimbing: (goal: MovementGoal) => void
        fov: (fov: number) => void
        rotations: (rotations: number) => void
        blend: (blend: number) => void
    }

    interface Pathfinder {
        avoid: (avoid: AvoidBlocks) => void
        depth: (depth: number) => void
        blocks: (blocks: number) => void
        timeout: (timeout: number) => void
        minimumNodes: (minimumNodes: number) => void
    }

    interface Traversal {
        prevision: (prevision: number) => void
        radiusXZ: (radiusXZ: number) => void
        radiusAscent: (radiusAscent: number) => void
        radiusDescent: (radiusDescent: number) => void
    }
}

type Category = 'movement' | 'pathfinder' | 'traversal'

type ConfigurableMap = {
    'movement': Configurable.Movement,
    'pathfinder': Configurable.Pathfinder,
    'traversal': Configurable.Traversal
}

declare interface Plugin {
    setGoal: (goal: Goal, ...hazards: Hazard[]) => void
    configure: <Type extends Category>(category: Type) => ConfigurableMap[Type]
    goto: (goal: Goal, ...hazards: Hazard[]) => Promise<void>
    stop: (reason?: string) => void
    tick: () => void
    getYaw: () => number
    getControls: () => ControlStateStatus
}

export module "mineflayer" {
    interface Bot {
        trailblazer: Plugin
    }
}