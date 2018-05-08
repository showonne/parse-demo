class Token {
    constructor(type, text){
        this.type = type
        this.text = text
    }
}

Token.PLUS = 'PLUS'
Token.INT = 'INT'

module.exports = Token