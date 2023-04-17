module.exports = function Goals() {
    function Radius(destination, radius) {
        destination = destination
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

    function Avoid(position, distance) {
        distance = distance || 30

        this.destination = () => {
            return null
        }

        this.heuristic = (_position) => {
            return -position.distanceTo(_position)
        }

        this.complete = (_position) => {
            return position.distanceTo(_position) > distance
        }
    }

    function AvoidCB(callback, distance) {
        distance = distance || 30

        this.destination = () => {
            return null
        }

        this.heuristic = (_position) => {
            return -callback().distanceTo(_position)
        }

        this.complete = (_position) => {
            return callback().distanceTo(_position) > distance
        }
    }

    return {
        Radius,
        RadiusCB,
        Avoid,
        AvoidCB
    }
}