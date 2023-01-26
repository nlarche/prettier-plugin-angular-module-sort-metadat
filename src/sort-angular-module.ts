const angularModule = '@angular';
const customModule = '@custom' as const;
const appModule = 'app' as const;
export type GroupName = typeof angularModule| typeof customModule| typeof appModule;
export type Element = NodeBaseWithName | CallExpression;
export type ImportName = string;
export type ImportPath = string;


function updateMapGroup(group: Map<GroupName, Element[]>, element: Element, groupName: GroupName) {
  const values = group.get(groupName)!;
  values.push(element);
  group.set(groupName, values);
}

function sortElementByFroup(group: Map<GroupName, Element[]>, name: GroupName): Element[] {
  const values = group.get(name);
  if (values) {
    return values.sort((a: Element, b: Element) => getElementName(a).localeCompare(getElementName(b)));
  }
  return [];
}

export function mapImportPathByImportName(node: ASTNode, importPathByImportName: Map<ImportName, ImportPath>) {
  const importDeclaration = node as unknown as ImportDeclaration;
  importDeclaration.specifiers.forEach(s => {
    importPathByImportName.set(s.imported.name, importDeclaration.source.value);
  });
}
const isCallExpression = (element: Element): element is CallExpression => {
  return element.type === 'CallExpression';
};

function getElementName(element: NodeBaseWithName | CallExpression): ImportName {
  return isCallExpression(element) ? element.callee.object.name : element.name;
}


function computeSortedMetadata(elements: Element[], importMaps: Map<ImportName, ImportPath>): Element[] {
  // elementByGroup by import @angular @custom other
  const elementByGroup = new Map<GroupName, Element[]>();
  elementByGroup.set(angularModule, []);
  elementByGroup.set(customModule, []);
  elementByGroup.set(appModule, []);

  elements.forEach(element => {
    const importName = getElementName(element);
    const elementImportsPath = importMaps.get(importName);
    if (elementImportsPath?.startsWith(angularModule)) {
      updateMapGroup(elementByGroup, element, angularModule);
    } else if (elementImportsPath?.startsWith(customModule)) {
      updateMapGroup(elementByGroup, element, customModule);
    } else {
      updateMapGroup(elementByGroup, element, appModule);
    }
  });
  return [
    ...sortElementByFroup(elementByGroup, angularModule),
    ...sortElementByFroup(elementByGroup, customModule),
    ...sortElementByFroup(elementByGroup, appModule),
  ];
}

export function sortImportMetadata(node: ASTNode, importPathByImportName: Map<ImportName, ImportPath>) {
  const declaration = node.declaration;
  const decorators: Decorator[] = declaration?.decorators;

  if (declaration?.type === 'ClassDeclaration' && decorators?.length) {
    const ngModule: Decorator | undefined = decorators.find(
      decorator => decorator.expression.callee.name === 'NgModule',
    );
    if (ngModule) {
      ngModule.expression.arguments.forEach(p =>
        p.properties.forEach(a => (a.value.elements = computeSortedMetadata(a.value.elements, importPathByImportName))),
      );
    }
  }
}
