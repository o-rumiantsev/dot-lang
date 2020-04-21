'use strict';

class LexicalError extends Error {
  constructor(character, position) {
    super(`Unexpected character "${character}" at position ${position}`);
  }
}

class SyntaxError extends Error {
  constructor(character, position) {
    super(`Unexpected character "${character}" at position ${position}`);
  }
}

module.exports = {
  LexicalError,
  SyntaxError,
};
