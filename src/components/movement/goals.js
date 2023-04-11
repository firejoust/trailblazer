module.exports.inject = function inject(bot) {
    const Headless = new bot.movement.Goal({
        distance: bot.movement.heuristic.new('distance')
            .weight(0.5)
            .radius(10)
            .height(5)
            .count(2)
            .increment(0.2),

        danger: bot.movement.heuristic.new('danger')
            .weight(0.55)
            .radius(5)
            .height(5)
            .descent(4)
            .depth(4)
            .count(2)
            .increment(0.2)
            .avoid('lava'),

        proximity: bot.movement.heuristic.new('proximity')
            .weight(0.45)
            .avoid(false),

        conformity: bot.movement.heuristic.new('conformity')
            .weight(0.3)
            .avoid(false)
    })

    const Target = new bot.movement.Goal({
        distance: bot.movement.heuristic.new('distance')
            .weight(0.4)
            .radius(10)
            .height(4)
            .count(2)
            .increment(0.2),

        danger: bot.movement.heuristic.new('danger')
            .weight(0.4)
            .radius(6)
            .height(4)
            .descent(4)
            .depth(4)
            .count(2)
            .increment(0.2)
            .avoid('lava', 'water'),

        proximity: bot.movement.heuristic.new('proximity')
            .weight(1.2)
            .avoid(false),

        conformity: bot.movement.heuristic.new('conformity')
            .weight(0.25)
            .avoid(false),
    })

    return {
        Headless,
        Target
    }
}