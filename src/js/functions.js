// console.log("js start");

/* ========================================================================
 * init
 * ======================================================================== */
let $html = document.getElementsByTagName("html");
let $body = document.getElementsByTagName("body");

/* --- Common letiable --- */
let $wrapper = document.querySelector(".wrapper");
let $wrapper_bg = document.querySelector(".wrapper__bg");
let ww = window.innerWidth;
let wh = window.innerHeight;
let w_breakPoint = 768;

let _sTop = document.documentElement.scrollTop || document.body.scrollTop;
let mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

/* --- 画像preload --- */
let is_ready = false;
let is_cssImg = false;
let $allImage = document.querySelectorAll(".main img");
let allImageCount = $allImage.length;
let completeImageCount = 0;

let cssImgResults = [];
let cssSheets = document.styleSheets;
let completecssImageCount = 0;

/* --- スライドフェードイン --- */
let $sliSL = document.querySelectorAll(".js-sliSL");
let sliSLArr = [];
let sliSLFlagArr = [];
let sliSLTopArr = [];
for(let sliSLCount = 0; sliSLCount < $sliSL.length; sliSLCount++) {
	$sliSL[sliSLCount].style.opacity = 0;
}

let $stgSL = document.querySelectorAll(".js-stgSL");
let stgSLArr = [];
let stgSLFlagArr = [];
let stgSLTopArr = [];
for(let stgSLCount = 0; stgSLCount < $stgSL.length; stgSLCount++) {
	let $stgSLChild = $stgSL[stgSLCount].children;
	for (let stgSLChildCount = 0; stgSLChildCount < $stgSLChild.length; stgSLChildCount++) {
			$stgSLChild[stgSLChildCount].style.opacity = 0;
	}
}

/* --- SPメニュー --- */
let $gnav = document.querySelector(".gnav");
let $menuBtn = document.querySelector(".header__menubtn");
let menuBtnTop;
let is_gnav = false;
let is_open = false;

/* --- hover 処理 --- */
let $hover = document.querySelectorAll(".js-hover");

let $gnavItem = document.querySelectorAll(".gnav__item");

/*--アンカーリンク処理 --- */
let $ancLink = document.querySelectorAll("a[href^='#']")
let ancTopArr = [];
for (let ancCount = 0; ancCount < $ancLink.length; ancCount++) {
	let ancObj = document.getElementById($ancLink[ancCount].getAttribute("href").slice(1));
	ancTopArr[ancCount] = _sTop + ancObj.getBoundingClientRect().top
	$ancLink[ancCount].addEventListener("click", function(e) {
		e.preventDefault();
		let href = this.getAttribute("href");
		scrollAnc(href, .5, ancTopArr[ancCount]);
	})
}

/* --- pageTop --- */
let $pageTop = document.querySelector(".pagetop");
let is_pageTop = false;

let _SP = false;
if (ww > w_breakPoint) {
	_SP = false;
} else {
	_SP = true;
}

window.addEventListener("resize", (e) => {
	ww = window.innerWidth;
	wh = window.innerHeight;
	if (ww > w_breakPoint) {
		_SP = false;
	} else {
		_SP = true;
	}
});

// setUA();

/* -----------------------------------------------
 * Ready imageなど遅延ロード
 * ----------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
	console.log("ready");
	// let tags = document.getElementsByTagName("*");
	try{
		if (Array.from) {
			let classesEle = Array.from(document.querySelectorAll('[class]')); // 全要素からクラス名を持つ要素を取得
			let classes = [];
			for (let i = 0; i < classesEle.length; i++) {
				classes.push(Array.from(classesEle[i].classList));
			}
			let flatten = Array.prototype.concat.apply([], classes);
			let set = new Set(flatten);
			let arrSet = Array.from(set); // 開いているHTMLから全クラス名を取得
			let cssStyle = [];
			for (let i = 0; i < arrSet.length; i++) {
				let block = document.getElementsByClassName(arrSet[i]);
				if (window.getComputedStyle(block[0]).getPropertyValue("background-image") !== "none") {
					cssStyle.push(window.getComputedStyle(block[0]).getPropertyValue("background-image"));
				}else if (window.getComputedStyle(block[0], "::after").getPropertyValue("background-image") !== "none") {
					cssStyle.push(window.getComputedStyle(block[0], "::after").getPropertyValue("background-image"));
				}else if (window.getComputedStyle(block[0], "::before").getPropertyValue("background-image") !== "none") {
					cssStyle.push(window.getComputedStyle(block[0], "::before").getPropertyValue("background-image"));
				}
			}

			if (cssStyle.length === 0) {
				is_ready = true;
				readySection();
			}else{
				for(let j = 0; j < cssStyle.length; j++){
					// let img = new Image();
					let $imgnew = document.createElement("img");
					// let imgurl = cssStyle[j].slice(5).slice(0, -2);
					let imgurl = cssStyle[j].replace(/"/g, '');
					imgurl = imgurl.slice(4).slice(0, -1);
					$imgnew.setAttribute("src", imgurl);
					$imgnew.addEventListener("load", (response, status, xhr) => {
						completecssImageCount++;
						if (completecssImageCount == cssStyle.length){
							is_ready = true;
							readySection();
						}
					});
				}
			}
		}else{
			is_ready = true;
			readySection();
		}
	}catch(e){
		// console.log("try");
		is_ready = true;
		readySection();
	}
});

/* -- imgタグ参照 -- */
let readySection = () => {
	// console.log("section start");
	if (is_ready) {
		if (allImageCount < 1) {
			readyInit();
		}else{
			for(let i = 0; i < allImageCount; i++){
				let image = new Image();
				let $src = $allImage[i].getAttribute('src');
				image.src = $src;
				let $new = document.createElement("img");
				$allImage[i].style.opacity = 0;
				if (!$src || image.width == 0) {
					completeImageCount++;
				}else{
					$new.addEventListener("load", () => {
						completeImageCount++;
						if (allImageCount == completeImageCount){
							for(let j = 0; j < $allImage.length; j++){
								$allImage[j].removeAttribute('style');
							}
							setTimeout(() => {
								readyInit();
							},100);
						}
					})
				}
			$new.setAttribute("src",$allImage[i].getAttribute('src'));
			}
		}
	}
}

