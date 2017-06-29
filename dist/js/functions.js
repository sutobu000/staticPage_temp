;(function($,window,undefind) {

	var $window = $(window);
	var $pageTop = $(".btnPagetop");
	var is_pagetop = false;

	setUA();

	/* -----------------------------------------------
	 * マウスオーバー - フェード
	 * ----------------------------------------------- */
	$('.object').hover(
		function(){
			$(this)
				.stop()
				.animate({opacity: 0.7},{duration: 100});
		},function(){
			$(this)
				.stop()
				.animate({opacity: 1},{duration: 100});
		}
	);

	/* -----------------------------------------------
	 * スライダー
	 * ----------------------------------------------- */
	var mySwiper = new Swiper('.swiper-container', {
		speed: 800,
		spaceBetween: 0,
		autoplay: 6000,
		pagination: '.swiper-pagination',
		paginationClickable: true,
		nextButton: '.swiper-button-next',
		prevButton: '.swiper-button-prev',
		scrollbar: '.swiper-scrollbar',
		scrollbarHide: true
	});

	/* -----------------------------------------------
	 * スクロールイベント
	 * ----------------------------------------------- */
	$window.on('scroll', function (e) {
		e.preventDefault();
		var _h 		= $window.height(),
			_sTop   = parseInt($window.scrollTop()),
			_sMdl   = _sTop + _h / 2,
			_sBtm   = _sTop + _h,
			scrollHeight = $(document).height(),
			scrollPosition = $window.height() + $window.scrollTop(),
			footHeight = $("footer").height();

		/* -----------------------------------------------
		 * ページトップの固定
		 * ----------------------------------------------- */
	    if ( scrollHeight - scrollPosition  <= footHeight ) {
	        // ページトップリンクをフッターに固定
	        $pageTop.css({"position":"fixed", "bottom": scrollPosition-scrollHeight+footHeight+31});
	    } else {
	        // ページトップリンクを右下に固定
	        $pageTop.css({"position":"fixed", "bottom": "31px"});
	    }

		/* -----------------------------------------------
		 * ページトップの表示/非表示
		 * ----------------------------------------------- */
		if (_sTop <= 50) {
			if (!is_pagetop) return;
			is_pagetop = false;
			$pageTop
				.stop()
				.animate({
					bottom: 20,
					opacity: 0
				}, {
					duration: 300
				});
		} else if (_sTop > 50) {

			if (is_pagetop) return;

			is_pagetop = true;
			$pageTop
				.stop()
				.css({
					display: 'block',
					opacity: 0,
					bottom: 20
				})
				.animate({
					bottom: 31,
					opacity: 1
				}, {
					duration: 300
				});

		};

	});

	/* -----------------------------------------------
	 * ページトップ　スクロール
	 * ----------------------------------------------- */
	$pagetop.on('click', function(e){

		e.preventDefault();

		TweenLite.to(window, 0.8, {ease:Circ, scrollTo:0});

	});

	/* -----------------------------------------------
	 * 文字数制限
	 * ----------------------------------------------- */

	function textNum($setElm, cutFigure, afterTxt){
	    $setElm.each(function(){
	        var textLength = $(this).text().length;
	        var textTrim = $(this).text().substr(0,(cutFigure))
	 
	        if(cutFigure < textLength) {
	            $(this).html(textTrim + afterTxt).css({visibility:'visible'});
	        } else if(cutFigure >= textLength) {
	            $(this).css({visibility:'visible'});
	        }
	    });
	}

})(jQuery,window);

/* -----------------------------------------------
 * オートスクロール
 * ----------------------------------------------- */
function autoScroll(opt_hash, opt_delay, opt_duration, opt_easing){

	var target_pos;
	var $html = $("html,body");

	if(opt_hash == '#'){
		return;
	}

	target_pos = $(opt_hash).offset().top;
	// target_pos-= parseInt($menu.height()) + 10;

	$html
		.delay(opt_delay)
		.animate({
			scrollTop: target_pos
		},{
			duration: opt_duration,
			easing: opt_easing
		});
};

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
	 
	// 使用例
	if(isIE) alert('IE');
	if(isIE6) alert('IE6');
	if(isIE7) alert('IE7');
	if(isIE8) alert('IE8');
	if(isIE9) alert('IE9');
	if(isIE10) alert('IE10');
	if(isIE11) alert('IE11');
	if(isEdge) alert('Edge');
	if(isChrome) alert('Google Chrome');
	if(isFirefox) alert('Firefox');
	if(isSafari) alert('Safari');
	if(isOpera) alert('Opera');
}