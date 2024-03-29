import { AST, Parser } from 'prettier';
import { parsers as tsParsers } from 'prettier/parser-typescript';
import { ImportName, ImportPath, mapImportPathByImportName, sortImportMetadata } from './sort-angular-module';
import { AstNode, AstTree, CallExpression, ImportDeclaration, ImportSpecifier } from './ast';
import { traverse } from './traverse';

function wrappedParse(parse: Parser<any>['parse']): Parser<any>['parse'] {
  return (text, parsers, options) => {
    const ast = parse(text, parsers, options);
    return preprocess(ast);
  };
}

function preprocess(ast: AstTree): AST {
  const body = ast.body;
  let importPathByImportName = new Map<ImportName, ImportPath>();
  traverse(body, {
    ImportDeclaration(node: ImportDeclaration) {
      importPathByImportName = new Map([
        ...importPathByImportName.entries(),
        ...mapImportPathByImportName(node).entries()
      ]);
    },
    CallExpression(node: CallExpression) {
      sortImportMetadata(node, importPathByImportName);
    },
  });

  return ast;
}

export const parsers = {
  typescript: {
    ...tsParsers.typescript,
    parse: wrappedParse(tsParsers.typescript.parse),
  },
};
