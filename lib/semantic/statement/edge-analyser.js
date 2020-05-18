'use strict';

const { TYPE_DIGRAPH } = require('../constants');

const pairify = edgeList => {
  const edges = [];
  if (edgeList.length > 2) {
    for (let i = 0; i < edgeList.length - 1; ++i) {
      const curr = edgeList[i];
      const next = edgeList[i + 1];
      edges.push([curr, next]);
    }
  } else {
    edges.push(edgeList);
  }
  return edges;
};

const getKey = (edge, directed) => edge.map(node => node.id)
  .join(directed ? ' -> ' : ' -- ');

const getReverseKey = (edge, directed) => edge.map(node => node.id)
  .reverse()
  .join(directed ? ' -> ' : ' -- ');

const getAttributes = attrList => Object.fromEntries(
  attrList.map(attr => [attr.id, attr.value])
);  

class EdgeAnalyser {
  constructor(graph) {
    this.graph = graph;
    this.nodes = {};
    this.edges = {};
  }

  analyse(edgeStmt) {
    if ((this.graph.type === TYPE_DIGRAPH) !== edgeStmt.directed) {
      const [graphType, edgeType] = this.graph.type === TYPE_DIGRAPH
        ? ['Digraph', 'undirected']
        : ['Graph', 'directed'];
      throw new Error(
        `${graphType} "${this.graph.id}" contains ${edgeType} edges`
      );
    }

    if (edgeStmt.edgeList.length > 2 && edgeStmt.attrList.length) {
      throw new Error('Cannot assign attributes to multinode edge statements');
    }

    const edges = pairify(edgeStmt.edgeList);
    for (const edge of edges) {
      const key = getKey(edge, edgeStmt.directed);
      const duplicated = !!this.edges[key];
      if (duplicated) {
        throw new Error(`Edge "${key}" is already declared`);
      }

      const reverseKey = getReverseKey(edge, edgeStmt.directed);
      const reversed = !!this.edges[reverseKey];
      if (reversed) {
        throw new Error(`Edge "${key}" is reversed "${reverseKey}"`);
      }

      const nodes = edge.map(node => node.id);
      const attributes = getAttributes(edgeStmt.attrList);

      this.edges[key] = {
        nodes,
        directed: edgeStmt.directed,
        ...attributes,
      };

      nodes.forEach(id => this.nodes[id] = { label: id, default: true });
    }
  }
}

module.exports = EdgeAnalyser;
