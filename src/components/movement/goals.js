module.exports.inject = function inject(bot) {
    const Headless = new bot._movement.Goal({
        distance: bot._movement.heuristic.new('distance')
            .weight(0.5)
            .radius(10)
            .height(5)
            .count(2)
            .increment(0.2),

        danger: bot._movement.heuristic.new('danger')
            .weight(0.55)
            .radius(5)
            .height(5)
            .descent(4)
            .depth(4)
            .count(2)
            .increment(0.2)
            .avoid('lava'),

        proximity: bot._movement.heuristic.new('proximity')
            .weight(0.45)
            .avoid(false),

        conformity: bot._movement.heuristic.new('conformity')
            .weight(0.3)
            .avoid(false)
    })

    const Ground = new bot._movement.Goal({
        shortDistance: bot._movement.heuristic.new('distance')
            .weight(0.65)
            .radius(2)
            .height(1)
            .count(2)
            .increment(0.2),

        longDistance: bot._movement.heuristic.new('distance')
            .weight(0.25)
            .radius(10)
            .height(4)
            .count(2)
            .increment(0.2),

        danger: bot._movement.heuristic.new('danger')
            .weight(0.4)
            .radius(1)
            .height(1)
            .descent(4)
            .depth(4)
            .count(2)
            .increment(0.2)
            .avoid('lava', 'water'),

        proximity: bot._movement.heuristic.new('proximity')
            .weight(1.2)
            .avoid(false),

        conformity: bot._movement.heuristic.new('conformity')
            .weight(0.25)
            .avoid(false),
    })

    const Airborne = new bot._movement.Goal({
        distance: bot._movement.heuristic.new('distance')
            .weight(0.2)
            .radius(2)
            .height(1)
            .count(2)
            .increment(0.2),

        proximity: bot._movement.heuristic.new('proximity')
            .weight(0.7)
            .avoid(false),

        conformity: bot._movement.heuristic.new('conformity')
            .weight(0.7)
            .avoid(false),
    })

    const Swimming = new bot._movement.Goal({
        distance: bot._movement.heuristic.new('distance')
            .weight(1)
            .radius(4)
            .height(4)
            .count(3)
            .increment(0.2),

        proximity: bot._movement.heuristic.new('proximity')
            .weight(0.1)
            .avoid(false),

        conformity: bot._movement.heuristic.new('conformity')
            .weight(1.5)
            .avoid(false),
    })

    const Climbing = new bot._movement.Goal({
        danger: bot._movement.heuristic.new('danger')
            .weight(0.4)
            .radius(3)
            .height(4)
            .descent(4)
            .depth(1)
            .count(2)
            .increment(0.2)
            .avoid('lava', 'water'),

        proximity: bot._movement.heuristic.new('proximity')
            .weight(1)
            .avoid(false),

        conformity: bot._movement.heuristic.new('conformity')
            .weight(0.3)
            .avoid(false),
    })

    return {
        Headless,
        Ground,
        Airborne,
        Swimming,
        Climbing
    }
}