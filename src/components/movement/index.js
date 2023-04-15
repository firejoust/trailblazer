const Goals = require("./goals")

function Defaults(bot) {
    const goals = Goals.inject(bot)
    const { Headless, Ground, Airborne, Swimming, Climbing } = goals
    // mineflayer-movement goals
    this.goalHeadless = Headless
    this.goalGround = Ground
    this.goalAirborne = Airborne
    this.goalSwimming = Swimming
    this.goalClimbing = Climbing
    // mineflayer-movement getYaw arguments
    this.fov = 360
    this.rotations = 25
    this.blend = 2
    // misc configuration
    this.jumpSprint = false
}

module.exports.inject = function inject(bot, Setter) {
    const defaults = new Defaults(bot)

    let {
        goalHeadless,
        goalGround,
        goalAirborne,
        goalSwimming,
        goalClimbing,
    } = defaults

    let {
        fov,
        rotations,
        blend,
        jumpSprint
    } = defaults

    function configure() {
        this.goalHeadless = Setter(this, _ => goalHeadless = _)
        this.goalGround = Setter(this, _ => goalGround = _)
        this.goalAirborne = Setter(this, _ => goalAirborne = _)
        this.goalSwimming = Setter(this, _ => goalSwimming = _)
        this.goalClimbing = Setter(this, _ => goalClimbing = _)

        this.fov = Setter(this, _ => fov = _)
        this.rotations = Setter(this, _ => rotations = _)
        this.blend = Setter(this, _ => blend = _)
        this.jumpSprint = Setter(this, _ => jumpSprint = _)
    }

    function getYaw(position, destination) {
        if (position === null) {
            if (bot.entity.isInWater || bot.entity.isInLava) {
                bot._movement.setGoal(goalSwimming)
                bot._movement.heuristic.get("proximity")
                    .target(destination)
            } else
            
            {
                bot._movement.setGoal(goalHeadless)
                bot._movement.heuristic.get("proximity")
                    .target(destination)
            }
        } else

        if (position.y - bot.entity.position.y > 0) {
            bot._movement.setGoal(goalClimbing)
            bot._movement.heuristic.get("proximity")
                .target(position)
        } else

        if (!bot.entity.onGround) {
            bot._movement.setGoal(goalAirborne)
            bot._movement.heuristic.get("proximity")
                .target(position)
        } else
        
        {
            bot._movement.setGoal(goalGround)
            bot._movement.heuristic.get("proximity")
            .target(position)
        }

        return bot._movement.getYaw(fov, rotations, blend)
    }

    function getControlStates(yaw) {
        const states = {
            forward: true,
            jump: true,
            sprint: bot.controlState["sprint"] || jumpSprint,
        }

        const status = new bot.physics.Simulation(bot.entity)
            .until(state => getJumpConditions(state))
            .ticks(20)
            .yaw(yaw)
            .controls(states)
            .execute()

        states["jump"] = status || bot.entity.isInWater || bot.entity.isInLava
        return states
    }

    function getJumpConditions(state) {
        if (jumpSprint) {
            return state.onGround && state.pos.y - bot.entity.position.y >= -1
        } else {
            return state.onGround && state.pos.y - bot.entity.position.y > 0
        }
    }

    return {
        configure,
        getYaw,
        getControlStates
    }
}