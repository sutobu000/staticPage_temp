var canvas;
var maxParticles, particleBreakDistance, repelDist;
var particles = [];
var c_ww =  document.getElementById('p5Canvas').clientWidth;
var c_hh =  document.getElementById('p5Canvas').clientHeight;

function setup(){
	var canvas = createCanvas(c_ww, c_hh);
	canvas.parent("p5Canvas");
  console.log("Canvas Size :" + width + "x" + height);

  frameRate(60);
  strokeWeight(2);
  stroke(255);

  maxParticles = 30; // パーティクルの個数
  repelDist = max(width, height)/4; // 点を退ける範囲の値
  particleBreakDistance = max(width, height) / 40; // パーティクル間の距離の閾値（点間のライン描画するか）
  while (particles.length < maxParticles) {
      obj = [createVector(random(width), random(height)), createVector(random(10) - 10, random(10) - 10)]; // createVectorでpositionとベクトルを作成
      particles.push(obj); // 配列に格納
  }
}


function draw(){
  background(255); // 背景リセット

  drawParticles(); // パーティクル描画
  particleBreakDistance = min(particleBreakDistance + 1, width / 12); // 
}



function drawParticles() {
	/* --- 点間のライン描画 --- */
	// colorMode(HSB, 100);
	// for (var i = 0; i < particles.length; i++) {
	// 	var posi = particles[i][0];
	// 	for (var j = i + 1; j < particles.length; j++) {
	// 		var posj = particles[j][0];
	// 		var dist = posi.dist(posj);
	// 		if (dist <= particleBreakDistance) {
	// 			strokeWeight(2-(dist/particleBreakDistance));
	// 			stroke(100*(posi.x/width), 90, 90, 255 - 255*dist/particleBreakDistance );
	// 			line(posi.x, posi.y, posj.x, posj.y);
	// 		}
	// 	}
	// }

	colorMode(RGB, 255);
	fill(168, 168, 168, 200); // パーティクルのfillの色

	noStroke(); // strokeを非表示

	var mousePos = createVector(mouseX, mouseY); // mouseのposition

	for (var i = 0; i < particles.length; i++) {
		/* --- 点の描画 --- */
		var pos = particles[i][0]; // 点の座標
		var speed = particles[i][1]; // 点のベクトル
		// var randSize = 3 + random(4);
		var randSize = 10; // 点のサイズ
		ellipse(pos.x, pos.y, randSize, randSize); // 点というか円を描画
		pos.add(speed); // 現在の座標からベクトル分を追加して新しい座標をインプット

		/* --- マウス インタラクション --- */
		var distToMouse = mousePos.dist(pos); // 点間の距離を計算

		if (distToMouse < repelDist) { // repelDistで定めた値とif条件で調べる
			var repel = createVector(pos.x - mousePos.x, pos.y - mousePos.y); // 点の座標とmouseの座標との差
			var distFrac = (repelDist - distToMouse) / repelDist // 点の座標からmouseの座標までの値から変化量を計算
			repel.setMag(10 * distFrac * distFrac); // ベクトルの大きさを設定
			pos.add(repel); // 現在の座標からベクトル分を追加して新しい座標をインプット
		}


 		/* --- 点の座標がwidth、heightの枠外の時の処理 -- */
		if (pos.x > width) { // 点のx座標がwidth以上の時
			pos.x -= width;
			pos.y += random(height / 10) - height / 20
		}
		else if (pos.x < 0) { // 点のx座標が0以下の時
			pos.x += width;
			pos.y += random(height / 10) - height / 20;
		}

		if (pos.y > height) { // 点のy座標がheight以上の時
			pos.y -= height;
			pos.x += random(width / 10) - width / 20;
		}
		else if (pos.y < 0) { // 点のy座標がheight以下の時
			pos.y += height;
			pos.x += random(width / 10) - width / 20;
		}
	}
}