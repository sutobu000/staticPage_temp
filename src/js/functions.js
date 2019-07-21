console.log("js start");

let $html = document.getElementsByTagName("html");
let $body = document.getElementsByTagName("body");

/* --- Common letiable --- */
let $wrapper = document.querySelector(".wrapper");
let $wrapper_bg = document.querySelector(".wrapper__bg");
let ww = window.innerWidth;
let wh = window.innerHeight;
let w_breakPoint = 767;

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

setUA();

/* -----------------------------------------------
 * Ready
 * ----------------------------------------------- */
/* -- Ready イベント -- */
document.addEventListener("ready", function() {
	// console.log("ready");
	let tags = document.getElementsByTagName("*");
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
					let img = new Image();
					let $imgnew = document.createElement("img");
					// let imgurl = cssStyle[j].slice(5).slice(0, -2);
					let imgurl = cssStyle[j].replace(/"/g, '');
					imgurl = imgurl.slice(4).slice(0, -1);
					$imgnew.attr("src", imgurl);
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
				let $src = $($allImage[i]).attr('src');
				image.src = $src;
				let $new = $('<img src="" >');
				$($allImage[i]).css('opacity', '0');
				if (!$src || image.width == 0) {
					completeImageCount++;
				}else{
					$new.on("load", function() {
						completeImageCount++;
						if (allImageCount == completeImageCount){
							$allImage.removeAttr('style');
							setTimeout(function(){
								readyInit();
							},100);
						}
					})
				}
			$new.attr("src",$($allImage[i]).attr('src'));
			}
		}
	}
}

