;(function($,window,undefind) {

	var $window = $(window);
	var $pagetop = $(".btnPagetop");
	var is_pagetop = false;

	setUA();


	/* -----------------------------------------------
	 * FastClick.js
	 * ----------------------------------------------- */
	if ('addEventListener' in document) {
	    document.addEventListener('DOMContentLoaded', function() {
	        FastClick.attach(document.body);
	    }, false);
	}

	/* -----------------------------------------------
	 * loadアニメーション　fadeIn/fadeOut
	 * ----------------------------------------------- */
	var $home = $("#home"),
		$main = $home.find("main");
	if($home.offset()){
		$(document).ready(function() {
			$("html,body").animate({scrollTop:0}, "1");		
		});
		$window.load(function() {
			TweenMax.to($home, 1, {opacity:1,delay:1}),
			TweenMax.staggerFromTo($main.children('article'), 1, {y:10,opacity:0},{y:0,opacity:1,delay:2},0.25);
		});
	}
	/* -----------------------------------------------
	 * SP　ドロワーメニュー
	 * ----------------------------------------------- */
	$("header .inner .menu").on("click", function(e) {
		e.preventDefault();
		var $list = $(this).next().find('ul li'),
			tl = new TimelineMax();
		
		$(this).toggleClass('current');
		if($(this).hasClass('current')){
			// $('body,html').css({"overflow":"hidden","height":"100%"});
			var $line1 = $(this).find('span').eq(0),
				$line2 = $(this).find('span').eq(1)
				$line3 = $(this).find('span').eq(2);
			TweenMax.to($line1, .5, {ease:Back.easeInOut,rotation:30,y:14}),
			TweenMax.to($line2, .5, {ease:Back.easeInOut,x:200}),
			TweenMax.to($line3, .5, {ease:Back.easeInOut,rotation:-30,y:-14});

			tl.to($(this).next(), .5, {ease:Power3.easeInOut,height:"100%"})
				.staggerFromTo($list, .3, {x:-10,opacity:0}, {ease:Power3.easeInOut,x:0,opacity:1},0.05);
		}else{
			// $('body,html').css({"overflow":"visible","height":"auto"});
			var $line1 = $(this).find('span').eq(0),
				$line2 = $(this).find('span').eq(1)
				$line3 = $(this).find('span').eq(2);
			TweenMax.to($line1, .3, {rotation:0,y:0}),
			TweenMax.to($line2, .3, {x:0}),
			TweenMax.to($line3, .3, {rotation:0,y:0});
			$list = $list.get().reverse();
			tl.staggerTo($list, .3, {ease:Sine.easeIn,x:-10,opacity:0},.02)
				.to($(this).next(), .3, {ease:Expo.easeInOut,height:0});
		}
	});

	/* -----------------------------------------------
	 * アコーディオン
	 * ----------------------------------------------- */
	$(".sort a").on("click", function() {
		$(this).toggleClass('current');
		$(this).next().slideToggle();
	});

	$(".job h3").on("click", function() {
		$(this).next().slideToggle();
		if($(this).hasClass('current')){
			var $plus = $(this).find('span');
			TweenMax.to($plus, .3, {rotation:0})
			$(this).removeClass('current');
		}else{
			var $plus = $(this).find('span');
			TweenMax.to($plus, .3, {rotation:45})
			$(this).addClass('current');
		}
	});
	$(".close").on("click", function(e) {
		e.preventDefault();
		$(this).parent(".content").prev().removeClass('current');
		$(this).parent(".content").slideToggle();
		var $plus = $(this).parent(".content").parent("section").find('h3 span');
		TweenMax.to($plus, .3, {rotation:0})
	});

	/* -----------------------------------------------
	 * 文字数制限
	 * ----------------------------------------------- */

    textNum($('#home main article.topics ul li a .in-text').find('span'),'32',' …');
    textNum($('#home main article.blog ul li a .in-text').find('span'),'32',' …');
    textNum($('.comment').find('p'),'41',' …');
    textNum($('.entry').find('.detail'),'85',' …');
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
	/* -----------------------------------------------
	 * マウスオーバー - フェード
	 * ----------------------------------------------- */
	$('ul li.fade a').hover(
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

	$('.logo, .fade a').hover(
		function(){
			$(this).find("img")
				.stop()
				.animate({opacity: 0.7},{duration: 100});
		},function(){
			$(this).find("img")
				.stop()
				.animate({opacity: 1},{duration: 300});
		}
	);

	/* -----------------------------------------------
	 * マウスオーバー - ヘッダーナビ
	 * ----------------------------------------------- */

	$('header nav ul li a').hover(
		function(){
			$(this).next('span')
				.css({'right':'100%','opacity':'.5'})
				.stop();
			TweenMax.to($(this).next('span'),.6,{ease:Circ,'right':'0%','opacity':1});
		},function(){
			$(this).next('span')
				.stop();
			TweenMax.to($(this).next('span'),.6,{ease:Circ,'right':'-100%','opacity':.5});
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
	 * トップページアニメーション
	 * ----------------------------------------------- */

		function sideAnime($object, $sec, $x, $delay, $ease) {
			TweenMax.fromTo($object, $sec, {x:$x, opacity:0}, {ease:$ease,x:0,opacity:1,delay:$delay});
		}

		/* -----------------------------------------------
		 * ページトップの固定
		 * ----------------------------------------------- */
	    if ( scrollHeight - scrollPosition  <= footHeight ) {
	        // ページトップリンクをフッターに固定
	        $(".btnPagetop").css({"position":"fixed", "bottom": scrollPosition-scrollHeight+footHeight+31});
	    } else {
	        // ページトップリンクを右下に固定
	        $(".btnPagetop").css({"position":"fixed", "bottom": "31px"});
	    }

		/* -----------------------------------------------
		 * ページトップの表示/非表示
		 * ----------------------------------------------- */
		if (_sTop <= 50) {
			if (!is_pagetop) return;
			is_pagetop = false;
			$pagetop
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
			$pagetop
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
	 * オリエンテーション取得
	 * ----------------------------------------------- */
	function switchOrientation(){
		var orientation = window.orientation;
		if(orientation == 0){
			$("body").addClass("portrait");
			$("body").removeClass("landscape");
		}else{
			$("body").addClass("landscape");
			$("body").removeClass("portrait");
		}

	}

	$(document).ready(function(){
		switchOrientation();
		var agent = navigator.userAgent;
		if(agent.search(/iPhone/) != -1){
			window.onorientationchange = switchOrientation;
		}else{
			window.onresize = switchOrientation;
		}

	});

	/* Android2.3 only */
	$(function(){
		$(window).resize(function(){
			var orientation = window.orientation;
			if(orientation == 0){
				$("body").addClass("portrait");
				$("body").removeClass("landscape");
			}else{
				$("body").addClass("landscape");
				$("body").removeClass("portrait");
			}
		});
	});

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


var ua, agent, isSmp;

function setUA(){

	agent = navigator.userAgent;
	isSmp = false;

	if(jQuery.browser.msie){
		var ver_ = parseInt(jQuery.browser.version);

		switch(ver_){
			case 9:
			ua = 'ie9'; break;

			case 8:
			ua = 'ie8'; break;

			case 7:
			ua = 'ie7'; break;

			case 6:
			ua = 'ie6'; break;
		};

	};

	// スマホ、iPad関連はIE7,8モードで処理
	if(agent.search('iPhone') != -1){
		ua = 'iPhone';
		isSmp = true;
	}else if(agent.search('iPad') != -1){
		ua = 'iPad';
		isSmp = true;
	}else if(agent.search('Android') != -1){
		ua = 'Android';
		isSmp = true;
	};

};

function getParam( opt_key ) {
	var url   = location.href;
	parameters    = url.split("?");
	if(parameters.length < 2) return false;
	params   = parameters[1].split("&");
	var paramsArray = [];
	for ( i = 0; i < params.length; i++ ) {
		neet = params[i].split("=");
		paramsArray.push(neet[0]);
		paramsArray[neet[0]] = neet[1];
	}
	var categoryKey = paramsArray[opt_key];
	return categoryKey;
}


function trace(opt_str){
	//if (jQuery.browser.msie) {return};
	//console.log(opt_str);
};

