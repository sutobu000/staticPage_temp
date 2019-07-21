// console.log("js start");

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

/* --- hover 処理 --- */
let $hover = document.querySelectorAll(".js-hover");

/*--アンカーリンク処理 --- */
let $ancLink = document.querySelectorAll("a[href^='#']")

/* --- スライドフェードイン --- */
let $slideIn = document.querySelectorAll(".js-slideIn");
let slideInArr = [];
let slideInFlagArr = [];
let slideInTopArr = [];
for(let slideInCount = 0; slideInCount < $slideIn.length; slideInCount++) {
	$slideIn[slideInCount].style.opacity = 0;
}

let $staggerSlide = document.querySelectorAll(".js-staggerSlide");
let staggerSlideArr = [];
let staggerSlideFlagArr = [];
let staggerSlideTopArr = [];
for(let staggerSlideCount = 0; staggerSlideCount < $staggerSlide.length; staggerSlideCount++) {
	let $staggerSlideChild = $staggerSlide[staggerSlideCount].children;
	for (let staggerSlideChildCount = 0; staggerSlideChildCount < $staggerSlideChild.length; staggerSlideChildCount++) {
			$staggerSlideChild[staggerSlideChildCount].style.opacity = 0;
	}
}

/* --- SPメニュー --- */
let $gnav = document.querySelector(".gnav");
let $menuBtn = document.querySelector(".header__menubtn");
let is_gnav = false;
let is_open = false;

/* --- pageTop --- */
let $pageTop = document.querySelector(".pagetop");
let is_pageTop = false;

let _SP = false;
if (ww > w_breakPoint) {
	_SP = false;
} else {
	_SP = true;
}

window.addEventListener("resize", function(e) {
	ww = window.width();
	wh = window.height();
	if (ww > w_breakPoint) {
		_SP = false;
	} else {
		_SP = true;
	}
});

// setUA();

/* -----------------------------------------------
 * Ready
 * ----------------------------------------------- */
