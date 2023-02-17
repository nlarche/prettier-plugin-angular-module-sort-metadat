import { util } from 'prettier';
import {
  AstNode,
  CallExpression,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportSpecifier,
  NodeBaseWithName,
} from './ast';

const angularModule = '@angular' as const;
const appModule = '@app' as const;
const customModule = '@' as const;
const relativePathModule = './' as const;
type GroupName = typeof angularModule | typeof customModule | typeof appModule | typeof relativePathModule;
type Element = NodeBaseWithName | CallExpression;

export type ImportName = string;
export type ImportPath = string;

const isCallExpression = (element: Element): element is CallExpression => {
  return element.type === 'CallExpression';
};

const isImportDefaultSpecifier = (element: AstNode): element is ImportDefaultSpecifier => {
  return element.type === 'ImportDefaultSpecifier';
};

const isImportSpecifier = (element: AstNode): element is ImportSpecifier => {
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

export function mapImportPathByImportName(
    node: ImportDeclaration,
    importPathByImportName: Map<ImportName, ImportPath>,
) {
  node.specifiers.forEach((importSpecifier: ImportSpecifier | ImportDefaultSpecifier) => {
    if (isImportDefaultSpecifier(importSpecifier)) {
      importPathByImportName.set(importSpecifier.local.name, node.source.value);
    } else if (isImportSpecifier(importSpecifier)) {
      importPathByImportName.set(importSpecifier.imported.name, node.source.value);
    }
  });
}

function getElementName(element: Element): ImportName {
  return isCallExpression(element) ? element.callee.object.name : 'name' in element ? element.name : '';
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
      updateMapGroup(elementByGroup, element, appModule);
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

export function sortImportMetadata(node: CallExpression, importPathByImportName: Map<ImportName, ImportPath>) {
  if (node.callee.name === 'NgModule') {
    node.arguments.forEach(argument =>
        argument.properties.forEach(property => {
          if (property.value.elements) {
            property.value.elements = computeSortedMetadata(property.value.elements, importPathByImportName);
          }
        }),
    );
  }
}
