'use strict';

const NodeStmt = require('./nodeStmt');
const EdgeStmt = require('./edgeStmt');
const Operation = require('./operation');
const { SyntaxError } = require('../errors');
const transitions = require('../transitions');

class Graph {
  constructor(type) {
    this.type = type;
    this.id = null;
    this.children = [];
    this.operation = null;
  }

  getTransformation(type) {
    if (type === 'graphId') return this.setId;
    else if (type === 'stmt') return this.setStmt;
    else if (type === 'operation') return this.setOperation;
  }

  setId(id) {
    this.id = id;
  }

  setStmt(id, lexer) {
    const token = lexer.shift();
    const Stmt = [EdgeStmt, NodeStmt].find(s => s.match(token));

    if (!Stmt) {
      throw new SyntaxError(
        transitions.edge.connection.value,
        token.value,
        token.position
      );
    }

    const stmt = new Stmt(id);
    const nextTokens = stmt.type === 'edgeStmt' ?
      transitions.edge.connection.next :
      transitions.node.stmtDefStart.next;

    stmt.parse(nextTokens, lexer);
    this.children.push(stmt);
  }

  setOperation(type, lexer) {
    const operation = new Operation(type);
    const nextTokens = transitions.graph.operation.next;

    operation.parse(nextTokens, lexer);
    this.operation = operation;

    return transitions.graph.operationParam2.next;
  }

  parse(nextTokens, lexer) {
    const token = lexer.shift();
    const nextTransition = nextTokens.find(t => t.match(token));

    if (nextTransition) {
      if (['operationDefEnd', 'graphDefEnd'].includes(nextTransition.type)) {
        return;
      }

      const transformation = this.getTransformation(nextTransition.type);
      const next = transformation &&
        transformation.call(this, token.value, lexer);

      this.parse(next || nextTransition.next, lexer);
    } else {
      throw new SyntaxError(
        nextTokens[0].value,
        token.value,
        token.position
      );
    }
  }
}

module.exports = Graph;
