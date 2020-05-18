'use strict';

const OperationAnalyser = require('./operation-analyser');

class RemoveNodeAnalyser extends OperationAnalyser {
  analyse(operation) {
    super.analyse(operation);
    
    const graphId = operation.params[0].id;
    const nodeId = operation.params[1].id;

    const graph = this.graphs[graphId];
    const nodeExists = !!graph.nodes[nodeId];
    if (!nodeExists) {
      throw Error(`Node "${nodeId}" does not exist in graph ${graphId}`);
    }

    const nodes = { ...graph.nodes };
    delete nodes[nodeId];

    const edges = Object.fromEntries(
      Object.entries(graph.edges)
        .filter(([, edge]) => !edge.nodes.includes(nodeId))
    );

    return {
      nodes,
      edges,
    };
  }
}

module.exports = RemoveNodeAnalyser;
