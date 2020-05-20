'use strict';

const transformGraph = graph => {
  Object.values(graph.nodes).forEach(node => {
    if (node.hasOwnProperty('default')) {
      delete node.default;
    }
  });

  const edges = Object.values(graph.edges).map(({ nodes, label, directed }) =>
    label ?
      ({ source: nodes[0], target: nodes[1], directed }) :
      ({ source: nodes[0], target: nodes[1], directed, label })
  );

  return { ...graph, edges };
};

const jsonGenerator = analyserGraphs => {
  const graphs = Object.values(analyserGraphs).map(transformGraph);
  return JSON.stringify({ graphs });
};

module.exports = jsonGenerator;
