var Webcam = function (width, height) {
  var userMedia,
  videoStream,
  started = new signals.Signal(),
  canvas = document.createElement('canvas'),
  el = document.createElement('video'),
  ctx = canvas.getContext('2d');

  canvas.id = 'webcam-canvas';
  canvas.width = width;
  canvas.height = height;

  el.autoplay = true;
  el.width = width;
  el.height = height;

  // debug only
  // document.body.appendChild(el);
  // document.body.appendChild(canvas);
  
  function init() {
    if (userMedia = getUserMedia()) {
      startVideo();
    } else {
      alert('getUserMedia() is not supported in your browser');
    }
  }

  function getPixels() {
    if (videoStream) {
      ctx.drawImage(el, 0, 0, width, height);
      return ctx.getImageData(0, 0, width, height).data;
    }
    return [];
  }

  function getUserMedia() {
    return navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }

  function videoOnError(e) {
     console.log('Ops!!! something is wrong:', e);
     started.dispatch('error');
  }

  function videoOnSuccess(stream) {
    videoStream = stream;
    el.src = window.URL.createObjectURL(stream);
    started.dispatch('success');
  }

  function startVideo() {
    userMedia.call(navigator, { video: true }, videoOnSuccess, videoOnError);
  }

  function stopVideo() {
    videoStream.stop();
  }

  return {
    init: init,
    getPixels: getPixels,
    started: started,
    el: el,
    width: width,
    height: height
  }
};