/* -- Ready init (Loadが終わったら) -- */
let readyInit = () => {
	// console.log("init start");
	/* ホワイトバック */
	TweenMax.to($wrapper_bg, .6, {opacity:0, onComplete: () => {
		$wrapper_bg.parentNode.removeChild($wrapper_bg);
		// scroll_flag = false;
	}});

	// アンカーリンク
	for (let ancCount = 0; ancCount < $ancLink.length; ancCount++) {
		let ancObj = document.getElementById($ancLink[ancCount].getAttribute("href").slice(1));
		ancTopArr[ancCount] = _sTop + ancObj.getBoundingClientRect().top
		$ancLink[ancCount].addEventListener("click", function(e) {
			e.preventDefault();
			let href = this.getAttribute("href");
			scrollAnc(href, .5, ancTopArr[ancCount]);
		})
	}

	/* sliSL */
	let wscroll = _sTop + wh;
	for (let i = 0; i < sliSLTopArr.length; i++) {
		if (sliSLTopArr[i] <= wscroll) { sliSLFlagArr[i] = true; sliSLAnime(sliSLArr[i]); }
	}
	for (let i = 0; i < stgSLTopArr.length; i++) {
		if (stgSLTopArr[i] <= wscroll) { stgSLFlagArr[i] = true; stgSLInAnime(stgSLArr[i]); }
	}

}

/* -----------------------------------------------
 * sliSL stgSL
 * ----------------------------------------------- */
/* 単発slide */
for(let sliSLCount = 0; sliSLCount < $sliSL.length; sliSLCount++) {
	let $this = $sliSL[sliSLCount];
	sliSLArr[sliSLCount] = $this;
	sliSLFlagArr[sliSLCount] = false;
	sliSLTopArr[sliSLCount] = $this.getBoundingClientRect().top;
}
let sliSLAnime = ($obj) => {
	TweenMax.killTweensOf($obj);
	let SLIval = 20
	let SLIdelay = .3
	if($obj.getAttribute("data-sliVal") >= 0) SLIval = $obj.getAttribute("data-sliVal");
	if($obj.getAttribute("data-sliDelay") >= 0) SLIdelay = $obj.getAttribute("data-sliDelay");
	if($obj.classList.contains('js-sliSL-left')){
		TweenMax.fromTo($obj, .3, {x:-1*SLIval,opacity:0},{x:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute('style');
			$obj.classList.remove('js-sliSL', 'js-sliSL-left');
		}});
	}else if($obj.classList.contains('js-sliSL-right')){
		TweenMax.fromTo($obj, .3, {x:SLIval,opacity:0},{x:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute('style');
			$obj.classList.remove('js-sliSL', 'js-sliSL-right');
		}});
	}else if($obj.classList.contains('js-sliSL-top')){
		TweenMax.fromTo($obj, .3, {y:-1*SLIval,opacity:0},{y:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute('style');
			$obj.classList.remove('js-sliSL', 'js-sliSL-top');
		}});
	}else if($obj.classList.contains('js-sliSL-bottom')){
		TweenMax.fromTo($obj, .3, {y:SLIval,opacity:0},{y:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute('style');
			$obj.classList.remove('js-sliSL', 'js-sliSL-bottom');
		}});
	}else{
		TweenMax.fromTo($obj, .3, {y:SLIval,opacity:0},{y:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute('style');
			$obj.classList.remove('js-sliSL');
		}});
	}
}

