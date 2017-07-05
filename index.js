// @flow
'use strict';

const {getIdentifierKind} = require('babel-identifiers');
const {findFlowBinding} = require('babel-flow-scope');

/*::
type Path = {
  parentPath: Path,
  [key: string]: any,
};
*/

function isImport(path) {
  return (
    path.parentPath &&
    path.parentPath.parentPath &&
    path.parentPath.parentPath.isImportDeclaration()
  );
}

function getImportKind(path) {
  return (
    path.parentPath.node.importKind ||
    path.parentPath.parent.importKind ||
    'value'
  );
}

function isTypeImport(path) {
  return (
    isImport(path) &&
    getImportKind(path) !== 'value'
  );
}

function isTypeOfValue(path) {
  return path.parentPath.parentPath.isTypeofTypeAnnotation();
}

function isReference(path) {
  return getIdentifierKind(path) === 'reference';
}

function isFlowReference(path) {
  let binding = findFlowBinding(path, path.node.name);
  return !!binding && isFlowIdentifier(binding.path);
}

function isFlowIdentifier(path /*: Path */) /*: boolean */ {
  if (path.isTypeParameter()) {
    return true;
  } else if (!path.isIdentifier()) {
    return false;
  } else if (isTypeImport(path)) {
    return true;
  } else if (isTypeOfValue(path)) {
    return false;
  } else if (path.parentPath.isFlow()) {
    if (isReference(path)) {
      return isFlowReference(path);
    } else {
      return true;
    }
  } else {
    return false;
  }
}

exports.isFlowIdentifier = isFlowIdentifier;
