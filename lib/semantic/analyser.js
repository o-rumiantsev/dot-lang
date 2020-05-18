'use strict';

const {
  TYPE_DIGRAPH,
  TYPE_NODE_STMT,
} = require('./constants');
const NodeAnalyser = require('./statement/node-analyser');
const EdgeAnalyser = require('./statement/edge-analyser');
const operationAnalysers = {
  union: require('./operation/union-analyser'),
  remove_node: require('./operation/remove-node-analyser'),
  intersection: require('./operation/intersection-analyser'),
}

class Ananlyser {
  constructor(ast) {
    this.graphs = {};
    ast.forEach(graph => this.analyse(graph));
  }

  analyse(graph) {
    const graphType = graph.type === TYPE_DIGRAPH
      ? 'Digraph'
      : 'Graph';

    if (this.graphs[graph.id]) {
      throw new Error(`${graphType} "${graph.id}" is already declared`)
    }

    if (!graph.children.length && !graph.operation) {
      throw new Error(`${graphType} "${graph.id}" is empty`);
    }

    const graphData = {};
    if (graph.children.length) {
      const { nodes, edges } = Ananlyser.analyseChildren(graph);
      graphData.nodes = nodes;
      graphData.edges = edges;
    } else {
      const { nodes, edges } = Ananlyser.analyseOperation(graph, this.graphs);
      graphData.nodes = nodes;
      graphData.edges = edges;
    }

    this.graphs[graph.id] = {
      id: graph.id,
      type: graphType,
      ...graphData,
    }
  }

  static analyseChildren(graph) {
    const nodeAnalyser = new NodeAnalyser();
    const edgeAnalyser = new EdgeAnalyser(graph);
    
    for (const child of graph.children) {
      if (child.type === TYPE_NODE_STMT) {
        nodeAnalyser.analyse(child);
      } else {
        edgeAnalyser.analyse(child);
      }
    }

    return {
      nodes: {
        ...edgeAnalyser.nodes,
        ...nodeAnalyser.nodes,
      },
      edges: edgeAnalyser.edges,
    };
  }

  static analyseOperation(graph, graphs) {
    const OperationAnalyser = operationAnalysers[graph.operation.type];
    const analyser = new OperationAnalyser(graphs);
    return analyser.analyse(graph.operation);
  }
}

module.exports = Ananlyser
