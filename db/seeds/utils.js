function createRef(arrayOfObjs, key, val) {
  const refObj = {};

  arrayOfObjs.forEach((obj, i) => {
    const keyToAdd = obj[key];
    const valToAdd = obj[val];
    refObj[keyToAdd] = valToAdd;
  });

  return refObj;
}

module.exports = createRef;
