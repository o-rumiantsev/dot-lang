'use strict';

const Token = require('./lib/token');
const Lexer = require('./lib/lexer');
const Syntaxer = require('./lib/syntaxer');
const Analyser = require('./lib/semantic/analyser');

const tokens = {
  ANY: new Token('.'),

  UNDERSCORE: new Token('_'),
  LETTER: new Token('[a-zA-Z]'),
  DIGIT: new Token('[0-9]'),

  ASSIGN: new Token('='),
  ARROW_LEFT: new Token('\\->'),
  ARROW_RIGHT: new Token('<\\-'),
  DASH: new Token('\\-'),

  COLON: new Token(':'),
  SEMICOLON: new Token(';'),
  DOT: new Token('\\.'),
  COMMA: new Token(','),
  ROUND_BRACKET_LEFT: new Token('\\('),
  ROUND_BRACKET_RIGHT: new Token('\\)'),
  CURLY_BRACKET_LEFT: new Token('{'),
  CURLY_BRACKET_RIGHT: new Token('}'),
  SQUARE_BRACKET_LEFT: new Token('\\['),
  SQUARE_BRACKET_RIGHT: new Token('\\]'),
  ANGLE_BRACKET_LEFT: new Token('<'),
  ANGLE_BRACKET_RIGHT: new Token('>'),

  CR: new Token('\\r'),
  LF: new Token('\\n'),
  CRLF: new Token('\\r\\n'),
};

module.exports = {
  Token,
  Lexer,
  Syntaxer,
  Analyser,
  tokens,
};
