class Token {
    constructor(type, value){
        this.type = type
        if(value){
            this.value = value
        }
    }
}

module.exports = Token