/* 連続したslide */
for (let stgSLCount = 0; stgSLCount < $stgSL.length; stgSLCount++) {
  let $this = $stgSL[stgSLCount];
  stgSLArr[stgSLCount] = $this;
  stgSLFlagArr[stgSLCount] = false;
  stgSLTopArr[stgSLCount] = $this.getBoundingClientRect().top;
}
let stgSLInAnime = ($obj) => {
	let stgSLIval = 20
	let stgSLIdelay = .3
	if($obj.getAttribute("data-sliVal") >= 0) stgSLIval = Number($obj.getAttribute("data-sliVal"));
	if($obj.getAttribute("data-sliDelay") >= 0) stgSLIdelay = Number($obj.getAttribute("data-sliDelay"));
	if($obj.classList.contains('js-stgSL-left')){
		TweenMax.staggerFromTo($obj.children, .3, {x:-1*stgSLIval,opacity:0},{x:0,opacity:1,delay:stgSLIdelay},.15, () => {
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute('style');
			}
			$obj.classList.remove('js-stgSL', 'js-stgSL-left');
		});
	}else if($obj.classList.contains('js-stgSL-right')){
		TweenMax.staggerFromTo($obj.children, .3, {x:stgSLIval,opacity:0},{x:0,opacity:1,delay:stgSLIdelay},.15, () => {
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute('style');
			}
			$obj.classList.remove('js-stgSL', 'js-stgSL-right');
		});
	}else if($obj.classList.contains('js-stgSL-top')){
		TweenMax.staggerFromTo($obj.children, .3, {y:-1*stgSLIval,opacity:0},{y:0,opacity:1,delay:stgSLIdelay},.15, () => {
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute('style');
			}
			$obj.classList.remove('js-stgSL', 'js-stgSL-top');
		});
	}else if($obj.classList.contains('js-stgSL-bottom')){
		TweenMax.staggerFromTo($obj.children, .3, {y:stgSLIval,opacity:0},{y:0,opacity:1,delay:stgSLIdelay},.15, () => {
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute('style');
			}
			$obj.classList.remove('js-stgSL', 'js-stgSL-bottom');
		});
	}else{
		TweenMax.staggerFromTo($obj.children, .7, {y:stgSLIval,opacity:0},{y:0,opacity:1,delay:stgSLIdelay},.15, () => {
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute('style');
			}
			$obj.classList.remove('js-stgSL');
		});
	}
}

// /* -----------------------------------------------
//  * PC時 headerのtopとbottom切り替え
//  * ----------------------------------------------- */
// let headerFixed = (_stop) => {
// 	if (!_SP) {
// 		if (_stop < wh/2) {
// 			if (!$gnav.classList.contains("is-top")) {
// 				$gnav.classList.add('is-top');
// 			}
// 		}else if($gnav.classList.contains("is-top")) {
// 			$gnav.classList.remove('is-top');
// 		}
// 	}
// }

/* -----------------------------------------------
* スクロール禁止復活用関数
* ----------------------------------------------- */
let scrolloff = ( event ) => {event.preventDefault();}
let scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
let no_scroll = () => {
	document.addEventListener.on(scroll_event,scrolloff);
	window.addEventListener('touchmove', scrolloff, {passive: false} );
}
let return_scroll = () => {
	document.removeEventListener(scroll_event);
	window.removeEventListener('touchmove', scrolloff, {passive: false} );
}




/* ========================================================================
 * Event
 * ======================================================================== */

/* -----------------------------------------------
 * アンカークリック
 * ----------------------------------------------- */
let scrollAnc = ($object, $speed, $scroll) => {
	let hash = $object;
	let $target;
	let t_hash;
	// let h_h = document.querySelector(".header").clientHeight;
	// console.log($scroll);
	if(is_open) $menuBtn.dispatchEvent(new Event("click"));
	if(hash==="#") {
		t_hash = 0;
	} else {
		t_hash = $scroll;
	}
	TweenMax.to(window,$speed,{scrollTo: t_hash});
}


/* -----------------------------------------------
 * SP メニュー
 * ----------------------------------------------- */
$menuBtn.addEventListener('click', (e) => {
	let h_gnav = Number(window.innerHeight);
	if (!is_gnav) {
		if (!is_open) {
			menuBtnTop = document.documentElement.scrollTop || document.body.scrollTop;
			console.log(menuBtnTop);
			is_open = true;
			is_gnav = true;
			$menuBtn.classList.add("is-open");
			$wrapper.style.position = "fixed";
			$wrapper.style.top = "-" + menuBtnTop + "px";
			$wrapper.style.left = 0;
			TweenMax.to($gnav, .3, {height:h_gnav, onComplete: () => {is_gnav = false;}});
		} else {
			console.log(menuBtnTop);
			$wrapper.removeAttribute('style');
			window.scrollTo({top:menuBtnTop});
			is_open = false;
			is_gnav = true;
			$menuBtn.classList.remove("is-open");
			TweenMax.to($gnav, .3, {height:0, onComplete: () => {is_gnav = false;}});
		}
	}
});


