'use strict';

class Token {
  constructor(base, modifier = '') {
    this.body = base.trim();
    this.modifier = modifier;
  }

  or(token) {
    const otherBase = typeof token === 'string' ? token : token.body;
    const otherBody = otherBase.trim();
    return new Token(this.body + '|' + otherBody);
  }

  concat(token) {
    const other = typeof token === 'string' ? new Token(token) : token;
    return new Token(this + other);
  }

  mod(modifier) {
    return new Token(this.body, modifier);
  }

  toString() {
    return `(${this.body})${this.modifier}`;
  }
}

module.exports = Token;
