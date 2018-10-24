var canvas;
var c_ww =  document.getElementById('p5Canvas').clientWidth;
var c_hh =  document.getElementById('p5Canvas').clientHeight;

function setup() {
  var canvas = createCanvas(c_ww, c_hh, WEBGL);
  canvas.parent("p5Canvas");

  background(255);
  colorMode(HSB);
  smooth();
}


function draw() {

}