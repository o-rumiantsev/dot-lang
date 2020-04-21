'use strict';

const stmtDefEnd = {
  type: 'stmtDefEnd',
  value: ';',
  match: token => token.type === 'punctuation' && token.value === ';',
};

const nodeTransitions = {
  stmtDefStart: {
    type: 'stmtDefStart',
    value: '<identifier>',
    get next() { return [attrTransitions.attrId] },
  },
};

const edgeTransitions = {
  nodeId: {
    type: 'nodeId',
    value: '<identifier>',
    get next() { return [stmtDefEnd, edgeTransitions.connection, attrTransitions.attrDefStart] },
    match: token => token.type === 'identifier',
  },

  connection: {
    type: 'connection',
    value: '[--, ->]',
    get next() { return [edgeTransitions.nodeId] },
    match: token =>
      token.type === 'operator' && ['--', '->'].includes(token.value),
  },
};

const attrTransitions = {
  attrDefStart: {
    type: 'attrDefStart',
    value: '[',
    get next() { return [attrTransitions.attrId] },
    match: token => token.type === 'punctuation' && token.value === '[',
  },

  attrDefEnd: {
    type: 'attrDefEnd',
    value: ']',
    get next() { return [stmtDefEnd] },
    match: token => token.type === 'punctuation' && token.value === ']',
  },

  attrId: {
    type: 'attrId',
    value: 'label',
    get next() { return [attrTransitions.attrAssign] },
    match: token => token.type === 'keyword' && token.value === 'label',
  },

  attrAssign: {
    type: 'attrAssign',
    value: '=',
    get next() { return [attrTransitions.attrValue] },
    match: token => token.type === 'operator' && token.value === '=',
  },

  attrValue: {
    type: 'attrValue',
    value: '<identifier>',
    get next() { return [attrTransitions.attrDefEnd] },
    match: token => token.type === 'identifier',
  },
};

const graphTransitions = {
  graphType: {
    type: 'graphType',
    value: '[graph, digraph]',
    get next() { return [graphTransitions.graphId] },
    match: token =>
      token.type === 'keyword' && ['graph', 'digraph'].includes(token.value),
  },

  graphId: {
    type: 'graphId',
    value: '<identifier>',
    get next() { return [graphTransitions.graphDefStart, graphTransitions.operation] },
    match: token => token.type === 'identifier',
  },

  graphDefStart: {
    type: 'graphDefStart',
    value: '{',
    get next() { return [graphTransitions.graphDefEnd, graphTransitions.stmt] },
    match: token => token.type === 'punctuation' && token.value === '{',
  },

  graphDefEnd: {
    type: 'graphDefEnd',
    value: '}',
    get next() { return [graphTransitions.graphType] },
    match: token => token.type === 'punctuation' && token.value === '}',
  },

  stmt: {
    type: 'stmt',
    value: '<identifier>',
    get next() { return [graphTransitions.stmt, graphTransitions.graphDefEnd] },
    match: token => token.type === 'identifier',
  },

  operation: {
    type: 'operation',
    value: '[union, remove_node, intersection]',
    get next() { return [graphTransitions.operationDefStart] },
    match: token =>
      token.type === 'operator' &&
      ['union', 'remove_node', 'intersection'].includes(token.value),
  },

  operationDefStart: {
    type: 'operationDefStart',
    value: '(',
    get next() { return [graphTransitions.operationParam1] },
    match: token => token.type === 'punctuation' && token.value === '(',
  },

  operationDefEnd: {
    type: 'operationDefEnd',
    value: ')',
    get next() { return [graphTransitions.graphType] },
    match: token => token.type === 'punctuation' && token.value === ')',
  },

  operationParam1: {
    type: 'operationParam1',
    value: '<identifier>',
    get next() { return [graphTransitions.operationParamSep] },
    match: token => token.type === 'identifier',
  },

  operationParam2: {
    type: 'operationParam2',
    value: '<identifier>',
    get next() { return [graphTransitions.operationDefEnd] },
    match: token => token.type === 'identifier',
  },

  operationParamSep: {
    type: 'operationParamSep',
    value: ',',
    get next() { return [graphTransitions.operationParam2] },
    match: token => token.type === 'punctuation' && token.value === ',',
  },
};

module.exports = {
  graph: graphTransitions,
  edge: edgeTransitions,
  node: nodeTransitions,
};
