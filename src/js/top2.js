var canvas;
var c_ww =  document.getElementById('p5Canvas').clientWidth;
var c_hh =  document.getElementById('p5Canvas').clientHeight;

var radius = 300;

var particlesNum = 360;
var p_pos = [];

var particle_pos = [];
var particleBreakDistance;

function setup(){
	var canvas = createCanvas(c_ww, c_hh, WEBGL);
	canvas.parent("p5Canvas");
	console.log("Canvas Size :" + width + "x" + height);

	particleBreakDistance = max(width, height) / 40; // パーティクル間の距離の閾値（点間のライン描画するか）

	background(255); // 背景
	stroke(0);
	fill(0);

	frameRate(30);

}


function draw(){
	background(255); // 背景リセット

	drawParticles();
}

function drawParticles() {
	translate(0, 0, 0);

	rotateX(frameCount * .004);
	rotateY(frameCount * .003);

	var s = 0;
	var t = 0;
	var lastx = 0;
	var lasty = 0;
	var lastz = 0;

	while (t < particlesNum) {
		s += 36;
		t += 1;

		if (lastx == 0) {
			p_pos.push(random(radius));
		}

		var radianS = radians(s);
		var radianT = radians(t);

		var thisx = 0 + (p_pos[t] * cos(radianS) * sin(radianT));
		var thisy = 0 + (p_pos[t] * sin(radianS) * sin(radianT));
		var thisz = 0 + (p_pos[t] * cos(radianT))

		if (lastx != 0) {
			strokeWeight(1);
			line(thisx, thisy, thisz, lastx, lasty, lastz); // Sphereの描画順に沿ったライン

			/* --- 点間のライン描画 --- */
			var posi = createVector(thisx,thisy,thisz);
			particle_pos.push(posi);

			// push();
			// translate(thisx, thisy, thisz);
			// sphere(3);
			// pop();

			strokeWeight(15);
			point(thisx, thisy, thisz);
		}

		lastx = thisx;
		lasty = thisy;
		lastz = thisz;
	}

	// /* --- 点間のライン描画 --- */
	// colorMode(HSB, 100);
	// for (var i = 0; i < particle_pos.length; i++) {
	// 	var posi = particle_pos[i];
	// 	for (var j = i + 1; j < particle_pos.length; j++) {
	// 		var posj = particle_pos[j];
	// 		var dist = posi.dist(posj);
	// 		if (dist <= particleBreakDistance) {
	// 			strokeWeight(2-(dist/particleBreakDistance));
	// 			stroke(100*(posi.x/width), 90, 90, 255 - 255*dist/particleBreakDistance );
	// 			line(posi.x, posi.y, posi.z, posj.x, posj.y, posj.z);
	// 		}
	// 	}
	// }

	particleBreakDistance = min(particleBreakDistance + 1, width / 12);

}

