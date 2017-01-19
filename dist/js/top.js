;(function($,window,undefind) {

	var $window = $(window);

	var $htmlContainer = $('#htmlContainer');
	var is_anim = true;
	var $blind = $('#blind');

	/* -----------------------------------------------
	 * クッキー判定
	 * ----------------------------------------------- */
	if( getParam("c") == "c" ){
		$.cookie("first", null); // cookieの強制クリア
	}

//	alert($.cookie('first'))
	// 初回アクセス時の処理（cookieが発行されていない）
	if($.cookie('first') != "0"){

		$("body")
			.css({
				overflow: "hidden"
			});

		$("#opLogo")
			.stop()
			.delay(1000)
			.css({
				opacity: 0
			})
			.animate({
				opacity: 1
			},{
				duration: (is_anim)? 1000 : 0,
				easing: 'linear',
				complete: function(){

					$("#opLogo")
						.delay(1000)
						.animate({
							opacity: 0
						},{
							duration: (is_anim)? 800 : 0,
							easing: 'easeOutSine',
							complete: function(){

								$("body")
									.css({
										overflow: "visible"
									});

								$blind
									.delay((is_anim)? 200 : 0)
									.animate({
										opacity: 0
									},{
										duration: (is_anim)? 2200 : 0,
										easing: 'easeOutSine',
										complete: function(){

											$blind.hide();

										}
									});

							}});


				}});


	}else{


		$blind
			.delay((is_anim)? 600 : 0)
			.animate({
				opacity: 0
			},{
				duration: (is_anim)? 1200 : 0,
				easing: 'easeOutCirc',
				complete: function(){

					$blind.hide();

				}
			});


	};


	/* -----------------------------------------------
	 * クッキー発行
	 * ----------------------------------------------- */
//	if(!$.cookie('first')){
		$.cookie('first','0',{ path: "/" }); // cookieを発行するディレクトリを指定
//	};



})(jQuery,window);
