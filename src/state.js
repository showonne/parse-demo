class State {
    constructor () {
        this.state = []
    }
    enter (name) {
        this.state.push(name)
    }
    leave (name) {
        if (this.state[this.state.length - 1] === name) {
            this.state.pop()
        }
    }
    is (name) {
        return this.state[this.state.length - 1] === name
    }
}

module.exports = State
