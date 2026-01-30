function createLookupObject(arrayOfObjects, newObjKey, newObjValue) {
  const lookupObj = {};

  for (let i = 0; i < arrayOfObjects.length; i++) {
    const keyToAdd = arrayOfObjects[i][newObjKey];
    const valToAdd = arrayOfObjects[i][newObjValue];

    lookupObj[keyToAdd] = valToAdd;
  }

  return lookupObj;
}

module.exports = createLookupObject;
