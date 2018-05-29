const Lexer = require('./lexer')

class Parser {
    constructor(){
        this.index = 0
    }
    consume(){
        this.index++
    }
    skip(tokens){
        while(tokens.includes(this.peak().type)){
            this.consume()
        }
    }
    peak(){
        return this.tokens[this.index]
    }
    parse(tokens){
        this.tokens = tokens

        let ast = {
            type: 'Program',
            body: []
        }

        ast.body = this.statements()
    }
    statements(){
        while(this.peak().type !== 'EOF'){
            
        }
    }
}


const str = `texto ~
    <div class="wrapper" id='root'>
        <h1>I'm h1 tag</h1>
        <input />
    </div>
`

let lexer = new Lexer()

const tokens = lexer.lex(str)
const ast = new Parser().parse()

console.log(ast)