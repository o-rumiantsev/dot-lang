'use strict';

const { SyntaxError } = require('../errors');

class NodeStmt {
  constructor(nodeId) {
    this.type = 'nodeStmt';
    this.nodeId = { type: 'nodeId', id: nodeId };
    this.attrList = [];
  }

  static match(token) {
    return (token.type === 'punctuation' && token.value === '[') ||
      (token.type === 'punctuation' && token.value === ';');
  }

  getTransformation(type) {
    if (type === 'attrValue') return this.addAttr;
  }

  addAttr(value) {
    this.attrList.push({ type: 'attr', id: 'label', value });
  }

  parse(nextTokens, lexer) {
    const token = lexer.shift();
    const nextTransition = nextTokens.find(t => t.match(token));

    if (nextTransition) {
      if (nextTransition.type === 'stmtDefEnd') {
        return;
      }

      const transformation = this.getTransformation(nextTransition.type);
      transformation && transformation.call(this, token.value);
      this.parse(nextTransition.next, lexer);
    } else {
      throw new SyntaxError(
        nextTokens[0].value,
        token.value,
        token.position
      );
    }
  }
}

module.exports = NodeStmt;
