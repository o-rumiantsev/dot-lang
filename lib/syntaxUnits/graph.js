'use strict';

const NodeStmt = require('./nodeStmt');
const EdgeStmt = require('./edgeStmt');
const Operation = require('./operation');
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
}

module.exports = Graph;
