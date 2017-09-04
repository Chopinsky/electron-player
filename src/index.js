var $ = require("jquery");
var FILE_SIZE_LIMIT = 51000000;

var peekObject = (object) => {
  if (!object) {
    return;
  }

  var str = object.toString() + "\n";
  for (var prop in object) {
    var content =  !!object[prop] ? object[prop].toString() : "null";
    if (!!prop) {
      str += `${prop} (${typeof object[prop]}): ${content} \n`;
    }
  }

  return str;
}

var fileCheck = (fileInput) => {
  if (!fileInput || !fileInput.path) {
    alert("Fail to read the file, try again.");
    return false;
  } else if (!fileInput.size || ~~fileInput.size === 0) {
    alert("Can't open empty file.");
    return false;
  } else if (~~fileInput.size > FILE_SIZE_LIMIT) {
    alert("File is too large.");
    return false;
  }

  return true;
}

$(document).on('change', '#fileInput', (event) => {
  event.stopPropagation();
  event.preventDefault();
  
  var fileInput = $('#fileInput').prop('files')[0];
  if (!fileCheck(fileInput)) {
    return;
  }

  var reader = new FileReader();
});

$(document).on('dragover', '#pageContainer', (event) => {
  event.stopPropagation();
  event.preventDefault();
  event.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.

  if(!$('body').hasClass('onDragOver')) {
    $('body').addClass('onDragOver');
  }
});

$(document).on('dragleave', '#pageContainer', (event) => {
  event.stopPropagation();
  event.preventDefault();

  if($('body').hasClass('onDragOver')) {
    $('body').removeClass('onDragOver');
  }
});

$(document).on('drop', '#pageContainer', (event) => {
  event.stopPropagation();
  event.preventDefault();

  if($('body').hasClass('onDragOver')) {
    $('body').removeClass('onDragOver');
  }

  var fileInput = event.originalEvent.dataTransfer.files[0];
  if (!fileCheck(fileInput)) {
    return;
  }

  console.log(fileInput.path);
  var reader = new FileReader();
});