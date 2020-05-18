'use strict';

const { TYPE_GRAPH_ID } = require('../constants');

class OperationAnalyser {
  constructor(graphs) {
    this.graphs = graphs;
  }

  analyse(operation) {
    for (const param of operation.params) {
      if (param.type === TYPE_GRAPH_ID && !this.graphs[param.id]) {
        throw Error(`Unresolved reference: ${param.id}`);
      }
    }
  }

  static checkTypes(opType, graphs) {
    const types = graphs.map(graph => graph.type);
    const compatible = types.every(type => type === types[0]);
    if (!compatible) {
      throw Error(`Incompatible types - ${types.join(` ${opType} `)}`);
    }
  }
}

module.exports = OperationAnalyser;
