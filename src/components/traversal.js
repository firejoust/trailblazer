const defaults = {
    minimumNodes: 3,
    radiusXZ: 1.5,
    radiusY: 0,
}

module.exports.inject = function inject(bot, Setter) {
    let {
        minimumNodes,
        radiusXZ,
        radiusY
    } = defaults

    function configure() {
        this.minimumNodes = Setter(this, _ => minimumNodes = _)
        this.radiusXZ = Setter(this, _ => radiusXZ = _)
        this.radiusY = Setter(this, _ => radiusY = _)
    }

    function nextNode(path) {
        // path is too small; switch to steering
        if (path.length < minimumNodes) {
            return null
        } else {
            const pos = path[0]
            const x = pos.x - bot.entity.position.x
            const y = pos.y - bot.entity.position.y
            const z = pos.z - bot.entity.position.z

            if (Math.abs(y) > radiusY) {
                if (Math.sqrt(x ** 2 + z ** 2) > radiusXZ) {
                    return pos
                }
            }

            return path.shift()
        }
    }

    return {
        configure,
        nextNode
    }
}