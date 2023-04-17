import { Bot, ControlStateStatus } from "mineflayer"
import { AvoidBlocks, hazards } from "mineflayer-pathfinder-lite"
import { Vec3 } from "vec3"
import Heuristics from "mineflayer-movement/src/heuristics"

type MovementGoal = Heuristics.Goal

export function plugin(bot: Bot): void

declare class Goal {
    destination: () => Vec3 | null
    heuristic: (position: Vec3) => number
    complete: (position: Vec3) => boolean
}

export namespace goals {
    class Radius extends Goal {
        constructor(destination: Vec3, radius?: number)
    }
    class RadiusCB extends Goal {
        constructor(callback: () => Vec3, radius?: number)
    }
    class Avoid extends Goal {
        constructor(position: Vec3, distance?: number)
    }
    class AvoidCB extends Goal {
        constructor(callback: () => Vec3, distance?: number)
    }
}

type Hazard = hazards.Block | hazards.Entity | hazards.Position

export interface hazards {
    Block: hazards.Block,
    Entity: hazards.Entity,
    Position: hazards.Position
}

declare namespace Configurable {
    interface Movement {
        jumpSprint: (jumpSprint: boolean) => this
        fov: (fov: number) => this
        rotations: (rotations: number) => this
        blend: (blend: number) => this
        goalHeadless: (goal: MovementGoal) => this
        goalGround: (goal: MovementGoal) => this
        goalAirborne: (goal: MovementGoal) => this
        goalSwimming: (goal: MovementGoal) => this
        goalClimbing: (goal: MovementGoal) => this
    }

    interface Pathfinder {
        avoid: (avoid: AvoidBlocks) => this
        depth: (depth: number) => this
        blocks: (blocks: number) => this
        timeout: (timeout: number) => this
        minimumNodes: (minimumNodes: number) => this
    }

    interface Traversal {
        prevision: (prevision: number) => this
        radiusXZ: (radiusXZ: number) => this
        radiusAscent: (radiusAscent: number) => this
        radiusDescent: (radiusDescent: number) => this
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
    getControls: (yaw: number) => ControlStateStatus
}

declare module "mineflayer" {
    interface Bot {
        trailblazer: Plugin
    }
}