// @flow
'use strict';

/*::
type Path = {
  parentPath: Path,
  [key: string]: any,
};
*/

exports.isFlowIdentifier = (path /*: Path */) /*: boolean */ => {
  if (path.isTypeParameter()) {
    return true;
  } else if (!path.isIdentifier()) {
    return false;
  }

  return (
    path.parentPath.isFlow() &&
    !path.parentPath.parentPath.isTypeofTypeAnnotation()
  );
};
