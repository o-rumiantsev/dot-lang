'use strict';

class LexicalError extends Error {
  constructor(character, position) {
    super(`Unexpected character "${character}" at position ${position}`);
  }
}

class SyntaxError extends Error {
  constructor(expectedToken, foundToken, position) {
    super(
      `Unexpected token at position ${position}: expected "${expectedToken}", found "${foundToken}"`
    );
  }
}

module.exports = {
  LexicalError,
  SyntaxError,
};
