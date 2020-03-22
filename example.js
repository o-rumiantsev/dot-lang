'use strict';

const { Token, Lexer, tokens } = require('.');

const config = {
  'one-line-comment': new Token('//.*'),
  'multi-line-comment': new Token('/\\*')
    .concat(
      new Token('[^\\*/]')
        .or(tokens.CR)
        .or(tokens.LF)
        .or(tokens.CRLF)
        .mod('*')
    )
    .concat(new Token('\\*/')),
  keyword: new Token('graph').or('digraph'),
  identifier: tokens.UNDERSCORE.or(tokens.LETTER).concat(
    tokens.UNDERSCORE
      .or(tokens.LETTER)
      .or(tokens.DIGIT)
      .mod('*')
  ),
  punctuation: tokens.DOT
    .or(tokens.COMMA)
    .or(tokens.COLON)
    .or(tokens.SEMICOLON)
    .or(tokens.ROUND_BRACKET_LEFT)
    .or(tokens.ROUND_BRACKET_RIGHT)
    .or(tokens.CURLY_BRACKET_LEFT)
    .or(tokens.CURLY_BRACKET_RIGHT)
    .or(tokens.SQUARE_BRACKET_LEFT)
    .or(tokens.SQUARE_BRACKET_RIGHT)
    .or(tokens.ANGLE_BRACKET_LEFT)
    .or(tokens.ANGLE_BRACKET_RIGHT),
  operator: tokens.ASSIGN
    .or(tokens.ARROW_LEFT)
    .or(tokens.DASH.concat(tokens.DASH)),
  priority: [
    'multi-line-comment',
    'one-line-comment',
    'keyword',
    'identifier',
    'operator',
    'punctuation',
  ],
};

const lexer = new Lexer(config, `
// This is definition of digraph
digraph A {
  /*
   This is definition of
   directed edge 
  */
  a -> b;
  b -> c;
}

graph B {
  a, b, c /* this is shorthand */ -- d;
}
`);

for (const token of lexer) {
  console.log(token);
}




