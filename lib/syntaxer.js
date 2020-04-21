'use strict';

const { SyntaxError } = require('./errors');
const Graph = require('./syntaxUnits/graph');
const transitions = require('./transitions');

class Syntaxer {
  constructor(lexer) {
    this.ast = [];
    this.lexer = lexer.filter(token =>
      ![
        'one-line-comment',
        'multi-line-comment',
        'whitespace'
      ].includes(token.type)
    );
  }

  parse() {
    const token = this.lexer.shift();

    if (!token) {
      return this.ast;
    }

    if (transitions.graph.graphType.match(token)) {
      const graph = new Graph(token.value);
      graph.parse(transitions.graph.graphType.next, this.lexer);
      this.ast.push(graph);
      return this.parse();
    } else {
      throw new SyntaxError(
        transitions.graph.graphType.value,
        token.value,
        token.position
      );
    }
  }
}

module.exports = Syntaxer;
