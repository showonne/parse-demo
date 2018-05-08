
class Token {
    constructor(type, text){
        this.type = type
        this.text = text
    }
    toString(){
        return this.text
    }
}

Token.PLUS = 'PLUS'
Token.INT = 'INT'

class AST {
    constructor(token = null){
        this.token = token
    }
    addChild(t){
        if(this.children === undefined){
            this.children = []
        }
        this.children.push(t)
    }
    getNodeType(){
        return this.token.type
    }
    isNil(){
        return this.token == null
    }
    toString(){
        return this.token.text
    }
    toStringTree(){
        if(this.children == null || this.children.length === 0){
            return ''
        }
        let res = []
        if(!this.isNil()){
            res.push('(')
            res.push(this.toString())
            res.push(' ')
        }
        for(let i = 0; i < this.children.length; i++){
            let t = this.children[i]
            if(i > 0) res.push(' ')
            res.push(t.toString())
        }
        if(!this.isNil()){
            res.push(')')
        }
        return res.join('')
    }
}

let plus = new Token(Token.PLUS, '+')
let one = new Token(Token.INT, '1')
let two = new Token(Token.INT, '2')

let root = new AST(plus)
root.addChild(new AST(one))
root.addChild(new AST(two))

  console.log(root.toStringTree())

let list = new AST()
list.addChild(new AST(one))
list.addChild(new AST(two))
console.log(list.toStringTree())