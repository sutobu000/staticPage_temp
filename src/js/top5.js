var canvas;
var c_ww =  document.getElementById('p5Canvas').clientWidth;
var c_hh =  document.getElementById('p5Canvas').clientHeight;

var _imgSize = 800;
var _img;
var _ffCount = 20;
var _ff = [];
 
function setup() {
    var canvas = createCanvas(c_ww, c_hh);
    canvas.parent("p5Canvas");
    background(0);
    noStroke();
 
    imgSet();
 
    for (var i=0; i<_ffCount; i++) {
        _ff[i] = new FfObj();
    }
 
}
 
function draw() {
    background(0);
 
    for (var i=0; i<_ffCount; i++) {
        if (!mouseIsPressed) { _ff[i].drawMe();}
        else {_ff[i].drawMe2();}
        _ff[i].updateMe();
    }
}
 
function imgSet() {
    _img = createImage(_imgSize, _imgSize);
    _img.loadPixels();
    for (var i = 0; i < _img.width; i++) {
        for (var j = 0; j < _img.height; j++) {
            var pixAlpha = 255/(dist(_img.width/2, _img.height/2, i, j)-1)*1.47;
            if (pixAlpha < .94) { pixAlpha=0; }
            _img.set(i, j, color(255, 255, 250, pixAlpha));
        }
    }
    _img.updatePixels();
}
 
function FfObj() {
    this.pX = random(0-_img.width/2, width-_img.width/2);
    this.pY = random(0-_img.height/2, height-_img.height/2);
    this.noiseX = random()*1000;
    this.noiseY = random()*1000;
    this.noiseScale = random(0.001, 0.02);
}
 
FfObj.prototype.updateMe = function() {
    this.pX += noise(this.noiseX)*4-1.86;
    this.pY += noise(this.noiseY)*4-1.86;
    if (this.pX < 0-_img.width/2) { this.pX = 0-_img.width/2;}
    if (this.pX > width-_img.width/2) { this.pX = width-_img.width/2;}
    if (this.pY < 0-_img.height/2) { this.pY = 0-_img.height/2;}
    if (this.pY > height-_img.height/2) { this.pY = height-_img.height/2;}
    this.noiseX += this.noiseScale;
    this.noiseY += this.noiseScale;
}
 
FfObj.prototype.drawMe = function() {
    image(_img, this.pX, this.pY);
    fill(255, 255, 250, 255);
    ellipse(this.pX+_img.width/2, this.pY+_img.height/2, 5);   
}
 
FfObj.prototype.drawMe2 = function() {
    fill(255, 255, 250, 1);
    ellipse(this.pX+_img.width/2, this.pY+_img.height/2, _imgSize); 
    fill(255, 255, 250, 2);
    ellipse(this.pX+_img.width/2, this.pY+_img.height/2, _imgSize/2);      
    fill(255, 255, 250, 20);
    ellipse(this.pX+_img.width/2, this.pY+_img.height/2, _imgSize/40); 
    fill(255, 255, 250, 255);
    ellipse(this.pX+_img.width/2, this.pY+_img.height/2, 6);
}
