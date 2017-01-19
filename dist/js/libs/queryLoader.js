var QueryLoader = {
	/*
	 * QueryLoader		Preload your site before displaying it!
	 * Author:			Gaya Kessler
	 * Date:			23-09-09
	 * URL:				http://www.gayadesign.com
	 * Version:			1.0
	 * 
	 * A simple jQuery powered preloader to load every image on the page and in the CSS
	 * before displaying the page to the user.
	 */
	
	overlay: "",
	loadBar: "",
	preloader: "",
	items: new Array(),
	doneStatus: 0,
	doneNow: 0,
	selectorPreload: "body",
	ieLoadFixTime: 2000,
	ieTimeout: "",
	callback:null,
	preloadWithList:[],
		
	init: function() {
		$(window).scrollTop(0);
		$("body").css({'overflow':'hidden'});
		
		if (navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/) == "MSIE 6.0,6.0") {
			//break if IE6			
			return false;
		}
		if (QueryLoader.selectorPreload == "body") {
			QueryLoader.spawnLoader();
			QueryLoader.getImages(QueryLoader.selectorPreload);
			QueryLoader.createPreloading();
		} else {
			$(document).ready(function() {
				QueryLoader.spawnLoader();
				QueryLoader.getImages(QueryLoader.selectorPreload);
				QueryLoader.createPreloading();
			});
		}
		
		//help IE drown if it is trying to die :)
		QueryLoader.ieTimeout = setTimeout("QueryLoader.ieLoadFix()", QueryLoader.ieLoadFixTime);
	},
	
	ieLoadFix: function() {
		var ie = navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/);
		if (ie && ie[0].match("MSIE")) {
			while ((100 / QueryLoader.doneStatus) * QueryLoader.doneNow < 100) {
				QueryLoader.imgCallback();
			}
		}
	},
	
	imgCallback: function() {
		QueryLoader.doneNow ++;
		QueryLoader.animateLoader();
	},
	
	getImages: function(selector) {
		var everything = $(selector).find("*:not(script)").each(function() {
			var url = "";
			
			if ($(this).css("background-image") != "none") {
				var url = $(this).css("background-image");
			} else if (typeof($(this).attr("src")) != "undefined" && $(this).attr("tagName").toLowerCase() == "img") {
				var url = $(this).attr("src");
			}
			
			url = url.replace("url(\"", "");
			url = url.replace("url(", "");
			url = url.replace("\")", "");
			url = url.replace(")", "");
			
			if (url.length > 0) {
				QueryLoader.items.push(url);
			}
		});
		for(var i=0;i<QueryLoader.preloadWithList.length;i++){
			QueryLoader.items.push(QueryLoader.preloadWithList[i]);
		}
		//QueryLoader.items.push("commons/images/keyvisual3.jpg");
	},
	
	createPreloading: function() {
		QueryLoader.preloader = $("<div></div>").appendTo(QueryLoader.selectorPreload);
		$(QueryLoader.preloader).css({
			height: 	"0px",
			width:		"0px",
			overflow:	"hidden"
		});
		
		var length = QueryLoader.items.length; 
		QueryLoader.doneStatus = length;
		
		for (var i = 0; i < length; i++) {
			var imgLoad = $("<img></img>");
			$(imgLoad).attr("src", QueryLoader.items[i]);
			$(imgLoad).unbind("load");
			$(imgLoad).bind("load", function() {
				QueryLoader.imgCallback();
			});
			$(imgLoad).appendTo($(QueryLoader.preloader));
		}
	},

	spawnLoader: function() {
		if (QueryLoader.selectorPreload == "body") {
			var height = $(window).height();
			var width = $(window).width();
			if(isSmp){
				width = 
				height = 960;
			}
			
			var position = "fixed";
		} else {
			var height = $(QueryLoader.selectorPreload).outerHeight();
			var width = $(QueryLoader.selectorPreload).outerWidth();
			var position = "absolute";
		}
		var left = $(QueryLoader.selectorPreload).offset()['left'];
		var top = $(QueryLoader.selectorPreload).offset()['top'];
		
		QueryLoader.overlay = $("<div></div>").appendTo($(QueryLoader.selectorPreload));
		$(QueryLoader.overlay).addClass("QOverlay");
		$(QueryLoader.overlay).css({
			position: position,
			top: top,
			left: left,
			width: width + "px",
			height: height + "px"
		});
		
		$(window).resize(function(e){
			$(QueryLoader.overlay).css({
				position: position,
				top: top,
				left: left,
				width: $(window).width() + "px",
				height: $(window).height() + "px"
			});
		});
		
		QueryLoader.loadBar = $("<div></div>").appendTo($(QueryLoader.overlay));
		$(QueryLoader.loadBar).addClass("QLoader");
		
		$(QueryLoader.loadBar).css({
			position: "relative",
			top: "50%",
			width: "0%"
		});
	},
	
	animateLoader: function() {
		var perc = (100 / QueryLoader.doneStatus) * QueryLoader.doneNow;
		//trace(perc);
		if (perc > 99) {
			$(QueryLoader.loadBar).stop().animate({
				width: perc + "%"
			}, 500, "linear", function() { 
				QueryLoader.doneLoad();
			});
		} else {
			$(QueryLoader.loadBar).stop().animate({
				width: perc + "%"
			}, 500, "linear", function() { });
		}
	},
	
	doneLoad: function() {
		//prevent IE from calling the fix
		clearTimeout(QueryLoader.ieTimeout);
		isLockScroll = true;
		$(window).scrollTop(0);
		$("#container,#globalNavigation,#btnPagetop").css({'visibility':'visible'});
		//The end animation, adjust to your likings
		$(QueryLoader.loadBar).delay(600).animate({
			//left:$(window).width() / 2,
			width: 0
		},{delay: 600, complete: showScrollBar},function(){
			if(QueryLoader.callback){
				QueryLoader.callback();
			}
			$(QueryLoader.preloader).remove();
		});
		
		function showScrollBar(){
			$("body").css({'overflow':'visible'});
			$(QueryLoader.overlay).delay(600).animate({'opacity':0},
			{
				duration: 1000,
				complete: function(){
					$(QueryLoader.overlay).remove();
					
					$(window).resize(function(e){});
			
					initLocation();
				}
			});

		}
		
	}
}