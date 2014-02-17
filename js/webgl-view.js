var WebGLView = function () {
  
  var camera,
  scene, 
  renderer,
  videoTexture,
  material,
  webcam,
  webcamMesh,
  parts = 20,
  grid = [],
  partW,
  partH,
  mesh,
  index,
  r,
  g,
  b,
  pixels;
  
  var init = function () {
    
    partW = webcam.width / parts;
    partH = webcam.height / parts;
    
    videoTexture = new THREE.Texture(webcam.el);
    material = new THREE.MeshBasicMaterial({
      map : videoTexture
    });
    
    var geometry = new THREE.PlaneGeometry(webcam.width, webcam.height, 5, 5);
    
    webcamMesh = new THREE.Mesh(geometry, material);
    webcamMesh.position.y = (webcam.height + partH) * 0.5;
    webcamMesh.position.x = -webcam.width;
    scene.add(webcamMesh);

    for (var j = 0; j < webcam.height; j+= partH) {
      for (var i = 0; i < webcam.width; i+= partW) {
        geometry = new THREE.PlaneGeometry(partW, partH, 1, 1);
        material = new THREE.MeshBasicMaterial({color: 0x000});
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = webcam.height - j;
        mesh.position.x = i;
        mesh.__index = i + (j * webcam.width);
        scene.add(mesh);
        grid.push(mesh);
      }
    }

    camera.position.y = webcam.height * 0.5;
    camera.position.x = webcam.width * 0.5;
    camera.position.z = 1000;
  }

  var animate = function () {

    if (webcam.el.readyState === webcam.el.HAVE_ENOUGH_DATA) {
      videoTexture.needsUpdate = true;
      pixels = webcam.getPixels();
      
      for (var i=0; i < grid.length; i++) {
        mesh = grid[i];
        index = mesh.__index * 4;
        r = pixels[index];
        g = pixels[index + 1];
        b = pixels[index + 2];
        
        mesh.position.z += (r + g + b - mesh.position.z) * 0.8;
        mesh.material.color.setStyle('rgb(' + r + ',' + g + ',' + b + ')');
        mesh.material.needsUpdate = true;
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  var onWindowResize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  var onDocumentMouseMove = function (e) {
    var rx, ry;
    rx = (window.innerHeight * 0.5 - e.clientY) * 0.001;
    ry = (window.innerWidth * 0.5 - e.clientX) * 0.001;
    camera.rotation.x += (rx - camera.rotation.x) * 0.5;
    camera.rotation.y += (ry - camera.rotation.y) * 0.5;
  };

  var coreInit = function () {
    var ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(50, ratio, 1, 10000);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({precision: 'mediump'});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
  };

  return {
    init: function (_webcam) {
      webcam = _webcam;
      coreInit();
      init();
      animate();
    }
  };
};