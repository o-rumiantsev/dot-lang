'use strict';

const OperationAnalyser = require('./operation-analyser');

class IntersectionAnalyser extends OperationAnalyser {
  analyse(operation) {
    super.analyse(operation);
    const graphs = operation.params.map(param => this.graphs[param.id]);
    
    OperationAnalyser.checkTypes('intersection', graphs);

    const nodes = IntersectionAnalyser.intersectNodes(graphs);
    const edges = IntersectionAnalyser.intersectEdges(graphs);

    return {
      nodes,
      edges,
    };
  }

  static intersectNodes(graphs) {
    const nodes = {};

    Object.keys(graphs[0].nodes)
      .concat(Object.keys(graphs[1].nodes))
      .forEach(nodeId => {
        const isCommon = graphs.every(graph => !!graph.nodes[nodeId]);
        if (isCommon) {
          const overwrittenAttributes = [
            graphs[0].nodes[nodeId], 
            graphs[1].nodes[nodeId]
          ].reduce(
            (acc, cur) => cur.default 
              ? { ...acc }
              : { ...acc, ...cur }, 
            {}
          );
          nodes[nodeId] = {
            ...graphs[0].nodes[nodeId],
            ...graphs[1].nodes[nodeId],
            ...overwrittenAttributes,
          };
          if (Object.keys(overwrittenAttributes).length) {
            delete nodes[nodeId].default;
          }
        }
      });

    return nodes;
  }

  static intersectEdges(graphs) {
    const edges = {};

    Object.keys(graphs[0].edges)
      .concat(Object.keys(graphs[1].edges))
      .forEach(key => {
        const isCommon = graphs.every(graph => !!graph.edges[key]);
        if (isCommon) {
          edges[key] = {
            ...graphs[0].edges[key],
            ...graphs[1].edges[key],
          };
        }
      });

    return edges;
  }
}

module.exports = IntersectionAnalyser;