/* -- Ready init -- */
function readyInit() {
	// console.log("init start");
	/* ホワイトバック */
	$wrapper_bg.velocity({opacity: 0},{duration:500, easing:"ease-out", complete:function(){
		$wrapper_bg.remove();
		scroll_flag = false;
	}});

	/* slideIn */
	let wscroll = window.scrollTop() + wh;
	for (let i = 0; i < slideInTopArr.length; i++) {
		if (slideInTopArr[i] <= wscroll) { slideInFlagArr[i] = true; slideInAnime(slideInArr[i]); }
	}
	for (let i = 0; i < staggerSlideTopArr.length; i++) {
		if (staggerSlideTopArr[i] <= wscroll) { staggerSlideFlagArr[i] = true; staggerSlideInAnime(staggerSlideArr[i].children()); }
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
			staggerSlideInAnime(staggerSlideArr[i].children());
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
	if($obj.hasClass('js-slideIn-left')){
		TweenMax.fromTo($obj, .7, {x:-20,opacity:0},{x:0,opacity:1,delay:.3,onComplete: function(){
			$obj.removeAttr('style');
			$obj.removeClass('js-slideIn').removeClass("js-slideIn-left");
		}});
	}else if($obj.hasClass('js-slideIn-right')){
		TweenMax.fromTo($obj, .7, {x:20,opacity:0},{x:0,opacity:1,delay:.3,onComplete: function(){
			$obj.removeAttr('style');
			$obj.removeClass('js-slideIn').removeClass("js-slideIn-right");
		}});
	}else if($obj.hasClass('js-slideIn-top')){
		TweenMax.fromTo($obj, .7, {y:-20,opacity:0},{y:0,opacity:1,delay:.3,onComplete: function(){
			$obj.removeAttr('style');
			$obj.removeClass('js-slideIn').removeClass("js-slideIn-top");
		}});
	}else if($obj.hasClass('js-slideIn-bottom')){
		TweenMax.fromTo($obj, .7, {y:20,opacity:0},{y:0,opacity:1,delay:.3,onComplete: function(){
			$obj.removeAttr('style');
			$obj.removeClass('js-slideIn').removeClass("js-slideIn-bottom");
		}});
	}else{
		TweenMax.fromTo($obj, .7, {y:20,opacity:0},{y:0,opacity:1,delay:.3,onComplete: function(){
			$obj.removeAttr('style');
			$obj.removeClass('js-slideIn');
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
	if($obj.parent().hasClass('js-staggerSlide-left')){
		TweenMax.staggerFromTo($obj, .7, {x:-20,opacity:0},{x:0,opacity:1,delay:.3},.15, function(){
			$obj.removeAttr('style');
			$obj.parent().removeClass('js-staggerSlide').removeClass('js-staggerSlide-left');
		});
	}else if($obj.parent().hasClass('js-staggerSlide-right')){
		TweenMax.staggerFromTo($obj, .7, {x:20,opacity:0},{x:0,opacity:1,delay:.3},.15, function(){
			$obj.removeAttr('style');
			$obj.parent().removeClass('js-staggerSlide').removeClass('js-staggerSlide-right');
		});
	}else if($obj.parent().hasClass('js-staggerSlide-top')){
		TweenMax.staggerFromTo($obj, .7, {y:-20,opacity:0},{y:0,opacity:1,delay:.3},.15, function(){
			$obj.removeAttr('style');
			$obj.parent().removeClass('js-staggerSlide').removeClass('js-staggerSlide-top');
		});
	}else if($obj.parent().hasClass('js-staggerSlide-bottom')){
		TweenMax.staggerFromTo($obj, .7, {y:20,opacity:0},{y:0,opacity:1,delay:.3},.15, function(){
			$obj.removeAttr('style');
			$obj.parent().removeClass('js-staggerSlide').removeClass('js-staggerSlide-bottom');
		});
	}else{
		TweenMax.staggerFromTo($obj, .7, {y:20,opacity:0},{y:0,opacity:1,delay:.3},.15, function(){
			$obj.removeAttr('style');
			$obj.parent().removeClass('js-staggerSlide');
		});
	}
}

/* -----------------------------------------------
 * SP メニュー
 * ----------------------------------------------- */
$menuBtn.addEventListener	('click', function(e) {
	let h_gnav = Number(window.outerHeight());
	if (!is_gnav) {
		if (!is_open) {
			_sTop = window.scrollTop();
			is_open = true;
			is_gnav = true;
			$menuBtn.addClass("is-open");
			$wrapper.css({
				"position": "fixed",
				"top" : -(_sTop),
				"left" : 0
			});
			$gnav.velocity({height:h_gnav},{duration:300, easing:"ease-in-out", complete:function(){is_gnav = false;}});
		} else {
			$wrapper.removeAttr('style');
			window.scrollTop(_sTop);
			is_open = false;
			is_gnav = true;
			$menuBtn.removeClass("is-open");
			$gnav.velocity({height:0},{duration:300, easing:"ease-in-out", complete:function(){is_gnav = false;}});
		}
	}
});


/* -----------------------------------------------
 * マウスオーバー - フェード
 * ----------------------------------------------- */
if (!_SP) {
	for(let hoverCount = 0; hoverCount < $hover.length; hoverCount++){
		$hover[hoverCount].addEventListener("hover",
			function(){
				$(this)
					.stop()
					.animate({opacity: 0.5},{duration: 200});
			},function(){
				$(this)
					.stop()
					.animate({opacity: 1},{duration: 200});
			}
		);
	}
}

/* -----------------------------------------------
 * ページトップ スクロール
 * ----------------------------------------------- */
$pageTop.addEventListener('click', function(e){
	e.preventDefault();
	if (!is_pageTop) {
		is_pageTop = true;
		$html.velocity("scroll", {duration:800, easing:"ease-in-out", complete:function(){is_pageTop = false;}});
	}
});
/* -----------------------------------------------
 * アンカークリック
 * ----------------------------------------------- */
for (var ancCount = 0; ancCount < $ancLink.length; ancCount++) {
	$ancLink[ancCount].addEventListener("click", function(e){
		e.preventDefault();
		let href = $(this).attr("href");
		scrollAnc(href, 500);
	})
}
function scrollAnc($object, $speed) {
	let hash = $object;
	let target;
	let t_hash;
	let headerHeight;
	let h_h = $(".header").outerHeight();
	if(hash==="#") {
		t_hash = 0;
	} else {
		target = $(hash);
	}
	target.stop().velocity("scroll", {duration: $speed, offset: -h_h, easing: "ease-in-out" });
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
$(document).on(scroll_event,scrolloff);
// $(document).on('touchmove.noScroll', function(e) {e.preventDefault();});
window.addEventListener( 'touchmove', scrolloff, {passive: false} );
}
function return_scroll(){
$(document).off(scroll_event);
// $(document).off('.noScroll');
window.removeEventListener( 'touchmove', scrolloff, {passive: false} );
}


/* -----------------------------------------------
 * ユーザーエージェントを取得
 * ----------------------------------------------- */
function setUA() {
	let ua = navigator.userAgent.toLowerCase();  //エージェント取得
	let ver = navigator.appVersion.toLowerCase(); //バージョンを取得

	let isMSIE = (ua.indexOf('msie') > -1) && (ua.indexOf('opera') == -1); // IE(11以外)
	let isIE6 = isMSIE && (ver.indexOf('msie 6.') > -1); // IE6
	let isIE7 = isMSIE && (ver.indexOf('msie 7.') > -1); // IE7
	let isIE8 = isMSIE && (ver.indexOf('msie 8.') > -1); // IE8
	let isIE9 = isMSIE && (ver.indexOf('msie 9.') > -1); // IE9
	let isIE10 = isMSIE && (ver.indexOf('msie 10.') > -1); // IE10
	let isIE11 = (ua.indexOf('trident/7') > -1); // IE11
	let isIE = isMSIE || isIE11; // IE
	let isEdge = (ua.indexOf('edge') > -1); // Edge

	let isChrome = (ua.indexOf('chrome') > -1) && (ua.indexOf('edge') == -1); // Google Chrome
	let isFirefox = (ua.indexOf('firefox') > -1); //Firefox
	let isSafari = (ua.indexOf('safari') > -1) && (ua.indexOf('chrome') == -1); // Safari
	let isOpera = (ua.indexOf('opera') > -1); // Opera
}


// /* -----------------------------------------------
//  * FastClick.js
//  * ----------------------------------------------- */
// if ('addEventListener' in document) {
// 	document.addEventListener('DOMContentLoaded', function() {
// 		FastClick.attach(document.body);
// 	}, false);
// }
