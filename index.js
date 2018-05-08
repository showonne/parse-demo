const input = '[1, [3, 4], a=b, 1=2]'

const types = {
    NUMBER: /^\d+$/,
    NAME: /^[a-z|A-Z]+$/,
    EOF: -1
}

const EOF = -1

class Token {
    constructor(type, text){
        this.type = type
        this.text = text
    }
}

class ListLexer {
    constructor(input){
        this.input = input
        this.index = 0
        this.lookahead = this.input[this.index]
        this.tokens = []
    }
    consume(){
        this.index++
        if(this.index >= this.input.length) return this.lookahead = types.EOF
        this.lookahead = this.input[this.index]
    }
    nextToken(){
        return this.tokens[this.index++]
    }
    match(x){
        if(this.lookahead === x) return this.consume()
        console.log(`Error: Unexpect ${this.lookahead}, expect ${x}`)
    }
    LBRACK(){
        this.tokens.push({
            type: 'LBRACK',
            text: '['
        })
        this.consume()
    }
    EQUALS(){
        this.tokens.push({
            type: 'EQUALS',
            text: '='
        })
        this.consume()
    }
    RBRACK(){
        this.tokens.push({
            type: 'RBRACK',
            text: ']'
        })
        this.consume()
    }
    COMMA(){
        this.tokens.push({
            type: 'COMMA',
            text: ','
        })
        this.consume()
    }
    NUMBER(){
        let letters = this.lookahead
        this.consume()
        while(types.NUMBER.test(this.lookahead)){
            letters += this.lookahead
            this.consume()
        }
        this.tokens.push({
            type: 'NUMBER',
            text: letters
        })
    }
    NAME(){
        let letters = this.lookahead
        this.consume()
        while(types.NAME.test(this.lookahead)){
            letters += this.lookahead
            this.consume()
        }
        this.tokens.push({
            type: 'NAME',
            text: letters
        })
    }
    lex(){
        while(this.lookahead !== types.EOF){
            switch(true){
                case this.lookahead === ' ':
                    this.consume()
                    continue
                case this.lookahead === '=':
                    this.EQUALS()
                    continue
                case this.lookahead === '[':
                    this.LBRACK()
                    break
                case types.NUMBER.test(this.lookahead):
                    this.NUMBER()
                    break
                case types.NAME.test(this.lookahead):
                    this.NAME()
                    break
                case this.lookahead === ']':
                    this.RBRACK()
                    break
                case this.lookahead === ',':
                    this.COMMA()
                    break
                default:
                    return console.log(`ERROR in ${this.index}: ${this.lookahead}`)
            }
        }
        this.tokens.push({
            type: 'EOF'
        })
        this.index = 0
    }
}

ListLexer.LBRACK = 'LBRACK'
ListLexer.RBRACK = 'RBRACK'
ListLexer.COMMA = 'COMMA'
ListLexer.NUMBER = 'NUMBER'
ListLexer.NAME = 'NAME'
ListLexer.EQUALS = 'EQUALS'

class ListParser {
    constructor(input, size){
        this.input = input
        this.index = 0
        this.bufferSize = size
        this.lookahead = new Array(size)
        for(let i = 0; i < size; i++){
            this.consume()
        }
    }
    match(x){
        if(this.LA(1) === x){
            console.log(`consumed ${this.LA(1)}`)
            this.consume()
        }else{
            return console.log(`match error, expect ${x} got ${this.LT(1).text}`)
        }
    }
    LT(i){
        return this.lookahead[(this.index + i - 1) % this.bufferSize]
    }
    LA(i){
        return this.LT(i).type
    }
    consume(){
        this.lookahead[this.index] = this.input.nextToken()
        this.index = (this.index + 1) % this.bufferSize
    }
    list(){
        this.match(ListLexer.LBRACK)
        this.elements()
        this.match(ListLexer.RBRACK)
    }
    elements(){
        this.element()
        while(this.LA(1) === ListLexer.COMMA){
            this.match(ListLexer.COMMA) 
            this.element()
        }
    }
    element(){
        if(this.LA(1) === ListLexer.NUMBER && this.LA(2) === ListLexer.EQUALS){
            this.match(ListLexer.NUMBER)
            this.match(ListLexer.EQUALS)
            this.match(ListLexer.NUMBER)
        }else if(this.LA(1) === ListLexer.NAME && this.LA(2) === ListLexer.EQUALS){
            this.match(ListLexer.NAME)
            this.match(ListLexer.EQUALS)
            this.match(ListLexer.NAME)
        }else if(this.LA(1) === ListLexer.NUMBER){
            this.match(ListLexer.NUMBER)
        }else if(this.LA(1) === ListLexer.NAME){
            this.match(ListLexer.NAME)
        }else if(this.LA(1) === ListLexer.LBRACK){
            this.list()
        }else{
            console.log(`PARSER ERROR, expected NUMBER or [, got ${this.lookahead.text}`)
        }
    }
}

let lexer = new ListLexer(input)
lexer.lex()
let parser = new ListParser(lexer, 2)
parser.list()