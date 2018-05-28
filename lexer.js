class Token {
    constructor(type, value){
        this.type = type
        if(value){
            this.value = value
        }
    }
}

class State {
    constructor(){
        this.state = []
    }
    enter(name){
        this.state.push(name)
    }
    leave(name){
        this.state.pop()
    }
}

const TAG_OPEN = /^<([a-zA-Z][\w\-\.]*)\s*/
const TAG_ATTRIBUTE = /([-0-9a-z]+)(=(["'])([^\3]*)\3)?\s*/
const TAG_END = /^(\/?)>/
const TAG_CLOSE = /^<\/([a-zA-Z][\w\-\.]*)>/

const pattern = {
    TAG_OPEN,
    TAG_ATTRIBUTE,
    TAG_END,
    TAG_CLOSE
}

class Lexer {
    constructor(input){
        this.input = input
        this.tokens = []
        this.index = 0
        this.state = new State()
        this.state.enter('start')
    }
    match(type){
        if(!pattern[type]) return
        return pattern[type].exec(this.input)
    }
    lex(){
        let token = this.advance()
        while(token && token !== 'EOF'){
            this.tokens.push(token)
            token = this.advance()
        }
        this.token.push(new Token('EOF'))
        return this.tokens
    }
    advance(){
        const token = 
            this.eof() ||
            this.tagOpen() ||
            this.attribute()
    }
    eof(){
        if(this.input.length > 0) return
        return new Token('EOF')
    }
    tagOpen(){
        const matched = this.match('TAG_OPEN')
        if(matched){
            this.input = this.input.slice(matched[0].length)
            this.state.enter('tagOpen')
            return new Token('TAG_OPEN', matched[1])
        }
    }
    attribute(){
        if(this.state !== 'tagOpen') return
        const matched = this.match('TAG_ATTRIBUTE')

        if(matched){
            this.input = this.input.slice(matched[0].length)
            return new Token('TAG_ATTRIBUTE', {type: matched[1], value: matched[4]})
        }
    }
}

const str = `
    <div class="wrapper" id="root">
        <h1>I'm h1 tag</h1>
    </div>
`

let lexer = new Lexer()

const res = lexer.lex(str)

console.log(res)
