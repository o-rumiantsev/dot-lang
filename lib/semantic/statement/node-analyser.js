'use strict';

const getAttributes = attrList => Object.fromEntries(
  attrList.map(attr => [attr.id, attr.value])
);  

class NodeAnalyser {
  constructor() {
    this.nodes = {};
  }

  analyse(nodeStmt) {
    if (this.nodes[nodeStmt.nodeId.id]) {
      throw new Error(`Node "${nodeStmt.nodeId.id}" is already declared`)
    }

    this.nodes[nodeStmt.nodeId.id] = getAttributes(nodeStmt.attrList);
  }
}

module.exports = NodeAnalyser;
