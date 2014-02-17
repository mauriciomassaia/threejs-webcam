(function (window){
  'use strict';

  window.onload = function () {
    var w = new WebGLView(),
    webcam = new Webcam(320, 240);

    function webcamStarted(message) {
      switch (message) {
        case 'success' :
          w.init(webcam);
          break;
        case 'error':
          alert('Webcam needed to start the experiment');
          break
      }
    }

    webcam.started.add(webcamStarted);
    webcam.init();
	};
})(window, undefined);