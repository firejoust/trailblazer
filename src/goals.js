module.exports = function Goals() {
    function Radius(destination, radius) {
        destination = destination.floored()
        radius = radius || 0

        this.destination = () => {
            return destination
        }

        this.heuristic = (position) => {
            return position.distanceTo(destination)
        }

        this.complete = (position) => {
            return position.distanceTo(destination) <= radius
        }
    }

    function RadiusCB(callback, radius) {
        radius = radius || 0

        this.destination = () => {
            return callback()
        }

        this.heuristic = (position) => {
            return position.distanceTo(callback())
        }

        this.complete = (position) => {
            return position.distanceTo(callback()) <= radius
        }
    }

    function Direction(position, yaw, distance, radius) {
        position = position.floored()
        distance = distance || 150
        radius = radius || 10
        
        const destination = position.offset(
            -Math.sin(yaw) * distance, 0,
            -Math.cos(yaw) * distance
        )

        this.destination = () => {
            return destination
        }

        this.heuristic = (position) => {
            const x0 = destination.x - position.x
            const z0 = destination.z - position.z
            return Math.sqrt(x0 ** 2 + z0 ** 2)
        }

        this.complete = (position) => {
            return position.distanceTo(destination) <= radius
        }
    }

    return {
        Radius,
        RadiusCB,
        Direction
    }
}