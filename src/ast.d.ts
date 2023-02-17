export interface Position {
  line: number;
  column: number;
}

export type AstNode =
    | CallExpression
    | ImportDeclaration
    | AstBody
    // | Program
    // | ClassDeclaration
    | CallExpression
    | ImportDeclaration
    | Property
    // | Identifier
    | Decorator
    // | ObjectExpression
    // | ArrayExpression
    | ImportDefaultSpecifier
    | ImportSpecifier
    | Argument
    | Source
    | Declaration
    | AstTree
    | Value;

export interface NodeBase {
  type: AstNode['type'];
  range: [number, number];
  loc: { start: Position; end: Position };
}

export interface NodeBaseWithName extends NodeBase {
  name: string;
}

export interface Value extends NodeBase {
  type: 'Value';
  elements?: (NodeBaseWithName | CallExpression)[];
}

export interface Property extends NodeBase {
  type: 'Property';
  key: NodeBaseWithName;
  value: Value;
}

export interface Argument extends NodeBase {
  type: 'Argument';
  properties: Property[];
}

export interface CallExpression extends NodeBase {
  type: 'CallExpression';
  callee: { name: 'NgModule' | string; object: NodeBaseWithName };
  arguments: Argument[];
}

export interface Decorator extends NodeBase {
  type: 'Decorator';
  expression: CallExpression;
}

export interface Declaration extends NodeBase {
  type: 'Declaration';
  decorators: Decorator[];
}

export interface Source extends NodeBase {
  type: 'Source';
  value: string;
}

export interface ImportSpecifier extends NodeBase {
  type: 'ImportSpecifier';
  imported: NodeBaseWithName;
}

export interface ImportDeclaration extends NodeBase {
  type: 'ImportDeclaration';
  source: Source;
  specifiers: (ImportSpecifier | ImportDefaultSpecifier)[];
}

export interface ImportDefaultSpecifier extends NodeBase {
  type: 'ImportDefaultSpecifier';
  local: NodeBaseWithName;
}

export interface AstTree extends NodeBase {
  type: 'AstTree';
  body: AstBody[];
}
export interface AstBody extends NodeBase {
  type: 'AstBody';
  declaration: Declaration;
}
