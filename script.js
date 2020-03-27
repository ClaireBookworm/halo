/*
 function newStyle() {
     let newColor = '';
     let newFont = '';
     let x = Math.floor(Math.random()*8);
     switch (x){
       case 0:
           newColor = 'red';
           newFont = 'Times New Roman';
           break;
       case 1:
           newColor = 'blue';
           newFont = 'Florence';
           break;
       case 2:
           newColor = 'yellow';
           newFont = 'Verdana';
           break;
       case 3:
           newColor= 'purple';
           newFont = 'Courier New';
           break
       case 4:
           newColor = 'cyan';
           newFont = 'Georgia';
           break;
       case 5:
           newColor = 'maroon';
           newFont = 'Palatino';
           break;
       case 6:
           newColor = 'lime';
           newFont = 'Impact';
           break;
       case 7:
           newColor = 'pink';
           newFont = 'Avenir';
           break;
     }
     var elem = document.getElementById('logo');
     elem.style.color = newColor;
     elem.style.fontFamily = newFont;
   }

   function newWord() {
     let newWord = " ";
     let x = Math.floor(Math.random()*3);
     switch (x) {
      case 0:
        newWord = "Woohoo!";
        break;
      case 1:
        newWord = "Sad...";
        break;
      case 2:
        newWord = "You're awesome!";
        break;
      }
      document.write(newWord);
   }*/

   console.clear();
var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 60;
var length = 30;
var mouseJump = {
  x: 0,
  y: 0
};
var offset = 0;
function Spline() {
  this.geometry = new THREE.Geometry();
  this.color = Math.floor(Math.random() * 80 + 180);
  for (var j = 0; j < 180; j++) {
    this.geometry.vertices.push(
      new THREE.Vector3(j / 180 * length * 2 - length, 0, 0)
    );
    this.geometry.colors[j] = new THREE.Color(
      "hsl(" + (j * 0.6 + this.color) + ",70%,70%)"
    );
  }
  this.material = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors
  });
  this.mesh = new THREE.Line(this.geometry, this.material);
  this.speed = (Math.random() + 0.1) * 0.0002;
  scene.add(this.mesh);
}
var isMouseDown = false;
var prevA = 0;
function render(a) {
  requestAnimationFrame(render);
  for (var i = 0; i < splines.length; i++) {
    for (var j = 0; j < splines[i].geometry.vertices.length; j++) {
      var vector = splines[i].geometry.vertices[j];
      vector.y =
        noise.simplex2(j * 0.05 + i - offset, a * splines[i].speed) * 8;
      vector.z = noise.simplex2(vector.x * 0.05 + i, a * splines[i].speed) * 8;

      vector.y *= 1 - Math.abs(vector.x / length);
      vector.z *= 1 - Math.abs(vector.x / length);
    }
    splines[i].geometry.verticesNeedUpdate = true;
  }
  scene.rotation.x = a * 0.0003;
  if (isMouseDown) {
    mouseJump.x += 0.001;
    if (a - prevA > 100) {
      updateColor();
      prevA = a;
    }
  } else {
    mouseJump.x -= 0.001;
  }
  mouseJump.x = Math.max(0, Math.min(0.07, mouseJump.x));
  offset += mouseJump.x;
  renderer.render(scene, camera);
}
var splines = [];
for (var i = 0; i < 12; i++) splines.push(new Spline());
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function updateColor() {
  for (var i = 0; i < splines.length; i++) {
    var color = Math.abs((splines[i].color - offset * 10) % 360);
    for (var j = 0; j < splines[i].geometry.vertices.length; j++) {
      splines[i].mesh.geometry.colors[j] = new THREE.Color(
        "hsl(" + (j * 0.6 + color) + ",70%,70%)"
      );
    }
    splines[i].mesh.geometry.colorsNeedUpdate = true;
  }
}
function onMouseDown(e) {
  isMouseDown = true;
  return false;
}
function onMouseUp() {
  isMouseDown = false;
}
window.addEventListener("resize", onResize);
window.addEventListener("keydown", onMouseDown);
document.body.addEventListener("mousedown", onMouseDown);
document.body.addEventListener("mouseup", onMouseUp);
document.body.addEventListener("touchstart", onMouseDown);
document.body.addEventListener("touchend", onMouseUp);
requestAnimationFrame(render);
