import { AST, Parser } from 'prettier';
import { parsers as tsParsers } from 'prettier/parser-typescript';
import {
  ImportName,
  ImportPath,
  mapImportPathByImportName,
  sortImportMetadata
} from './sort-angular-module';

function wrappedParse(parse: Parser<any>['parse']): Parser<any>['parse'] {
  return (text, parsers, options) => {
    const ast = parse(text, parsers, options);
    return preprocess(ast);
  };
}

function preprocess(ast: ASTBody): AST {
  const body = ast.body;
  const importPathByImportName = new Map<ImportName, ImportPath>();
  body.forEach(node => {
    switch (node.type) {
      case 'ImportDeclaration':
        mapImportPathByImportName(node, importPathByImportName);
        return;
      default:
        sortImportMetadata(node, importPathByImportName);
    }
  });
  return ast;
}

export const languages = [
  {
    name: 'sort-module-angular',
    parsers: ['typescript'],
    extensions: ['.ts'],
  },
];

export const parsers = {
  typescript: {
    ...tsParsers.typescript,
    parse: wrappedParse(tsParsers.typescript.parse),
  },
};
