const defaults = {
    avoid: ['lava', 'water'],
    depth: 4,
    blocks: 10000,
    interval: 1000,
    timeout: 10
}

module.exports.inject = function inject(bot) {
    let {
        avoid,
        depth,
        blocks,
        timeout,
        interval
    } = defaults

    let counter = interval
    let intervalID = null
    let path = null

    const increment = () => counter++

    function configure() {
        this.avoid = Setter(this, (..._) => avoid = _)
        this.depth = Setter(this, _ => depth = _)
        this.blocks = Setter(this, _ => blocks = _)
        this.timeout = Setter(this, _ => timeout = _)
    }

    function getPath(goal, hazards) {
        if (intervalID === null) {
            intervalID = setInterval(increment, 1)
        }

        if (counter >= interval) {
            counter = 0
            path = new bot.pathfinder.Path(goal, ...hazards)
            .avoid(...avoid)
            .depth(depth)
            .blocks(blocks)
            .timeout(timeout)
            .execute()
        }

        return path
    }

    function reset() {
        clearInterval(intervalID)
        // reset variables
        counter = interval
        intervalID = null
        path = null
    }

    return {
        configure,
        getPath,
        reset
    }
}