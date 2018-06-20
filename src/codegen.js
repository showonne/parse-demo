const Lexer = require('./lexer')
const Parser = require('./parser')

const str = `texto ~
<div Class="wrapper" id='root'>
    <h1>I'm h1 tag</h1>
    <input />
</div>
`
let res = ''

const codeGenerate = ast => {
    if (ast.type === 'Program') {
        ast.body.forEach(child => {
            codeGenerate(child)
        })
    }
    if (ast.type === 'Text') {
        res += ast.value
    }
    if (ast.type === 'Tag') {
        res += `<${ast.name} `
        Object.keys(ast.attributes).forEach(key => {
            // code transformer
            res += ` ${key.toLowerCase()}`
            res += ast.attributes[key] ? `="${ast.attributes[key]}"` : ''
        })
        if (ast.isSelfClosed) {
            res += '/>'
        } else {
            res += '>'
            ast.children.forEach(child => {
                codeGenerate(child)
            })
            res += `</${ast.name}>`
        }
    }
    return res
}

let lexer = new Lexer()

const tokens = lexer.lex(str)
const ast = new Parser().parse(tokens)
const res2 = codeGenerate(ast)

console.log(res2)
