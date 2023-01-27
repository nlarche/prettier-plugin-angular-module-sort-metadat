import {util} from "prettier";

const angularModule = '@angular' as const;
const appModule = '@app' as const;
const customModule = '@' as const;
const relativePathModule = './' as const;
type GroupName = typeof angularModule | typeof customModule | typeof appModule | typeof relativePathModule;
type Element = NodeBaseWithName | CallExpression;
type ImportsElement = ImportDefaultSpecifier | ImportSpecifier;

export type ImportName = string;
export type ImportPath = string;

const isCallExpression = (element: Element): element is CallExpression => {
  return element.type === 'CallExpression';
};

const isImportDefaultSpecifier = (element: ImportsElement): element is ImportDefaultSpecifier => {
  return element.type === 'ImportDefaultSpecifier';
};

const isImportSpecifier = (element: ImportsElement): element is ImportSpecifier => {
  return element.type === 'ImportSpecifier';
};

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
    if (isImportDefaultSpecifier(s)) {
      importPathByImportName.set(s.local.name, importDeclaration.source.value);
    } else if (isImportSpecifier(s)) {
      importPathByImportName.set(s.imported.name, importDeclaration.source.value);
    }
  });
}

function getElementName(element: Element): ImportName {
  return isCallExpression(element) ? element.callee.object.name : "name" in element ? element.name : "";
}

function computeSortedMetadata(elements: Element[], importMaps: Map<ImportName, ImportPath>): Element[] {
  // elementByGroup by import @angular @custom other
  const elementByGroup = new Map<GroupName, Element[]>();
  elementByGroup.set(angularModule, []);
  elementByGroup.set(customModule, []);
  elementByGroup.set(appModule, []);
  elementByGroup.set(relativePathModule, []);

  elements.forEach(element => {
    const importName = getElementName(element);
    const elementImportsPath = importMaps.get(importName);
    if (elementImportsPath?.startsWith(angularModule)) {
      updateMapGroup(elementByGroup, element, angularModule);
    } else if (elementImportsPath?.startsWith(appModule)) {
      updateMapGroup(elementByGroup, element, appModule)
    } else if (elementImportsPath?.startsWith(relativePathModule)) {
      updateMapGroup(elementByGroup, element, relativePathModule);
    } else {
      updateMapGroup(elementByGroup, element, customModule);
    }
  });
  return [
    ...sortElementByFroup(elementByGroup, angularModule),
    ...sortElementByFroup(elementByGroup, customModule),
    ...sortElementByFroup(elementByGroup, appModule),
    ...sortElementByFroup(elementByGroup, relativePathModule),
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
          p.properties.forEach(a => {
            if (a.value.elements) {
              a.value.elements = computeSortedMetadata(a.value.elements, importPathByImportName)
            }
          }),
      );
    }
  }
}
