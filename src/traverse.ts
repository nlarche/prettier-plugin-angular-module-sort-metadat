import { AstNode, CallExpression } from './ast';

type VisitNodeFunction<N extends AstNode> = (node: N) => void;

type TraverseOption = {
  [Type in AstNode['type']]?: VisitNodeFunction<Extract<AstNode, { type: Type }>>;
};

function getObjectKeys<T extends Object>(object: T) {
  return Object.keys(object) as Array<keyof T>;
}

const skippedKeys = ['loc', 'range', 'type'];
function traverseNodes(parent: AstNode, options: TraverseOption) {
  if (!parent.type) {
    return;
  }
  const visitor = options[parent.type] as VisitNodeFunction<AstNode>;
  if (visitor && typeof visitor === 'function') {
    visitor(parent);
  }

  for (let key of getObjectKeys(parent)){
    if (key in skippedKeys) continue;
    const childNode = parent[key] as unknown as AstNode;
    if (childNode) {
      traverse(childNode, options);
    }
  }
}
export function traverse(astNodes: AstNode | AstNode[], options: TraverseOption) {
  if (Array.isArray(astNodes)) {
    astNodes.forEach(node => traverseNodes(node, options));
  } else {
    traverseNodes(astNodes, options);
  }
}