/* -----------------------------------------------
 * マウスオーバー - フェード
 * ----------------------------------------------- */
if (!_SP) {
	for(let hoverCount = 0; hoverCount < $hover.length; hoverCount++){
		$hover[hoverCount].addEventListener("mouseover", (e) => {
			TweenMax.to($hover[hoverCount],.2,{opacity: .5});
		});
		$hover[hoverCount].addEventListener("mouseout", (e) => {
			TweenMax.to($hover[hoverCount],.2,{opacity: 1, onComplete: () => {$hover[hoverCount].removeAttribute("style");}});
		});
	}
}


/* -----------------------------------------------
 * - スクロール -
 * ----------------------------------------------- */
window.addEventListener('scroll', (e) => {
	e.preventDefault();
	_sTop = document.body.scrollTop || document.documentElement.scrollTop;
	wh = window.innerHeight;
	let _sMdl = _sTop + wh / 2;
	let _sBtm = _sTop + wh;
	let diffVal = 100

	/* sliSL */
	for (let i = 0; i < sliSLArr.length; i++) {
		if (!sliSLFlagArr[i] && sliSLTopArr[i] <= _sBtm - diffVal) {
			sliSLFlagArr[i] = true;
			sliSLAnime(sliSLArr[i]);
		}
	}
	/* stgSL */
	for (let i = 0; i < stgSLArr.length; i++) {
		if (!stgSLFlagArr[i] && stgSLTopArr[i] <= _sBtm - diffVal) {
			stgSLFlagArr[i] = true;
			stgSLInAnime(stgSLArr[i]);
		}
	}

	// headerFixed(_sTop);

	if (_sTop > wh) {
		$pageTop.classList.add("is-current");
	}else{
		$pageTop.classList.remove("is-current");
	}

	// for (let i = 0; i < ancTopArr.length; i++) {
	// 	if(i === 0 && ancTopArr[0] <= _sMdl){
	// 		$gnavItem[i].classList.add("is-active");
	// 	}else if (ancTopArr[i + 1] >= _sTop && ancTopArr[i] <= _sTop) {
	// 		$gnavItem[i].classList.add("is-active");
	// 	}else{
	// 		$gnavItem[i].classList.remove("is-active");
	// 	}
	// }

});


/* -----------------------------------------------
 * ページトップ スクロール
 * ----------------------------------------------- */
$pageTop.addEventListener('click', (e) => {
	e.preventDefault();
	if (!is_pageTop) {
		is_pageTop = true;
		TweenMax.to(window,.8,{scrollTo: 0 , onComplete: () => {is_pageTop = false;}});
	}
});





// /* -----------------------------------------------
//  * ユーザーエージェントを取得
//  * ----------------------------------------------- */
// let setUA = () => {
// 	let ua = navigator.userAgent.toLowerCase();  //エージェント取得
// 	let ver = navigator.appVersion.toLowerCase(); //バージョンを取得

// 	let isMSIE = (ua.indexOf('msie') > -1) && (ua.indexOf('opera') == -1); // IE(11以外)
// 	let isIE6 = isMSIE && (ver.indexOf('msie 6.') > -1); // IE6
// 	let isIE7 = isMSIE && (ver.indexOf('msie 7.') > -1); // IE7
// 	let isIE8 = isMSIE && (ver.indexOf('msie 8.') > -1); // IE8
// 	let isIE9 = isMSIE && (ver.indexOf('msie 9.') > -1); // IE9
// 	let isIE10 = isMSIE && (ver.indexOf('msie 10.') > -1); // IE10
// 	let isIE11 = (ua.indexOf('trident/7') > -1); // IE11
// 	let isIE = isMSIE || isIE11; // IE
// 	let isEdge = (ua.indexOf('edge') > -1); // Edge

// 	let isChrome = (ua.indexOf('chrome') > -1) && (ua.indexOf('edge') == -1); // Google Chrome
// 	let isFirefox = (ua.indexOf('firefox') > -1); //Firefox
// 	let isSafari = (ua.indexOf('safari') > -1) && (ua.indexOf('chrome') == -1); // Safari
// 	let isOpera = (ua.indexOf('opera') > -1); // Opera
// }


// /* -----------------------------------------------
//  * FastClick.js
//  * ----------------------------------------------- */
// if ('addEventListener' in document) {
// 	document.addEventListener('DOMContentLoaded', () => {
// 		FastClick.attach(document.body);
// 	}, false);
// }
