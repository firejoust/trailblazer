const defaults = {
    prevision: 5,
    radiusXZ: 2,
    radiusAscent: 0.1,
    radiusDescent: 10
}

module.exports.inject = function inject(bot, Setter) {
    let {
        prevision,
        radiusXZ,
        radiusAscent,
        radiusDescent
    } = defaults

    function configure() {
        this.prevision = Setter(this, _ => prevision = _)
        this.radiusXZ = Setter(this, _ => radiusXZ = _)
        this.radiusAscent = Setter(this, _ => radiusAscent = _)
        this.radiusDescent = Setter(this, _ => radiusDescent = _)
    }

    function withinRadius(x, y, z) {
        return (Math.sqrt(x ** 2 + z ** 2) <= radiusXZ) && (
            y < 0
            ? Math.abs(y) <= radiusDescent
            : Math.abs(y) <= radiusAscent
        )
    }

    function nextNode(path) {
        // path is too small; switch to steering
        if (path.length < 1) {
            return null
        } else

        {
            const maximum = Math.min(prevision, path.length)
            let found = false
            let index = 0

            for (let i = 0; i < maximum; i++) {
                const x = path[i].x - bot.entity.position.x
                const y = path[i].y - bot.entity.position.y
                const z = path[i].z - bot.entity.position.z

                if (withinRadius(x, y, z)) {
                    found = true
                    index = i
                    continue
                }

                if (found) {
                    break
                }
            }

            if (found) {
                for (let i = 0; i <= index; i++) {
                    path.shift()
                }
            }

            return path[0] || null
        }
    }

    return {
        configure,
        nextNode
    }
}