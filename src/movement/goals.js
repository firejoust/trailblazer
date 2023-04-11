module.exports.inject = function inject(bot) {
    const Headless = new bot.movement.Goal({

    })

    const Precise = new bot.movement.Goal({

    })

    const Smooth = new bot.movement.Goal({

    })

    return {
        Headless,
        Precise,
        Smooth
    }
}