'use strict';

const OperationAnalyser = require('./operation-analyser');

class UnionAnalyser extends OperationAnalyser {
  analyse(operation) {
    super.analyse(operation);
    const graphs = operation.params.map(param => this.graphs[param.id]);
    
    OperationAnalyser.checkTypes('union', graphs);

    const nodes = UnionAnalyser.mergeNodes(graphs);
    const edges = UnionAnalyser.mergeEdges(graphs);

    return {
      nodes,
      edges,
    };
  }

  static mergeNodes(graphs) {
    const labeledNodes = graphs.reduce((nodes, graph) => {
      Object.entries(graph.nodes)
        .forEach(([id, node]) => !node.default && (nodes[id] = node));
      return nodes;
    }, {});

    return {
      ...graphs[0].nodes,
      ...graphs[1].nodes,
      ...labeledNodes,
    };
  }

  static mergeEdges(graphs) {
    const edges = { ...graphs[0].edges };
    for (const key in graphs[1].edges) {
      const edge = graphs[1].edges[key];
      const reverseKey = edge.nodes.map(node => node).reverse()
        .join(edge.directed ? ' -> ' : ' -- ');
      
      const reversed = !!edges[reverseKey];
      if (reversed) {
        throw Error(`Edge "${key}" is reversed "${reverseKey}"`);
      }

      edges[key] = { ...edges[key], ... edge };
    }
    return edges;
  }
}

module.exports = UnionAnalyser;
