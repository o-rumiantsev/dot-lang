'use strict';

class Lexer {
  constructor(config, source = '') {
    this.config = config;
    this.source = source.trim();
  }

  recognize(source = '') {
    let offset = 0;
    while (source.length) {
      for (const type of this.config.priority) {
        const match = source.match(`^${this.config[type]}`);
        if (match) {
          return {
            type,
            value: match[0],
            index: match.index + offset,
          };
        }
      }
      source = source.slice(1);
      offset += 1;
    }
  }

  nextToken() {
    const token = this.recognize(this.source);
    if (token) {
      this.source = this.source.slice(
        token.index + token.value.length
      );
      return {
        type: token.type,
        value: token.value,
      };
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