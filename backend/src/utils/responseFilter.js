 
 function hideFields(obj, hiddenFields = []) {
    const result = { ...obj };
    hiddenFields.forEach(field => delete result[field]);
    return result;
  }
  exports.hideFields = hideFields;