const Goals = require("./goals")

function Defaults(bot) {
    const goals = Goals.inject(bot)
    const { Headless, Target } = goals

    this.goalHeadless = Headless
    this.goalTarget = Target
    this.fov = 120
    this.rotations = 15
    this.blend = 0
}

module.exports.inject = function inject(bot, Setter) {
    let {
        goalHeadless,
        goalTarget,
        fov,
        rotations,
        blend
    } = new Defaults(bot)

    function configure() {
        this.goalHeadless = Setter(this, _ => goalHeadless = _)
        this.goalTarget = Setter(this, _ => goalTarget = _)
        this.fov = Setter(this, _ => fov = _)
        this.rotations = Setter(this, _ => rotations = _)
        this.blend = Setter(this, _ => blend = _)
    }

    function getYaw(position, destination) {
        if (position === null) {
            bot.movement.setGoal(goalHeadless)
            bot.movement.heuristic.get("proximity")
                .target(destination)
        } else {
            bot.movement.setGoal(goalTarget)
            bot.movement.heuristic.get("proximity")
            .target(position)
        }

        return bot.movement.getYaw(fov, rotations, blend)
    }

    function getControlStates(yaw) {
        return {
            forward: true,
            sprint: true,
            jump: true
        }
    }

    return {
        configure,
        getYaw,
        getControlStates
    }
}