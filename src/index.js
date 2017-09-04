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
  }
  // } else if (~~fileInput.size > FILE_SIZE_LIMIT) {
  //   alert("File is too large.");
  //   return false;
  // }

  return true;
}

var playVideo = (fileInput) => {
  var extension = (fileInput && fileInput.name) ? fileInput.name.split('.').pop() : "";
  if (!extension) {
    alert("Can't recognize the video");
  }

  // remove old content first
  $('#videoContainer').empty();

  var reader = new FileReader();  
  reader.onload = (event) => {
    // hide front elements
    if (!$('#fileInput').hasClass('nodisp')) {
      $('#fileInput').addClass('nodisp');
      $('#labelContainer').addClass('nodisp');
    }

    // insert new content
    var videoPlayer = `
      <video id='videoPlayer' autoplay='true' height='100%' width='100%' 
             src='${fileInput.path}' controls volume=0.75
             type='video/${extension}'>
        <p>Your browser doesn't support HTML5</p>
      </video>
      `;
    
    $('#videoContainer').append(videoPlayer);
    $('video').prop('volume', 0.5)
  }

  reader.readAsDataURL(fileInput);
}

$(document).on('change', '#fileInput', (event) => {
  event.stopPropagation();
  event.preventDefault();
  
  var fileInput = $('#fileInput').prop('files')[0];
  if (!fileCheck(fileInput)) {
    return;
  }

  playVideo(fileInput);
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

  playVideo(fileInput);
});