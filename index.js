const Goals = require("./src/goals")

const Movement = require("./src/components/movement")
const Pathfinder = require("./src/components/pathfinder")
const Traversal = require("./src/components/traversal")

const Assert = require("assert")

const Setter = (instance, callback) => {
    return (...args) => {
        callback(...args)
        return instance
    }
}

module.exports.plugin = function inject(bot) {
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

    this.hazards = bot.pathfinder.hazards

    let _callback = () => {}
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

    function callback(resolve) {
        if (_goal.complete(bot.entity.position.floored())) {
            resolve()
            stop("Operation has finished")
        } else {
            tick()
        }
    }

    async function start() {
        stop("A new operation was started before the last one could finish")
        // create a path to the goal
        return new Promise((resolve, reject) => {
            _reject = reject
            _callback =  () => callback(resolve)
            bot.on("physicsTick", _callback)
        })
    }

    function stop(reason) {
        // reject pending operations
        _reject(reason || "The operation was stopped manually")
        _reject = () => {}
        // remove listener and reset callback
        bot.off("physicsTick", _callback)
        _callback = () => {}
        // clear control states
        bot.clearControlStates()
        pathfinder.reset()
    }

    function getYaw() {
        Assert.ok(_goal, "No goals have been set")
        const destination = _goal.destination()
        const path = pathfinder.getPath(_goal, _hazards)
        const position = traversal.nextNode(path, destination)
        return movement.getYaw(position, destination)
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
        bot.look(yaw, bot.entity.pitch, true)
    }
}

module.exports.goals = Goals()