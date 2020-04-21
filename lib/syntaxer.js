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
      this.parseGraph(transitions.graph.graphType.next, graph);
      this.ast.push(graph);
      return this.parse();
    } else {
      throw new SyntaxError(token.value, token.position);
    }
  }

  parseGraph(nextTokens, graph) {
    const token = this.lexer.shift();
    const nextTransition = nextTokens.find(t => t.match(token));

    if (nextTransition) {
      if (['operationDefEnd', 'graphDefEnd'].includes(nextTransition.type)) {
        return;
      }

      const transformation = graph.getTransformation(nextTransition.type);
      const next = transformation &&
        transformation.bind(graph)(token.value, this.lexer);

      this.parseGraph(next || nextTransition.next, graph);
    } else {
      throw new SyntaxError(token.value, token.position);
    }
  }
}

module.exports = Syntaxer;
