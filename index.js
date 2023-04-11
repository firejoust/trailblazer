const Movement = require("./src/movement/movement")
const Pathfinder = require("./src/pathfinder")
const Traversal = require("./src/traversal")

const Assert = require("assert")

const Setter = (instance, callback) => {
    return (...args) => {
        callback(...args)
        return instance
    }
}

module.exports.inject = function inject(bot) {
    const movement = require("mineflayer-movement").plugin
    const pathfinder = require("mineflayer-pathfinder-lite").plugin

    bot.loadPlugin(movement)
    bot.loadPlugin(pathfinder)
    bot.navigate = new Plugin(bot)
}

function Plugin(bot) {
    const movement = Movement.inject(bot, Setter)
    const pathfinder = Pathfinder.inject(bot, Setter)
    const traversal = Traversal.inject(bot, Setter)

    let _reject = () => {}
    let _goal = null
    let _hazards = null

    this.setGoal = setGoal
    this.configure = configure
    this.start = start
    this.stop = stop
    this.tick = tick
    this.getYaw = getYaw
    this.getControls = getControls

    function setGoal(goal, ...hazards) {
        _goal = goal
        _hazards = hazards
    }

    function configure(category) {
        switch (category) {
            case 'movement':
                return new movement.configure()
            case 'pathfinder':
                return new pathfinder.configure()
            case 'traversal':
                return new traversal.configure()
            default:
                throw new TypeError(`Invalid category specified '${category}'`)
        }
    }

    const callback = resolve => {
        if (_goal.complete(bot.entity.position.floored())) {
            resolve()
        } else {
            tick()
        }
    }

    async function start() {
        stop("A new operation was started before the last one could finish")
        // create a path to the goal
        return new Promise((resolve, reject) => {
            _reject = reject
            bot.on("physicsTick", () => callback(resolve))
        })
    }

    function stop(reason) {
        _reject(reason || "The operation was stopped manually")
        _reject = () => {}
        // remove listener
        bot.off("physicsTick", callback)
    }

    function getYaw() {
        Assert.ok(_goal, "No goals have been set")
        const path = pathfinder.getPath(_goal, _hazards)
        const nextPos = traversal.getNextPos(path)
        const yaw = movement.getYaw(nextPos)
        return yaw
    }

    function getControls(yaw) {
        return movement.getControlStates(yaw)
    }

    function tick() {
        const yaw = getYaw()
        const controls = getControls(yaw)

        // set required control states
        for (let state in controls) {
            bot.controlState[state] = controls[state]
        }

        // steer towards the next node
        return bot.look(yaw, bot.entity.pitch, true)
    }
}

module.exports.goals = require("mineflayer-pathfinder-lite").goals