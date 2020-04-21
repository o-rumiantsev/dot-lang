'use strict';

const stmtDefEnd = {
  type: 'stmtDefEnd',
  match: token => token.type === 'punctuation' && token.value === ';',
};

const nodeTransitions = {
  stmtDefStart: {
    type: 'stmtDefStart',
    get next() { return [attrTransitions.attrId, stmtDefEnd] },
  },
};

const edgeTransitions = {
  nodeId: {
    type: 'nodeId',
    get next() { return [edgeTransitions.connection, attrTransitions.attrDefStart, stmtDefEnd] },
    match: token => token.type === 'identifier',
  },

  connection: {
    type: 'connection',
    get next() { return [edgeTransitions.nodeId] },
    match: token =>
      token.type === 'operator' && ['--', '->'].includes(token.value),
  },
};

const attrTransitions = {
  attrDefStart: {
    type: 'attrDefStart',
    get next() { return [attrTransitions.attrId] },
    match: token => token.type === 'punctuation' && token.value === '[',
  },

  attrDefEnd: {
    type: 'attrDefEnd',
    get next() { return [stmtDefEnd] },
    match: token => token.type === 'punctuation' && token.value === ']',
  },

  attrId: {
    type: 'attrId',
    get next() { return [attrTransitions.attrAssign] },
    match: token => token.type === 'keyword' && token.value === 'label',
  },

  attrAssign: {
    type: 'attrAssign',
    get next() { return [attrTransitions.attrValue] },
    match: token => token.type === 'operator' && token.value === '=',
  },

  attrValue: {
    type: 'attrValue',
    get next() { return [attrTransitions.attrDefEnd] },
    match: token => token.type === 'identifier',
  },
};

const graphTransitions = {
  graphType: {
    type: 'graphType',
    get next() { return [graphTransitions.graphId] },
    match: token =>
      token.type === 'keyword' && ['graph', 'digraph'].includes(token.value),
  },

  graphId: {
    type: 'graphId',
    get next() { return [graphTransitions.operation, graphTransitions.graphDefStart] },
    match: token => token.type === 'identifier',
  },

  graphDefStart: {
    type: 'graphDefStart',
    get next() { return [graphTransitions.stmt, graphTransitions.graphDefEnd] },
    match: token => token.type === 'punctuation' && token.value === '{',
  },

  graphDefEnd: {
    type: 'graphDefEnd',
    match: token => token.type === 'punctuation' && token.value === '}',
  },

  stmt: {
    type: 'stmt',
    get next() { return [graphTransitions.stmt, graphTransitions.graphDefEnd] },
    match: token => token.type === 'identifier',
  },

  operation: {
    type: 'operation',
    get next() { return [graphTransitions.operationDefStart] },
    match: token =>
      token.type === 'operator' &&
      ['union', 'remove_node', 'intersection'].includes(token.value),
  },

  operationDefStart: {
    type: 'operationDefStart',
    get next() { return [graphTransitions.operationParam1] },
    match: token => token.type === 'punctuation' && token.value === '(',
  },

  operationDefEnd: {
    type: 'operationDefEnd',
    get next() { return [graphTransitions.graphType] },
    match: token => token.type === 'punctuation' && token.value === ')',
  },

  operationParam1: {
    type: 'operationParam1',
    get next() { return [graphTransitions.operationParamSep] },
    match: token => token.type === 'identifier',
  },

  operationParam2: {
    type: 'operationParam2',
    get next() { return [graphTransitions.operationDefEnd] },
    match: token => token.type === 'identifier',
  },

  operationParamSep: {
    type: 'operationParamSep',
    get next() { return [graphTransitions.operationParam2] },
    match: token => token.type === 'punctuation' && token.value === ',',
  },
};

module.exports = {
  graph: graphTransitions,
  edge: edgeTransitions,
  node: nodeTransitions,
};
