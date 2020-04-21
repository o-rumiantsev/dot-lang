'use strict';

class EdgeStmt {
  constructor(nodeId) {
    this.type = 'edgeStmt';
    this.edgeList = [];
    this.attrList = [];

    this.edgeList.push({ type: 'nodeId', id: nodeId });
  }

  static match(token) {
    return token.type === 'operator' && ['--', '->'].includes(token.value);
  }

  getTransformation(type) {
    if (type === 'nodeId') return this.addNode;
    if (type === 'attrValue') return this.addAttr;
  }

  addNode(id) {
    this.edgeList.push({ type: 'nodeId', id });
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
      transformation && transformation.bind(this)(token.value);
      this.parse(nextTransition.next, lexer);
    } else {
      throw new SyntaxError(token.value, token.position);
    }
  }
}

module.exports = EdgeStmt;