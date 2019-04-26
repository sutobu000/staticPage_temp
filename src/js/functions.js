$(function() {
	console.log("js start");

	var $window = $(window);
	var $htmlbody = $("html, body");
	var $html = $("html");
	var $body = $("body");

	/* --- Common variable --- */
	var $wrapper = $(".wrapper");
	var $wrapper_bg = $(".wrapper__bg");
	var ww = $window.width();
	var wh = $window.height();
	var w_breakPoint = 767;

	var s_top = $window.scrollTop();
	var _sTop;
	var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

	/* --- Header, Gnavi, Footer --- */
	var $header = $(".header");
	var $gnav = $(".gnav");
	var $footer = $(".footer");

	/* --- 画像preload --- */
	var is_ready = false;
	var is_cssImg = false;
	var allImage = $(".main img");
	var allImageCount = allImage.length;
	var completeImageCount = 0;

	var cssImgResults = [];
	var cssSheets = document.styleSheets;
	var completecssImageCount = 0;

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

	/* --- SPメニュー --- */
	var $menuBtn = new $(".header__menubtn");
	var is_gnav = false;
	var is_open = false;

	/* --- モーダル - Youtube - --- */
	var $yt_modal = $(".yt_modal");
	var $yt_modal_close = $(".yt_modal_close");
	var $yt_modal_player = $(".yt_modal_player");
	var $yt_modal_player_obj = $(".yt_modal_player_obj");
	var ratio_type = 0;
	var $yt_list_block = $(".videoBox");
	var yt_modal_flag = false;
	var m_width = 0;
	var m_height = 0;


	/* --- pageTop --- */
	var $pageTop = $(".pageTop");
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

		ytMovieResize(ww,wh);
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
		for (var i = 0; i < staggerSlideArr.length; i++) {
			if (!staggerSlideFlagArr[i] && staggerSlideTopArr[i] <= _sBtm - diffVal) {
				staggerSlideFlagArr[i] = true;
				staggerSlideInAnime(staggerSlideArr[i].children());
			}
		}

	});

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
			$obj.removeAttr('style');
			$obj.removeClass('js-slideIn');
		}});
	}

	/* 連続した下から右 */
	$staggerSlide.children().css("opacity","0");
	$staggerSlide.each(function(i, ele) {
		var $this = $(ele);
		staggerSlideArr[i] = $this;
		staggerSlideFlagArr[i] = false;
		staggerSlideTopArr[i] = $this.offset().top;
	});
	function staggerSlideInAnime($obj){
		TweenMax.staggerFromTo($obj, .7, {x:20,opacity:0},{x:0,opacity:1,delay:.3},.15, function(){
      $obj.removeAttr('style');
      $obj.parent().removeClass('js-staggerSlide');
    });
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
	 * モーダル - Youtube -
	 * ----------------------------------------------- */
	$yt_list_block.on("click", function(e) {
		var $this = $(this);

		// youtube
		var mURL = "//www.youtube.com/embed/" + $this.attr('rel') + "?autoplay=1&controls=0&loop=1&modestbranding=1&rel=0&showinfo=0&start=1&enablejsapi=1";
		var mURL_stop = "//www.youtube.com/embed/" + $this.attr('rel') + "?autoplay=0&controls=0&loop=1&modestbranding=1&rel=0&showinfo=0&start=1&enablejsapi=1";
		// https://www.youtube.com/watch?v=rjPCvTdOG0M&feature=youtu.be
		var mURL_watch = "//www.youtube.com/watch?v=" + $this.attr('rel') + "&feature=youtu.be";
		$yt_modal_player.html("<iframe src='" + mURL + "' width='100%' height='100%'></iframe>");
		$yt_modal_player.find("iframe").addClass("yt_modal_player_obj");
		$yt_modal_player_obj = $(".yt_modal_player_obj");
		setTimeout(function(){
			ytMovieResize(ww,wh);
		}, 200);

		// yt_modal
		s_top = $window.scrollTop();
		$wrapper.css({
			"position": "fixed",
			"top" : -(s_top),
			"left" : 0,
			"z-index" : "9999",
			"overflow-y": "scroll"
		});
		$yt_modal.addClass('is-open');
		$yt_modal.velocity({opacity: 1},{duration:300, easing:"ease-in-out"});
	});
	$(".yt_modal_close, .yt_modal_bg").on("click", function(e){
		e.preventDefault();
		var $p_yt_modal = $(this).parents(".yt_modal");
		if ($p_yt_modal.hasClass('is-open')) {
			$p_yt_modal.velocity({opacity: 0},{duration:300, easing:"ease-in-out", complete:function(){
				$p_yt_modal.removeClass('is-open');
				$wrapper.removeAttr('style');
				$window.scrollTop(s_top);
				$yt_modal_player.empty();
			}});
		}
	});
	/* -------------------------------------------------------
	 モーダルYoutubeのリサイズ -
	 ------------------------------------------------------- */
	function ytMovieResize(mw, mh){
		var yt_ratio = mw / mh;
		if (yt_ratio < 16/9) {
			var f_mh = mw/16*9;
			$yt_modal_player_obj.height(f_mh);
			$yt_modal_player_obj.width(mw);
		} else {
			var f_mw = mh/9*16;
			$yt_modal_player_obj.width(f_mw);
			$yt_modal_player_obj.height(wh);
		}
	}

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
	 * ページトップ　スクロール
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