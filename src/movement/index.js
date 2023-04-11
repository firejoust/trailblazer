const Goals = require("./goals")

function Defaults(bot) {
    const goals = Goals.inject(bot)
    const { Headless, Precise, Smooth } = goals

    this.goalHeadless = Headless
    this.goalPrecise = Precise
    this.goalSmooth = Smooth

    this.fov = 240
    this.rotations = 15
    this.blend = 0
}

module.exports.inject = function inject(bot, Setter) {
    const defaults = new Defaults(bot)
        
    let goalHeadless = defaults.goalHeadless
    let goalPrecise  = defaults.goalPrecise
    let goalSmooth   = defaults.goalSmooth

    let fov       = defaults.fov
    let rotations = defaults.rotations
    let blend     = defaults.blend

    function configure() {
        const config = {}
        // reset the default movement heuristics
        config.goalHeadless = Setter(config, _ => goalHeadless = _)
        config.goalPrecise = Setter(config, _ => goalPrecise = _)
        config.goalSmooth = Setter(config, _ => goalSmooth = _)
        
        // set getYaw paremeters
        config.fov = Setter(config, _ => fov = _)
        config.rotations = Setter(config, _ => rotations = _)
        config.blend = Setter(config, _ => blend = _)

        return config
    }

    function getYaw(nextPos) {
        if (nextPos === null) {

        } else {
            
        }
        bot.movement.setGoal()
    }
}