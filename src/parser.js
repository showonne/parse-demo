class Parser {
    constructor () {
        this.index = 0
    }
    consume () {
        this.index++
    }
    skip (tokens) {
        while (tokens.includes(this.peek().type)) {
            this.consume()
        }
    }
    peek () {
        return this.tokens[this.index]
    }
    parse (tokens) {
        this.tokens = tokens
        let ast = {
            type: 'Program',
            body: []
        }

        ast.body = this.statements()

        return ast
    }
    statements () {
        let root = []

        // this.skip(['WHITE_SPACE'])
        while (this.peek().type !== 'EOF' && this.peek().type !== 'TAG_CLOSE' && this.peek().type !== 'EXPRESSION_END') {
            // this.skip(['WHITE_SPACE'])

            // children condition eg: <h1>text </h1>
            // if (this.peek().type === 'TAG_CLOSE' || this.peek().type === 'EOF') {
            //     break
            // }

            const statement = this.statement()
            if (statement) {
                root.push(statement)
            }
        }
        return root
    }
    statement () {
        const token = this.peek()
        switch (token.type) {
        case 'TAG_OPEN':
            return this.tag()
        case 'TEXT':
        case 'WHITE_SPACE':
            return this.text()
        case 'EXPRESSION_OPEN':
            return this.expression()
        default:
            console.error(`Unexpected token: ${token.type}`)
        }
    }
    expression () {
        const token = this.peek();
        let node = {
            type: 'Expression',
            exprType: token.value.type,
            expr: token.value.expr,
            body: ''
        };
        this.consume()
        const statements = this.statements()
        if (statements) {
            node.body = statements
        }
        if (this.peek().value.type !== node.exprType) {
            return new Error(`no matched expr ${node.exprType} end `)
        }
        this.consume()
        return node
    }
    tag () {
        // debugger
        const token = this.peek()

        let node = {
            type: 'Tag',
            name: token.value,
            attributes: {}
        }

        this.consume()

        // handle attributes
        while (this.peek().type === 'TAG_ATTRIBUTE') {
            node.attributes[ this.peek().value.name ] = this.peek().value.value
            this.consume()
        }

        if (this.peek().type !== 'TAG_END') {
            console.error(`Parser Error. Expect token 'TAG_END', got ${this.peek().type}`)
        }

        // consume tagEnd
        if (this.peek().value.isSelfClosed) {
            node.isSelfClosed = true
            this.consume()
            return node
        }

        node.isSelfClosed = false
        this.consume()

        node.children = this.statements() || []
        if (this.peek().value !== node.name) {
            console.error(`Unexpected close tag ${this.peek().value}, expected ${node.name}`)
        }
        this.consume()
        return node
    }
    text () {
        let text = ''
        while (this.peek().type === 'TEXT' || this.peek().type === 'WHITE_SPACE') {
            text += this.peek().value
            this.consume()
        }

        const node = {
            type: 'Text',
            value: text
        }

        return node
    }
}

module.exports = Parser

// for test
const str = `texto ~
<div Class="wrapper" id='root'>
    <h1>I'm h1 tag</h1>
    <input />
</div>
`

const Lexer = require('./lexer')
let lexer = new Lexer()
const tokens = lexer.lex(str)
const ast = new Parser().parse(tokens)
console.log(ast)
