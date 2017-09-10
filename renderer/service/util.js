exports.fileCheck = (fileInput) => {
  if (!fileInput || !fileInput.path) {
    alert(`Fail to read the file, try again.`);
    return false;
  } else if (!fileInput.size || ~~fileInput.size === 0) {
    alert(`Can't open empty file.`);
    return false;
  }

  return true;
}

exports.peekObject = (object) => {
  var output;

  switch (typeof object) {
    case 'undefined':
    case 'null':
      output = 'null';
      break;  
    case 'object':
      output = `{\n`;
      for (var prop in object) {
        if (prop !== undefined && prop !== null 
            && object[prop] !== undefined && object[prop] !== null) {
          output += `  ${prop} (${typeof object[prop]}): ${object[prop].toString()}`
        }  
      }
      break;
    default:
      output = object.toString();
      break;
  }

  return output;
}