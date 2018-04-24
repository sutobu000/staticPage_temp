$(function() {

	const $window = $(window);
	const $html = $("html, body");

	/* --- Common variable --- */
	var $wrapper = $(".container");
	var $wrapper_bg = $(".wrapper_bg");
	var ww = $window.width();
	var wh = $window.height();

	var s_top = $window.scrollTop();

	/* --- Header, Gnavi --- */
	var $header = $(".header");
	var h_wh = wh - $header.height();
	var $gnavItem = $(".gnav_item");

	/* --- 画像preload --- */
	var allImage = $("main img");
	var allImageCount = allImage.length;
	var completeImageCount = 0;

	/* --- スライドフェードイン --- */
	var $slideIn = $(".js-slideIn");
	var slideInArr = [];
	var slideInFlagArr = [];
	var slideInTopArr = [];
	$slideIn.css('opacity', 0);
		
	var $staggerSlide = $(".js-staggerSlide");
	var staggerSlideArr = [];
	var staggerSlideFlagArr = [];
	var staggerSlideTopArr = [];
	$staggerSlide.children("*").css('opacity', 0);

	/* --- スクロール --- */
	var $visualScroll = $(".topVisual_scroll");
	var $visual = $(".topVisual");
	var is_scroll = false;

	/* --- スクロール current --- */
	var $scrollAnc = $(".js-scrollAnc");
	var scrollAncArr = [];
	var scrollAncTopArr = [];

	/* -- First View Scroll -- */
	var top_flag = false;
	var scroll_flag = true;
	var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	var _sTop;

	/* --- SPメニュー --- */
	var $menuBtn = new $(".header_hum");
	var $gnav = $(".header_block");
	var is_gnav = false;
	var is_open = false;

	/* --- モーダル --- */
	var $modal = $(".modal");
	var $modal_close = $(".modal_close");
	var $modal_player = $(".modal_player");
	var $modal_player_obj = $(".modal_player_obj");
	var ratio_type = 0;
	var $list_block = $(".videoBox");
	var modal_flag = false;
	var m_width = 0;
	var m_height = 0;

	/* --- pageTop --- */
	var $pageTop = $(".pageTop");
	var is_pageTop = false;

	var _SP = false;
	if (ww > 767) {
		_SP = false;
	} else {
		_SP = true;
	}

	$window.resize(function(e) {
		ww = $window.width();
		wh = $window.height();
		if (ww > 767) {
			_SP = false;
		} else {
			_SP = true;
		}

		movieResize(ww,wh);
	});

	setUA();

	/* -----------------------------------------------
	 * Ready
	 * ----------------------------------------------- */
	$(document).ready(function() {
		_sTop = parseInt( $window.scrollTop());
		if (!_SP) {
			if(_sTop === 0) {
				no_scroll();
			} else {
				top_flag = true;
			}
		}
		if (allImageCount < 1) {
			readyInit();
			setUA();
		} else {
			for(var i = 0; i < allImageCount; i++){
				var image = new Image();
				var $src = $(allImage[i]).attr('src');
				image.src = $src;

				var $new = $('<img src="" >');
				$(allImage[i]).css('opacity', '0');

				if (!$src || image.width == 0) {
					completeImageCount++;
				}

				$new.on("load", function() {
					completeImageCount++;
					if (allImageCount == completeImageCount){
						allImage.removeAttr('style');
						setTimeout(function(){
							readyInit();
							setUA();
						},200);
					is_ready = true;
					}
				})
			$new.attr("src",$(allImage[i]).attr('src'));
			}
		}
	});

	// deSVG($obj, true); // deSVG適用

	function readyInit() {
		/* SP時のfirstviewの高さ */
		if (_SP) {
			$visual.height(h_wh);
		}

		/* ホワイトバック */
		$wrapper_bg.velocity({opacity: 0},{duration:500, easing:"ease-out", complete:function(){
			$wrapper_bg.remove();
			scroll_flag = false;
		}});

		/* firstview */
		logoAnime(false);
		TweenMax.fromTo($visualScroll, .8, {y: -30, opacity: 0}, {ease: Cubic.easeOut, y: 0, opacity: 1, delay:.8});


		/* スクロール　アニメ */
		var wscroll = $window.scrollTop() + wh;
		for (var i = 0; i < slideInTopArr.length; i++) {
			if (slideInTopArr[i] <= wscroll) { slideInFlagArr[i] = true; slideInAnime(slideInArr[i]); }
		}
		for (var i = 0; i < scaleInTopArr.length; i++) {
			if (scaleInTopArr[i] <= wscroll) { scaleInFlagArr[i] = true; scaleInAnime(scaleInArr[i]); }
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

		/* スクロール　アニメ */
		for (var i = 0; i < slideInArr.length; i++) {
			if (!slideInFlagArr[i] && slideInTopArr[i] <= _sBtm - 100) {
				slideInFlagArr[i] = true;
				slideInAnime(slideInArr[i]);
			}
		}

		for (var i = 0; i < staggerSlideArr.length; i++) {
			if (!staggerSlideFlagArr[i] && staggerSlideTopArr[i] <= _sBtm - 100) {
				staggerSlideFlagArr[i] = true;
				staggerSlideInAnime(staggerSlideArr[i].children());
			}
		}

		/* スクロール gnav */
		var scrollAncNum = -1;
		for (var i = 0; i < scrollAncArr.length; i++) {
			$gnavItem.eq(i).removeClass('is-current');
			if (scrollAncTopArr[i] <= _sBtm) {
				scrollAncNum++;
			}
			if (scrollAncNum === i) {
				$gnavItem.removeClass('is-current');
				$gnavItem.eq(i).addClass('is-current');
			}
		}

		/* pagetop */
		if (_sTop > 100) {
			$pageTop.addClass('is-active');
		} else {
			$pageTop.removeClass('is-active');
		}

		/* main view */
		if (!_SP) {
			if ($mainAirSX.offset().top <= _sBtm) {
				mainAnime();
			}
		} else {
			if ($mainAirSX.offset().top <= _sBtm - 100) {
				mainAirSXAnime();
			}
			if ($mainVText.offset().top <= _sBtm - 100) {
				mainVTextAnime();
			}
		}

		/* spec */
		if ($specInner.offset().top <= _sBtm - 100) {
			specAnime();
		}
	});

	/* -----------------------------------------------
	 * First View Scroll
	 * ----------------------------------------------- */
	$window.on(mousewheelevent,function(e){
		if (!_SP) {
			if(!scroll_flag) {
				if(_sTop === 0&&!top_flag) {
					if(e.originalEvent.deltaY) {
						var delta = e.originalEvent.deltaY;
						if(delta > 10) {
							logoAnime(true);
							scroll_flag = true;
						}
					} else {
						var delta = e.originalEvent.wheelDelta;
						if(delta < -10) {
							logoAnime(true);
							scroll_flag = true;
						}
					}
				}
			}
		}
	});

	/* -----------------------------------------------
	 * First View Click
	 * ----------------------------------------------- */
	/* --- スクロール --- */
	$visualScroll.on('click', function(e) {
		if(scroll_flag) {
			if (!is_scroll) {
				var visualScrollTo = $visual.height() - $header.height();
				is_scroll = true;
				no_scroll();
				$visual.stop().velocity("scroll", {duration:1200, offset:visualScrollTo, easing:"ease-in-out", complete:function(){
					is_scroll = false;
					return_scroll();
				}});
			}
		} else {
			logoAnime(true);
			scroll_flag = true;
		}
	});


	/* -----------------------------------------------
	 * Main View Animation
	 * ----------------------------------------------- */
	function mainAnime() {
		if (!mainAnimeFlag) {
			mainAnimeFlag = true;
			TweenMax.staggerFromTo($mainVText.children(), .7, {x:20,opacity:0},{x:0,opacity:1,delay:.5},.3);
			TweenMax.staggerFromTo($mainAirSX.children(), .7, {x:20,opacity:0},{x:0,opacity:1,delay:1},.15);
		}
	}
	function mainAirSXAnime() {
		if (!mainAirSXAnimeFlag) {
			mainAirSXAnimeFlag = true;
			TweenMax.staggerFromTo($mainAirSX.children(), .7, {y:20,opacity:0},{y:0,opacity:1,delay:.3},.15);
		}
	}
	function mainVTextAnime() {
		if (!mainVTextAnimeFlag) {
			mainVTextAnimeFlag = true;
			TweenMax.staggerFromTo($mainVText.children(), .7, {x:20,opacity:0},{x:0,opacity:1,delay:.3},.15);
		}
	}


	/* -----------------------------------------------
	 * アンカークリック
	 * ----------------------------------------------- */
	$gnavItem.find("a").on("click", function(e) {
		e.preventDefault();
		if(_SP){
			$wrapper.removeAttr('style');
			$window.scrollTop(s_top);
			is_open = false;
			is_gnav = true;
			$menuBtn.removeClass("is-open");
			$gnav.velocity({height:0},{duration:300, easing:"ease-in-out", complete:function(){is_gnav = false;}});
		}
		scrollAnc($(this).attr('href'), 800);
		// return false;
	});
	function  scrollAnc($object, $speed) {
		var hash = $object;
		var target;
		var t_hash;
		var headerHeight;
		if(hash==="#") {
			t_hash = 0;
		} else {
			target = $(hash);
			if (!_SP) {
				t_hash = target.offset().top - 90;
			} else {
				t_hash = target.offset().top - 40;
			}
		}
		$html.animate({scrollTop: t_hash}, $speed, "swing");
	}

	/* -----------------------------------------------
	 * slideIn
	 * ----------------------------------------------- */

	/* 下から上へ */
	$slideIn.each(function(i, ele) {
		var $this = $(ele);
		slideInArr[i] = $this;
		slideInFlagArr[i] = false;
		slideInTopArr[i] = $this.offset().top;
	});
	function slideInAnime($obj){
		TweenMax.killTweensOf($obj);
		TweenMax.fromTo($obj, .7, {y:20,opacity:0},{y:0,opacity:1,delay:.3,onComplete: function(){
			// $obj.removeAttr('style');
			$obj.removeClass('js-slideIn');
		}});
	}

	/* 連続した左から右 */
	$staggerSlide.children().css("opacity","0");
	$staggerSlide.each(function(i, ele) {
		var $this = $(ele);
		staggerSlideArr[i] = $this;
		staggerSlideFlagArr[i] = false;
		staggerSlideTopArr[i] = $this.offset().top;
	});
	function staggerSlideInAnime($obj){
		TweenMax.staggerFromTo($obj, .7, {x:20,opacity:0},{x:0,opacity:1,delay:.3},.15);
	}


	/* -----------------------------------------------
	 * scrollAnc Current
	 * ----------------------------------------------- */
	$scrollAnc.each(function(i, ele) {
		var $this = $(ele);
		scrollAncArr[i] = $this;
		scrollAncTopArr[i] = $this.offset().top;
	});


	/* -----------------------------------------------
	 * SP メニュー
	 * ----------------------------------------------- */
	$menuBtn.on('click', function(e) {
		// var h_header = $header.height();
		// var h_gnav = Number($window.outerHeight() - h_header);
		var h_gnav = Number($window.outerHeight());
		if (!is_gnav) {
			if (!is_open) {
				s_top = $window.scrollTop();
				// console.log(s_top);
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
	 * モーダル - Youtube -
	 * ----------------------------------------------- */

	$list_block.on("click", function(e) {
		var $this = $(this);

		// youtube
		var mURL = "//www.youtube.com/embed/" + $this.attr('rel') + "?autoplay=1&controls=0&loop=1&modestbranding=1&rel=0&showinfo=0&start=1&enablejsapi=1";
		var mURL_stop = "//www.youtube.com/embed/" + $this.attr('rel') + "?autoplay=0&controls=0&loop=1&modestbranding=1&rel=0&showinfo=0&start=1&enablejsapi=1";
		// https://www.youtube.com/watch?v=rjPCvTdOG0M&feature=youtu.be
		var mURL_watch = "//www.youtube.com/watch?v=" + $this.attr('rel') + "&feature=youtu.be";
		$modal_player.html("<iframe src='" + mURL + "' width='100%' height='100%'></iframe>");
		$modal_player.find("iframe").addClass("modal_player_obj");
		$modal_player_obj = $(".modal_player_obj");
		setTimeout(function(){
			movieResize(ww,wh);
		}, 200);

		// modal
		s_top = $window.scrollTop();
		$wrapper.css({
			"position": "fixed",
			"top" : -(s_top),
			"left" : 0,
			"z-index" : "1000",
			"overflow-y": "scroll"
		});
		$modal.addClass('is-open');
		$modal.velocity({opacity: 1},{duration:300, easing:"ease-in-out"});
	});
	$(".modal_close, .modal_bg").on("click", function(e){
		e.preventDefault();
		var $p_modal = $(this).parents(".modal");
		if ($p_modal.hasClass('is-open')) {
			$p_modal.velocity({opacity: 0},{duration:300, easing:"ease-in-out", complete:function(){
				$p_modal.removeClass('is-open');
				$wrapper.removeAttr('style');
				$window.scrollTop(s_top);
				$modal_player.empty();
		}});
		}

	});

	/* -------------------------------------------------------
	 モーダルYoutubeのリサイズ
	 ------------------------------------------------------- */
	function movieResize(mw, mh){
		var f_ratio = mw / mh;
		if (f_ratio < 16/9) {
			var f_mh = mw/16*9;
			$modal_player_obj.height(f_mh);
			$modal_player_obj.width(mw);
		} else {
			var f_mw = mh/9*16;
			$modal_player_obj.width(f_mw);
			$modal_player_obj.height(wh);
		}
	}


	/* -----------------------------------------------
	 * マウスオーバー - フェード
	 * ----------------------------------------------- */
	if (!_SP) {
		$('.is-hover').hover(
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
	 * ページトップ　スクロール
	 * ----------------------------------------------- */
	$pageTop.on('click', function(){
		if (!is_pageTop) {
			is_pageTop = true;
			$html.velocity("scroll", {duration:800, easing:"ease-in-out", complete:function(){is_pageTop = false;}});
		}
	});


	/* -----------------------------------------------
	 * cookie取得
	 * ----------------------------------------------- */
	function getQuery() {
		$.cookie('is_cookie','1',{ path: "/shop/by/data/special/2018spring" }); // cookieを発行するディレクトリを指定
	}

	/* -----------------------------------------------
	 * cookieリセット
	 * ----------------------------------------------- */
	function resetQuery() {
		$.removeCookie("is_cookie", { path: "/shop/by/data/special/2018spring" });
	}
	/* -----------------------------------------------
	 * cookieリセット - URLクエリ -
	 * ----------------------------------------------- */
	var l_href = location.href;
	var k_word = "?t_reset";
	if(l_href.indexOf(k_word) != -1) {
		resetQuery();
	}


});

/* -----------------------------------------------
 * スクロール禁止用関数
 * ----------------------------------------------- */
function no_scroll(){
	var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	$(document).on(scroll_event,function(e){e.preventDefault();});
}
/* -----------------------------------------------
 * スクロール復活用関数
 * ----------------------------------------------- */
function return_scroll(){
	var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	$(document).off(scroll_event);
}

/* -----------------------------------------------
 * FastClick.js
 * ----------------------------------------------- */
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
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