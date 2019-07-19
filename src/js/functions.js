$(function() {
	console.log("js start");

	let $window = $(window);
	let $htmlbody = $("html, body");
	let $html = $("html");
	let $body = $("body");

	/* --- Common letiable --- */
	let $wrapper = $(".wrapper");
	let $wrapper_bg = $(".wrapper__bg");
	let ww = $window.width();
	let wh = $window.height();
	let w_breakPoint = 767;

	let s_top = $window.scrollTop();
	let _sTop;
	let mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

	/* --- Header, Gnavi, Footer --- */
	let $header = $(".header");
	let $gnav = $(".gnav");
	let $footer = $(".footer");

	/* --- 画像preload --- */
	let is_ready = false;
	let is_cssImg = false;
	let allImage = $(".main img");
	let allImageCount = allImage.length;
	let completeImageCount = 0;

	let cssImgResults = [];
	let cssSheets = document.styleSheets;
	let completecssImageCount = 0;

	/* --- スライドフェードイン --- */
	let $slideIn = $(".js-slideIn");
	let slideInArr = [];
	let slideInFlagArr = [];
	let slideInTopArr = [];
	$slideIn.css('opacity', 0);

	let $staggerSlide = $(".js-staggerSlide");
	let staggerSlideArr = [];
	let staggerSlideFlagArr = [];
	let staggerSlideTopArr = [];
	$staggerSlide.children("*").css('opacity', 0);

	/* --- SPメニュー --- */
	let $menuBtn = new $(".header__menubtn");
	let is_gnav = false;
	let is_open = false;



	/* --- pageTop --- */
	var $pageTop = $(".pagetop");
	var is_pageTop = false;

	var _SP = false;
	if (ww > w_breakPoint) {
		_SP = false;
	} else {
		_SP = true;
	}

	$window.resize(function(e) {
		ww = $window.width();
		wh = $window.height();
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
	$(document).ready(function() {
		// console.log("ready");
		var tags = document.getElementsByTagName("*");
		try{
			if (Array.from) {
				var classesEle = Array.from(document.querySelectorAll('[class]')); // 全要素からクラス名を持つ要素を取得
				var classes = [];
				for (var i = 0; i < classesEle.length; i++) {
					classes.push(Array.from(classesEle[i].classList));
				}
				var flatten = Array.prototype.concat.apply([], classes);
				var set = new Set(flatten);
				var arrSet = Array.from(set); // 開いているHTMLから全クラス名を取得
				var cssStyle = [];
				for (var i = 0; i < arrSet.length; i++) {
					var block = document.getElementsByClassName(arrSet[i]);
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
					for(var j = 0; j < cssStyle.length; j++){
						var img = new Image();
						var $cssnew = $('<img src="" >');
						// var imgurl = cssStyle[j].slice(5).slice(0, -2);
						var imgurl = cssStyle[j].replace(/"/g, '');
						imgurl = imgurl.slice(4).slice(0, -1);
						$cssnew.attr("src", imgurl); 
						$cssnew.on("load", function(response, status, xhr) {
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
				for(var i = 0; i < allImageCount; i++){
					var image = new Image();
					var $src = $(allImage[i]).attr('src');
					image.src = $src;
					var $new = $('<img src="" >');
					$(allImage[i]).css('opacity', '0');
					if (!$src || image.width == 0) {
						completeImageCount++;
					}else{
						$new.on("load", function() {
							completeImageCount++;
							if (allImageCount == completeImageCount){
								allImage.removeAttr('style');
								setTimeout(function(){
									readyInit();
								},100);
							}
						})
					}
				$new.attr("src",$(allImage[i]).attr('src'));
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
		var wscroll = $window.scrollTop() + wh;
		for (var i = 0; i < slideInTopArr.length; i++) {
			if (slideInTopArr[i] <= wscroll) { slideInFlagArr[i] = true; slideInAnime(slideInArr[i]); }
		}
		for (var i = 0; i < staggerSlideTopArr.length; i++) {
			if (staggerSlideTopArr[i] <= wscroll) { staggerSlideFlagArr[i] = true; staggerSlideInAnime(staggerSlideArr[i].children()); }
		}

	}


	/* -----------------------------------------------
	 * - スクロール -
	 * ----------------------------------------------- */
	$window.on('scroll', function (e) {
		e.preventDefault();
		_sTop = document.body.scrollTop || document.documentElement.scrollTop;
		wh = $window.height();
		var _sMdl = _sTop + wh / 2;
		var _sBtm = _sTop + wh;
		var diffVal = 100

		/* slideIn */
		for (var i = 0; i < slideInArr.length; i++) {
			if (!slideInFlagArr[i] && slideInTopArr[i] <= _sBtm - diffVal) {
				slideInFlagArr[i] = true;
				slideInAnime(slideInArr[i]);
			}
		}
		/* staggerSlide */
		for (var i = 0; i < staggerSlideArr.length; i++) {
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
	$slideIn.each(function(i, ele) {
		var $this = $(ele);
		slideInArr[i] = $this;
		slideInFlagArr[i] = false;
		slideInTopArr[i] = $this.offset().top;
	});
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
	$staggerSlide.children().css("opacity","0");
	$staggerSlide.each(function(i, ele) {
		var $this = $(ele);
		staggerSlideArr[i] = $this;
		staggerSlideFlagArr[i] = false;
		staggerSlideTopArr[i] = $this.offset().top;
	});
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
	$menuBtn.on('click', function(e) {
		var h_gnav = Number($window.outerHeight());
		if (!is_gnav) {
			if (!is_open) {
				s_top = $window.scrollTop();
				is_open = true;
				is_gnav = true;
				$menuBtn.addClass("is-open");
				$wrapper.css({
					"position": "fixed",
					"top" : -(s_top),
					"left" : 0
				});
				$gnav.velocity({height:h_gnav},{duration:300, easing:"ease-in-out", complete:function(){is_gnav = false;}});
			} else {
				$wrapper.removeAttr('style');
				$window.scrollTop(s_top);
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
		$('.js-hover').hover(
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

	/* -----------------------------------------------
	 * ページトップ スクロール
	 * ----------------------------------------------- */
	$pageTop.on('click', function(e){
		e.preventDefault();
		if (!is_pageTop) {
			is_pageTop = true;
			$htmlbody.velocity("scroll", {duration:800, easing:"ease-in-out", complete:function(){is_pageTop = false;}});
		}
	});
	/* -----------------------------------------------
	 * アンカークリック
	 * ----------------------------------------------- */
	$("a[href^='#']").on("click", function(e){
		e.preventDefault();
		var href = $(this).attr("href");
		scrollAnc(href, 500);
	})
	function scrollAnc($object, $speed) {
		var hash = $object;
		var target;
		var t_hash;
		var headerHeight;
		var h_h = $(".header").outerHeight();
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
	var l_href = location.href;
	var k_word = "?t_reset";
	if(l_href.indexOf(k_word) != -1) {
		resetQuery();
	}
  /* -----------------------------------------------
   * スクロール禁止復活用関数
   * ----------------------------------------------- */
  var scrolloff = function( event ) {event.preventDefault();}
  var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
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
		var ua = navigator.userAgent.toLowerCase();  //エージェント取得
		var ver = navigator.appVersion.toLowerCase(); //バージョンを取得

		var isMSIE = (ua.indexOf('msie') > -1) && (ua.indexOf('opera') == -1); // IE(11以外)
		var isIE6 = isMSIE && (ver.indexOf('msie 6.') > -1); // IE6
		var isIE7 = isMSIE && (ver.indexOf('msie 7.') > -1); // IE7
		var isIE8 = isMSIE && (ver.indexOf('msie 8.') > -1); // IE8
		var isIE9 = isMSIE && (ver.indexOf('msie 9.') > -1); // IE9
		var isIE10 = isMSIE && (ver.indexOf('msie 10.') > -1); // IE10
		var isIE11 = (ua.indexOf('trident/7') > -1); // IE11
		var isIE = isMSIE || isIE11; // IE
		var isEdge = (ua.indexOf('edge') > -1); // Edge

		var isChrome = (ua.indexOf('chrome') > -1) && (ua.indexOf('edge') == -1); // Google Chrome
		var isFirefox = (ua.indexOf('firefox') > -1); //Firefox
		var isSafari = (ua.indexOf('safari') > -1) && (ua.indexOf('chrome') == -1); // Safari
		var isOpera = (ua.indexOf('opera') > -1); // Opera
	}

});

/* -----------------------------------------------
 * FastClick.js
 * ----------------------------------------------- */
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}
