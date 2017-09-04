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
  // The check below seems not necessary.
  // } else if (~~fileInput.size > FILE_SIZE_LIMIT) {
  //   alert("File is too large.");
  //   return false;
  // }

  return true;
}

var playVideo = (fileInput) => {
  var extension = (fileInput && fileInput.name) ? fileInput.name.split('.').pop() : "";
  if (!extension) {
    alert("Can't recognize the video type");
  }

  // remove old content first
  $('#videoContainer').empty();

  var reader = new FileReader();  
  reader.onload = (event) => {
    // insert new content
    var videoPlayer = `
      <div id='videoClose' class='nodisp fi-x'></div>
      <video id='videoPlayer' autoplay controls height='100%' width='100%'
             src='${fileInput.path}' type='video/${extension}'>
        <p>Your browser doesn't support HTML5</p>
      </video>
      `;
    
    $('#videoContainer').append(videoPlayer);

    var video = document.getElementById('videoPlayer');
    if (video.canPlayType('video/' + extension)) {
      initVideoPlayer();
    } else {
      alert("Can't play this video type!");
      removeVideo();
    }
  }

  reader.readAsDataURL(fileInput);
}

var initVideoPlayer = () => {
  // hide front elements
  if (!$('#fileInput').hasClass('nodisp')) {
    $('#fileInput').addClass('nodisp');
    $('#labelContainer').addClass('nodisp');
  }

  $('#videoPlayer').prop('volume', 0.75);

  $('#pageContainer')
    .mouseenter(() => {
      $('#videoClose').removeClass('nodisp');
    })
    .mouseleave(() => {
      $('#videoClose').addClass('nodisp');
    });
  
  $('#videoClose').click((evt) => {
    var video = document.getElementById('videoPlayer');
    video.pause();

    this.removeVideo();
    console.log('close clicked!');
  });
}

var removeVideo = () => {
  if ($('#fileInput').hasClass('nodisp')) {
    $('#fileInput').removeClass('nodisp');
    $('#labelContainer').removeClass('nodisp');
  }
  
  $('#videoPlayer').removeAttr('controls');
  $('#videoContainer').empty();
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