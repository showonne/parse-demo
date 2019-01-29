const Token = require('./token')

const State = require('./state')

const TAG_OPEN = /^<([a-zA-Z][\w\-.]*)\s*/
const TAG_ATTRIBUTE = /^([-0-9a-zA-Z]+)(=('([^']*)'|"([^"]*)"))?\s*/
const TAG_END = /^(\/?)>/
const TAG_CLOSE = /^<\/([a-zA-Z][\w\-.]*)>/
/* eslint-disable no-control-regex */
const TEXT = /^[^\x00|<]/
/* eslint-enable */
const WHITE_SPACE = /^\s+/

const EXPRESSION_OPEN = /^\{#(\w+)\s+(.*)\}/
const EXPRESSION_END = /^\{\/(\w+)\s*\}/

const pattern = {
    TAG_OPEN,
    TAG_ATTRIBUTE,
    TAG_END,
    TAG_CLOSE,
    TEXT,
    WHITE_SPACE,
    EXPRESSION_OPEN,
    EXPRESSION_END
}

class Lexer {
    constructor () {
        this.tokens = []
        this.index = 0
        this.state = new State()
        this.state.enter('start')
    }
    match (type) {
        if (!pattern[type]) return
        return pattern[type].exec(this.input)
    }
    lex (input) {
        this.input = input
        let token = this.advance()
        while (token && token.type !== 'EOF') {
            this.tokens.push(token)
            token = this.advance()
        }
        this.tokens.push(new Token('EOF'))
        return this.tokens
    }
    advance () {
        const token =
            this.eof() ||
            this.expressionOpen() ||
            this.expressionEnd() ||
            this.whitespace() ||
            this.tagOpen() ||
            this.attribute() ||
            this.tagEnd() ||
            this.tagClose() ||
            this.text()

        return token
    }
    eof () {
        if (this.input.length > 0) return
        return new Token('EOF')
    }
    expressionOpen () {
        const matched = this.match('EXPRESSION_OPEN');

        if (matched) {
            this.state.enter('exprOpen')
            this.input = this.input.slice(matched[0].length)
            return new Token('EXPRESSION_OPEN', {
                type: matched[1],
                expr: matched[2]
            });
        }
    }
    expressionEnd () {
        if (!this.state.is('exprOpen')) return
        const matched = this.match('EXPRESSION_END');

        if (matched) {
            this.input = this.input.slice(matched[0].length)
            return new Token('EXPRESSION_END', {
                type: matched[1]
            });
        }
    }
    whitespace () {
        const matched = this.match('WHITE_SPACE')

        if (matched) {
            this.input = this.input.slice(matched[0].length)
            return new Token('WHITE_SPACE', matched[0])
        }
    }
    tagOpen () {
        const matched = this.match('TAG_OPEN')
        if (matched) {
            this.state.enter('tagOpen')
            this.input = this.input.slice(matched[0].length)
            return new Token('TAG_OPEN', matched[1])
        }
    }
    attribute () {
        if (!this.state.is('tagOpen')) return

        const matched = this.match('TAG_ATTRIBUTE')

        if (matched) {
            this.input = this.input.slice(matched[0].length)
            return new Token('TAG_ATTRIBUTE', {name: matched[1], value: matched[4] || matched[5]})
        }
    }
    tagEnd () {
        if (!this.state.is('tagOpen')) return

        const matched = this.match('TAG_END')

        if (matched) {
            this.state.leave('tagOpen')
            this.input = this.input.slice(matched[0].length)
            var isSelfClosed = !!matched[1]
            return new Token('TAG_END', {isSelfClosed})
        }
    }
    tagClose () {
        const matched = this.match('TAG_CLOSE')
        if (matched) {
            this.input = this.input.slice(matched[0].length)
            return new Token('TAG_CLOSE', matched[1])
        }
    }
    text () {
        if (this.state.is('tagOpen')) return

        const matched = this.match('TEXT')
        if (matched) {
            let str = matched[0];
            this.input = this.input.slice(matched[0].length);

            let rest;
            while (rest = this.match('TEXT')) {
                str += rest[0];
                this.input = this.input.slice(rest[0].length);
            }

            return new Token('TEXT', str)
        }
    }
}

// for test
const str = `texto ~
<div Class="wrapper" id='root'>
    <h1>I'm h1 tag</h1>
    <input />
</div>
`

let lexer = new Lexer()
const res = lexer.lex(str)
console.log(res)

module.exports = Lexer
