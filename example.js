'use strict';

const {
  Token,
  Lexer,
  Syntaxer,
  Analyser,
  jsonGenerator,
  tokens,
} = require('.');

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
  keyword: new Token('graph')
    .or('digraph')
    .or('label'),
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
    .or(tokens.SQUARE_BRACKET_RIGHT),
  operator: tokens.ASSIGN
    .or(tokens.ARROW_LEFT)
    .or(tokens.DASH.concat(tokens.DASH))
    .or('remove_node')
    .or('union')
    .or('intersection'),
  whitespace: new Token('\\s').mod('*'),
  priority: [
    'multi-line-comment',
    'one-line-comment',
    'keyword',
    'operator',
    'identifier',
    'punctuation',
    'whitespace',
  ],
};

const lexer = new Lexer(config, `
// This is definition of digraph
digraph A {
  /*
   This is definition of
   directed edge 
  */
  a [label=nodeA];
  a -> b [label=done];
  b -> c -> d -> b;
}

digraph B {
  a /* edge in  */ -> b;
  a -> e;
}

graph C intersection(A, B)
`);

const syntaxer = new Syntaxer([...lexer]);
const ast = syntaxer.parse();
const analyser = new Analyser(ast);
const jsonGraphs = jsonGenerator(analyser.graphs);

console.dir(JSON.parse(jsonGraphs), { depth: null });
