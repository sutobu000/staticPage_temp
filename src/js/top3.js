var canvas;
var c_ww =  document.getElementById('p5Canvas').clientWidth;
var c_hh =  document.getElementById('p5Canvas').clientHeight;

var x, y;
var r = 300;
var theta;
var t = 0;
var angle;

function setup(){
  var canvas = createCanvas(c_ww, c_hh);
  canvas.parent("p5Canvas");
  console.log("Canvas Size :" + width + "x" + height);

  background(255); // 背景
  stroke(0);
  fill(0);

  frameRate(30);

  angle = random(TWO_PI);
}


function draw(){
  translate(c_ww/2, c_hh/2);
  background(255); // 背景リセット
  noStroke();
  push();
  rotate(angle);
  for (var j=1; j<8; j+=0.6) {
    beginShape();
    for (var i=0; i<=360; i++) {
      theta = radians(i)+j*sin(t/10);
      x = map(i, 0, 360, -r, r );
      y = r * sqrt(1-pow(x/r, 2)) * sin(theta + t);
      noFill();
      stroke(176, 176, 176);
      vertex(x, y);
    }
    endShape();
  }
  pop();
  t += 0.06;
  angle += 0.002;

}
