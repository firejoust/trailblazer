const defaults = {
    avoid: { 'lava': true, 'water': true },
    depth: 4,
    blocks: 5000,
    interval: 1000,
    timeout: 10,
    minimumNodes: 3
}

module.exports.inject = function inject(bot) {
    let {
        avoid,
        depth,
        blocks,
        timeout,
        interval,
        minimumNodes
    } = defaults

    let counter = interval
    let intervalID = null
    let path = null

    const increment = () => counter++

    function configure() {
        this.avoid = Setter(this, _ => avoid = _)
        this.depth = Setter(this, _ => depth = _)
        this.blocks = Setter(this, _ => blocks = _)
        this.timeout = Setter(this, _ => timeout = _)
        this.minimumNodes = Setter(this, _ => minimumNodes = _)
    }

    function getPath(goal, hazards) {
        if (intervalID === null) {
            intervalID = setInterval(increment, 1)
        }

        if (path === null || (counter >= interval && bot.entity.onGround)) {
            counter = 0
            path = new bot._pathfinder.Path(goal, ...hazards)
                .avoid(avoid)
                .depth(depth)
                .blocks(blocks)
                .timeout(timeout)
                .execute()
                .map(position => position.offset(0.5, 0, 0.5))

            if (path.length < minimumNodes) {
                path = []
                return path
            }
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