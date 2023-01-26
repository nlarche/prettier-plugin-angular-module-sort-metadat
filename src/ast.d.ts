interface Position {
  line: number;
  column: number;
}
interface NodeBase {
  type:
    | 'Program'
    | 'ClassDeclaration'
    | 'CallExpression'
    | 'ImportDeclaration'
    | 'Property'
    | 'Identifier'
    | 'Decorator'
    | 'ObjectExpression'
    | 'ArrayExpression';
  range: [number, number];
  loc: { start: Position; end: Position };
}

interface NodeBaseWithName extends NodeBase {
  name: string;
}

interface Value extends NodeBase {
  elements: (NodeBaseWithName | CallExpression)[];
}

interface Property extends NodeBase {
  key: NodeBaseWithName;
  value: Value;
}

interface Argument extends NodeBase {
  properties: Property[];
}

interface CallExpression extends NodeBase {
  callee: { name: 'NgModule' | string; object: NodeBaseWithName };
  arguments: Argument[];
}

interface Decorator extends NodeBase {
  expression: CallExpression;
}

interface Declaration extends NodeBase {
  decorators: Decorator[];
}

interface Source extends NodeBase {
  value: string;
}

interface Specifier extends NodeBase {
  imported: NodeBaseWithName;
}

interface ImportDeclaration extends NodeBase {
  source: Source;
  specifiers: Specifier[];
}

interface ASTBody extends NodeBase {
  body: ASTNode[];
}
interface ASTNode extends NodeBase {
  declaration: Declaration;
}
