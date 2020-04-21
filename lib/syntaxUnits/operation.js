'use strict';

const { SyntaxError } = require('../errors');

class Operation {
  constructor(type) {
    this.type = type;
    this.params = [];
  }

  getTransformation(type) {
    if (type === 'operationParam1' || type === 'operationParam2') {
      return this.addParam(type);
    }
  }

  addParam(type) {
    const addParam = id => {
      if (this.type === 'remove_node' && type === 'operationParam2') {
        this.params.push({ type: 'nodeId', id });
      } else {
        this.params.push({ type: 'graphId', id });
      }
    };

    return addParam.bind(this);
  }

  parse(nextTokens, lexer) {
    const token = lexer.shift();
    const nextTransition = nextTokens.find(t => t.match(token));

    if (nextTransition) {
      const transformation = this.getTransformation(nextTransition.type);
      transformation && transformation.call(this, token.value);

      if (nextTransition.type !== 'operationParam2') {
        this.parse(nextTransition.next, lexer);
      }
    } else {
      throw new SyntaxError(
        nextTokens[0].value,
        token.value,
        token.position
      );
    }
  }
}

module.exports = Operation;
