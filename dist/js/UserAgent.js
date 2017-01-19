function UserAgent(){
	/*
	this.browser = getID();
	this.version = jQuery.browser.version;
	this.msie = jQuery.browser.msie;
	*/
	
	var agent = navigator.userAgent,
	value = "",
	isSmp;
	
	
	if(jQuery.browser.msie){
		var ver_ = parseInt(jQuery.browser.version);
		
		switch(ver_){
			case 10: value = 'ie10'; break;
			case 9:	value = 'ie9'; break;
			case 8:	value = 'ie8'; break;
			case 7: value = 'ie7'; break;
			case 6: value = 'ie6'; break;
		};
		
	} // if(jQuery.browser.msie)
	else{
		
		// スマホ、iPad関連はIE7,8モードで処理
		if(agent.search('iPhone') != -1){
			value = 'iPhone';
			isSmp = true;
		}else if(agent.search('iPad') != -1){
			value = 'iPad';
			isSmp = true;
		}else if(agent.search('Android') != -1){
			value = 'Android';
			isSmp = true;
		}else if(agent.search('Safari') != -1){
			if(agent.search('Chrome') == -1){
				value = 'Safari';
			};
		}else if(agent.search('Firefox') != -1){
			value = 'Firefox';
		}else if(agent.search('Opera') != -1){
			value = 'Opera';
		}
		
	};
	
	this.browser = value;
	this.version = jQuery.browser.version;
	this.msie = jQuery.browser.msie;
	this.smp = isSmp;
};


UserAgent.prototype = {
	
	
	
}; // end prototype

var uAgent = new UserAgent();