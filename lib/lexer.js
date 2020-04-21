'use strict';

const { LexicalError } = require('./errors');

class Lexer {
  constructor(config, source = '') {
    this.config = config;
    this.source = source;
    this.position = 0;
  }

  recognize(source = '') {
    if (!source.length) {
      return;
    }

    for (const type of this.config.priority) {
      const match = source.match(`^${this.config[type]}`);
      if (match && match[0]) {
        return {
          type,
          value: match[0],
          position: this.position,
        };
      }
    }

    throw new LexicalError(source[0], this.position);
  }

  nextToken() {
    const token = this.recognize(this.source);
    if (token) {
      this.source = this.source.slice(token.value.length);
      this.position += token.value.length;
      return token;
    }
  }

  [Symbol.iterator]() {
    const lexer = new Lexer(this.config, this.source);
    return {
      next() {
        const token = lexer.nextToken();
        if (token) {
          return {
            done: false,
            value: token,
          };
        }
        return {
          done: true,
        };
      }
    }
  }
}

module.exports = Lexer;