/* -- Ready イベント -- */
document.addEventListener("DOMContentLoaded", function() {
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
					$imgnew.addEventListener("load", function(response, status, xhr) {
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
function readySection() {
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
					$new.addEventListener("load", function() {
						completeImageCount++;
						if (allImageCount == completeImageCount){
							for(let j = 0; j < $allImage.length; j++){
								$allImage[j].removeAttribute('style');
							}
							setTimeout(function(){
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

/* -- Ready init -- */
function readyInit() {
	// console.log("init start");
	/* ホワイトバック */
	TweenMax.to($wrapper_bg, .6, {opacity:0, onComplete: function(){
		$wrapper_bg.parentNode.removeChild($wrapper_bg);
		// scroll_flag = false;
	}});

	/* slideIn */
	let wscroll = _sTop + wh;
	for (let i = 0; i < slideInTopArr.length; i++) {
		if (slideInTopArr[i] <= wscroll) { slideInFlagArr[i] = true; slideInAnime(slideInArr[i]); }
	}
	for (let i = 0; i < staggerSlideTopArr.length; i++) {
		if (staggerSlideTopArr[i] <= wscroll) { staggerSlideFlagArr[i] = true; staggerSlideInAnime(staggerSlideArr[i]); }
	}

}


/* -----------------------------------------------
 * - スクロール -
 * ----------------------------------------------- */
window.addEventListener('scroll', function (e) {
	e.preventDefault();
	_sTop = document.body.scrollTop || document.documentElement.scrollTop;
	wh = window.innerHeight;
	let _sMdl = _sTop + wh / 2;
	let _sBtm = _sTop + wh;
	let diffVal = 100

	/* slideIn */
	for (let i = 0; i < slideInArr.length; i++) {
		if (!slideInFlagArr[i] && slideInTopArr[i] <= _sBtm - diffVal) {
			slideInFlagArr[i] = true;
			slideInAnime(slideInArr[i]);
		}
	}
	/* staggerSlide */
	for (let i = 0; i < staggerSlideArr.length; i++) {
		if (!staggerSlideFlagArr[i] && staggerSlideTopArr[i] <= _sBtm - diffVal) {
			staggerSlideFlagArr[i] = true;
			staggerSlideInAnime(staggerSlideArr[i]);
		}
	}

});

/* -----------------------------------------------
 * slideIn staggerSlide
 * ----------------------------------------------- */
/* 単発slide */
for(let slideInCount = 0; slideInCount < $slideIn.length; slideInCount++) {
	let $this = $slideIn[slideInCount];
	slideInArr[slideInCount] = $this;
	slideInFlagArr[slideInCount] = false;
	slideInTopArr[slideInCount] = $this.getBoundingClientRect().top;
}
function slideInAnime($obj){
	TweenMax.killTweensOf($obj);
	if($obj.classList.contains('js-slideIn-left')){
		TweenMax.fromTo($obj, .7, {x:-20,opacity:0},{x:0,opacity:1,delay:.3,onComplete: function(){
			$obj.removeAttribute('style');
			$obj.classList.remove('js-slideIn', 'js-slideIn-left');
		}});
	}else if($obj.classList.contains('js-slideIn-right')){
		TweenMax.fromTo($obj, .7, {x:20,opacity:0},{x:0,opacity:1,delay:.3,onComplete: function(){
			$obj.removeAttribute('style');
			$obj.classList.remove('js-slideIn', 'js-slideIn-right');
		}});
	}else if($obj.classList.contains('js-slideIn-top')){
		TweenMax.fromTo($obj, .7, {y:-20,opacity:0},{y:0,opacity:1,delay:.3,onComplete: function(){
			$obj.removeAttribute('style');
			$obj.classList.remove('js-slideIn', 'js-slideIn-top');
		}});
	}else if($obj.classList.contains('js-slideIn-bottom')){
		TweenMax.fromTo($obj, .7, {y:20,opacity:0},{y:0,opacity:1,delay:.3,onComplete: function(){
			$obj.removeAttribute('style');
			$obj.classList.remove('js-slideIn', 'js-slideIn-bottom');
		}});
	}else{
		TweenMax.fromTo($obj, .7, {y:20,opacity:0},{y:0,opacity:1,delay:.3,onComplete: function(){
			$obj.removeAttribute('style');
			$obj.classList.remove('js-slideIn');
		}});
	}
}

/* 連続したslide */
for (let staggerSlideCount = 0; staggerSlideCount < $staggerSlide.length; staggerSlideCount++) {
  let $this = $staggerSlide[staggerSlideCount];
  staggerSlideArr[staggerSlideCount] = $this;
  staggerSlideFlagArr[staggerSlideCount] = false;
  staggerSlideTopArr[staggerSlideCount] = $this.getBoundingClientRect().top;
}
function staggerSlideInAnime($obj){
	if($obj.classList.contains('js-staggerSlide-left')){
		TweenMax.staggerFromTo($obj.children, .7, {x:-20,opacity:0},{x:0,opacity:1,delay:.3},.15, function(){
			$obj.children.removeAttribute('style');
			$obj.classList.remove('js-staggerSlide', 'js-staggerSlide-left');
		});
	}else if($obj.classList.contains('js-staggerSlide-right')){
		TweenMax.staggerFromTo($obj.children, .7, {x:20,opacity:0},{x:0,opacity:1,delay:.3},.15, function(){
			$obj.children.removeAttribute('style');
			$obj.classList.remove('js-staggerSlide', 'js-staggerSlide-right');
		});
	}else if($obj.classList.contains('js-staggerSlide-top')){
		TweenMax.staggerFromTo($obj.children, .7, {y:-20,opacity:0},{y:0,opacity:1,delay:.3},.15, function(){
			$obj.children.removeAttribute('style');
			$obj.classList.remove('js-staggerSlide', 'js-staggerSlide-top');
		});
	}else if($obj.classList.contains('js-staggerSlide-bottom')){
		TweenMax.staggerFromTo($obj.children, .7, {y:20,opacity:0},{y:0,opacity:1,delay:.3},.15, function(){
			$obj.children.removeAttribute('style');
			$obj.classList.remove('js-staggerSlide', 'js-staggerSlide-bottom');
		});
	}else{
		TweenMax.staggerFromTo($obj.children, .7, {y:20,opacity:0},{y:0,opacity:1,delay:.3},.15, function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute('style');
			}
			$obj.classList.remove('js-staggerSlide');
		});
	}
}

/* -----------------------------------------------
 * SP メニュー
 * ----------------------------------------------- */
$menuBtn.addEventListener	('click', function(e) {
	let h_gnav = Number(window.innerHeight);
	if (!is_gnav) {
		if (!is_open) {
			_sTop = document.documentElement.scrollTop || document.body.scrollTop;
			is_open = true;
			is_gnav = true;
			$menuBtn.classList.add("is-open");
			$wrapper.style.position = "fixed";
			$wrapper.style.top = -(_sTop);
			$wrapper.style.left = 0;
			TweenMax.to($gnav, .3, {height:h_gnav, onComplete: function(){is_gnav = false;}});
		} else {
			$wrapper.removeAttribute('style');
			window.scrollTo(0, _sTop);
			is_open = false;
			is_gnav = true;
			$menuBtn.classList.remove("is-open");
			TweenMax.to($gnav, .3, {height:0, onComplete: function(){is_gnav = false;}});
		}
	}
});


/* -----------------------------------------------
 * マウスオーバー - フェード
 * ----------------------------------------------- */
if (!_SP) {
	for(let hoverCount = 0; hoverCount < $hover.length; hoverCount++){
		$hover[hoverCount].addEventListener("mouseover",function(){
			TweenMax.to(this,.2,{opacity: .5});
		});
		$hover[hoverCount].addEventListener("mouseout",function(){
			TweenMax.to(this,.2,{opacity: 1, onComplete: function(){$hover[hoverCount].removeAttribute("style");}});
		});
	}
}

/* -----------------------------------------------
 * ページトップ スクロール
 * ----------------------------------------------- */
$pageTop.addEventListener('click', function(e){
	e.preventDefault();
	if (!is_pageTop) {
		is_pageTop = true;
		TweenMax.to(window,.8,{scrollTo: 0 , onComplete: function(){is_pageTop = false;}});
	}
});
/* -----------------------------------------------
 * アンカークリック
 * ----------------------------------------------- */
for (var ancCount = 0; ancCount < $ancLink.length; ancCount++) {
	$ancLink[ancCount].addEventListener("click", function(e){
		e.preventDefault();
		let href = this.getAttribute("href");
		scrollAnc(href, .5);
	})
}
function scrollAnc($object, $speed) {
	let hash = $object;
	let $target;
	let t_hash;
	let h_h = document.querySelector(".header").clientHeight;
	if(hash==="#") {
		t_hash = 0;
	} else {
		$target = document.querySelector(hash);
		t_hash = $target.getBoundingClientRect().top - h_h;
	}
	TweenMax.to(window,$speed,{scrollTo: t_hash});
}
/* -----------------------------------------------
 * cookie取得
 * ----------------------------------------------- */
function getQuery() {
	$.cookie('is_cookie','1',{ path: "/" }); // cookieを発行するディレクトリを指定
}
/* -----------------------------------------------
 * cookieリセット
 * ----------------------------------------------- */
function resetQuery() {
	$.removeCookie("is_cookie", { path: "/" });
}
/* -----------------------------------------------
 * cookieリセット - URLクエリ -
 * ----------------------------------------------- */
let l_href = location.href;
let k_word = "?t_reset";
if(l_href.indexOf(k_word) != -1) {
	resetQuery();
}
/* -----------------------------------------------
* スクロール禁止復活用関数
* ----------------------------------------------- */
let scrolloff = function( event ) {event.preventDefault();}
let scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
function no_scroll(){
	document.addEventListener.on(scroll_event,scrolloff);
	window.addEventListener('touchmove', scrolloff, {passive: false} );
}
function return_scroll(){
	document.removeEventListener(scroll_event);
	window.removeEventListener('touchmove', scrolloff, {passive: false} );
}


// /* -----------------------------------------------
//  * ユーザーエージェントを取得
//  * ----------------------------------------------- */
// function setUA() {
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
// 	document.addEventListener('DOMContentLoaded', function() {
// 		FastClick.attach(document.body);
// 	}, false);
// }
