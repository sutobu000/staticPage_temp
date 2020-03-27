// console.log("js start");
/* ========================================================================
 * User settings
 * ======================================================================== */
const userSet = {
	load:{
		img: true
	},
	breakpoint: 768,
	anchorLink:{
		duration: .5
	},
	wrap:{
		wrapperClass: "wrapper",
	},
	globalNav:{
		class: "gnav",
		menuBtn: "header__menubtn",
		openState: "data-open"
	},
	pageTop:{
		class: "pagetop",
		currentState: "data-current",
		duration: .8
	},
	slide:{
		singleClass: "js-sliSL", // gsapによるtranslateのスライド処理を追加(-left,-right,-top,-bottomで方向を指定)
		multiClass: "js-stgSL", // gsapのstaggerによるchildrenのtranslateのスライド処理を追加(-left,-right,-top,-bottomで方向を指定)
		data:{
			sliDuration: "data-sliDur", // gsapのduration (default:.3)
			sliValue: "data-sliVal", // gsapのtranslateの量 (default:20)
			sliDelay: "data-sliDelay", // 遅延時間を指定 (default:.7)
			sliFrom: "data-sliFrom", // multiのみ 開始する箇所を指定 (default:start, 他指定値:{start, center, edges, random, end)
		}
	}
}



/* ========================================================================
 * init
 * ======================================================================== */
let $html = document.getElementsByTagName("html");
let $body = document.getElementsByTagName("body");

/* --- Common letiable --- */
let $wrapper = document.querySelector("."+userSet.wrap.wrapperClass);
let ww = window.innerWidth;
let wh = window.innerHeight;
let w_breakPoint = userSet.breakpoint;

let _sTop = document.documentElement.scrollTop || document.body.scrollTop;
let mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

/* --- 画像preload --- */
let is_ready = false;
let $allImage = document.querySelectorAll(".main img");
let allImageCount = $allImage.length;
let completeImageCount = 0;

let cssImgResults = [];
let cssSheets = document.styleSheets;
let completecssImageCount = 0;

/* --- スライドフェードイン --- */
let $sliSL = document.querySelectorAll("."+userSet.slide.sigleClass);
let sliSLArr = [];
let sliSLFlagArr = [];
let sliSLTopArr = [];
for(let sliSLCount = 0; sliSLCount < $sliSL.length; sliSLCount++) {
	$sliSL[sliSLCount].style.opacity = 0;
}

let $stgSL = document.querySelectorAll("."+userSet.slide.multiClass);
let stgSLArr = [];
let stgSLFlagArr = [];
let stgSLTopArr = [];
for(let stgSLCount = 0; stgSLCount < $stgSL.length; stgSLCount++) {
	let $stgSLChild = $stgSL[stgSLCount].children;
	for (let stgSLChildCount = 0; stgSLChildCount < $stgSLChild.length; stgSLChildCount++) {
			$stgSLChild[stgSLChildCount].style.opacity = 0;
	}
}

/* --- SPメニュー --- */
let $gnav = document.querySelector("."+userSet.globalNav.class);
let $menuBtn = document.querySelector("."+userSet.globalNav.menuBtn);
let menuBtnTop;
let is_gnav = false;
let is_open = false;

/*--
console.log($ancLink);アンカーリンク処理 --- */
let $ancLink = document.querySelectorAll("a[href^='#']")
let ancTopArr = [];

/* --- pageTop --- */
let $pageTop = document.querySelector("."+userSet.pageTop.class);
let is_pageTop = false;

let _SP = false;
if (ww > w_breakPoint) {
	_SP = false;
} else {
	_SP = true;
}

window.addEventListener("resize", (e) => {
	ww = window.innerWidth;
	wh = window.innerHeight;
	if (ww > w_breakPoint) {
		_SP = false;
	} else {
		_SP = true;
	}
});

/* -----------------------------------------------
 * Ready imageなど遅延ロード
 * ----------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
	// console.log("ready");
	if(userSet.load.img){
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
						if(window.getComputedStyle(block[0]).getPropertyValue("background-image").includes("url")){
							cssStyle.push(window.getComputedStyle(block[0]).getPropertyValue("background-image"));
						}
					}else if (window.getComputedStyle(block[0], "::after").getPropertyValue("background-image") !== "none") {
						if(window.getComputedStyle(block[0], "::after").getPropertyValue("background-image").includes("url")){
							cssStyle.push(window.getComputedStyle(block[0], "::after").getPropertyValue("background-image"));
						}
					}else if (window.getComputedStyle(block[0], "::before").getPropertyValue("background-image") !== "none") {
						if(window.getComputedStyle(block[0], "::before").getPropertyValue("background-image").includes("url")){
							cssStyle.push(window.getComputedStyle(block[0], "::before").getPropertyValue("background-image"));
						}
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
						$imgnew.addEventListener("load", (response, status, xhr) => {
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
	}else{
		readyInit();
	}
});

/* -- imgタグ参照 -- */
let readySection = () => {
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
					$new.addEventListener("load", () => {
						completeImageCount++;
						if (allImageCount == completeImageCount){
							for(let j = 0; j < $allImage.length; j++){
								$allImage[j].removeAttribute('style');
							}
							setTimeout(() => {
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

/* -- Ready init (Loadが終わったら) -- */
let readyInit = () => {
	// console.log("init start");

	// アンカーリンク
	for (let ancCount = 0; ancCount < $ancLink.length; ancCount++) {
		if(!$ancLink[ancCount].hasAttribute("noscroll")){
			let ancObj = document.getElementById($ancLink[ancCount].getAttribute("href").slice(1));
			ancTopArr[ancCount] = _sTop + ancObj.getBoundingClientRect().top
			$ancLink[ancCount].addEventListener("click", function(e) {
				e.preventDefault();
				let href = this.getAttribute("href");
				scrollAnc(href, userSet.anchorLink.duration, ancTopArr[ancCount]);
			})
		}
	}

	/* sliSL */
	let wscroll = _sTop + wh;
	for (let i = 0; i < sliSLTopArr.length; i++) {
		if (sliSLTopArr[i] <= wscroll) { sliSLFlagArr[i] = true; sliSLAnime(sliSLArr[i]); }
	}
	for (let i = 0; i < stgSLTopArr.length; i++) {
		if (stgSLTopArr[i] <= wscroll) { stgSLFlagArr[i] = true; stgSLInAnime(stgSLArr[i]); }
	}

}

/* -----------------------------------------------
 * sliSL stgSL
 * ----------------------------------------------- */
/* 単発slide */
for(let sliSLCount = 0; sliSLCount < $sliSL.length; sliSLCount++) {
	let $this = $sliSL[sliSLCount];
	sliSLArr[sliSLCount] = $this;
	sliSLFlagArr[sliSLCount] = false;
	sliSLTopArr[sliSLCount] = $this.getBoundingClientRect().top;
}
let sliSLAnime = ($obj) => {
	gsap.killTweensOf($obj);
	let SLIdur = .3
	let SLIval = 20
	let SLIdelay = .7
	if($obj.getAttribute(userSet.slide.data.sliDuration) >= 0) SLIdur = Number($obj.getAttribute(userSet.slide.data.sliDuration));
	if($obj.getAttribute(userSet.slide.data.sliValue) >= 0) SLIval = $obj.getAttribute(userSet.slide.data.sliValue);
	if($obj.getAttribute(userSet.slide.data.sliDelay) >= 0) SLIdelay = $obj.getAttribute(userSet.slide.data.sliDelay);
	if($obj.classList.contains(userSet.slide.singleClass+"-left")){
		gsap.fromTo($obj, {duration:SLIdur, x:-1*SLIval,opacity:0},{x:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute("style");
			$obj.classList.remove(userSet.slide.singleClass, userSet.slide.singleClass+"-left");
		}});
	}else if($obj.classList.contains(userSet.slide.singleClass+"-right")){
		gsap.fromTo($obj, {duration:SLIdur, x:SLIval,opacity:0},{x:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute("style");
			$obj.classList.remove(userSet.slide.singleClass, userSet.slide.singleClass+"-right");
		}});
	}else if($obj.classList.contains(userSet.slide.singleClass+"-top")){
		gsap.fromTo($obj, {duration:SLIdur, y:-1*SLIval,opacity:0},{y:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute("style");
			$obj.classList.remove(userSet.slide.singleClass, userSet.slide.singleClass+"-top");
		}});
	}else if($obj.classList.contains(userSet.slide.singleClass+"-bottom")){
		gsap.fromTo($obj, {duration:SLIdur, y:SLIval,opacity:0},{y:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute("style");
			$obj.classList.remove(userSet.slide.singleClass, userSet.slide.singleClass+"-bottom");
		}});
	}else{
		gsap.fromTo($obj, {duration:SLIdur, y:SLIval,opacity:0},{y:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute("style");
			$obj.classList.remove(userSet.slide.singleClass);
		}});
	}
}

/* 連続したslide */
for (let stgSLCount = 0; stgSLCount < $stgSL.length; stgSLCount++) {
  let $this = $stgSL[stgSLCount];
  stgSLArr[stgSLCount] = $this;
  stgSLFlagArr[stgSLCount] = false;
  stgSLTopArr[stgSLCount] = $this.getBoundingClientRect().top;
}
let stgSLInAnime = ($obj) => {
	let stgSLIdur = .3
	let stgSLIval = 20
	let stgSLIdelay = .7
	let stgSLIfrom = "start"
	if($obj.getAttribute(userSet.slide.data.sliDuration) >= 0) stgSLIdur = Number($obj.getAttribute(userSet.slide.data.sliDuration));
	if($obj.getAttribute(userSet.slide.data.sliValue) >= 0) stgSLIval = Number($obj.getAttribute(userSet.slide.data.sliValue));
	if($obj.getAttribute(userSet.slide.data.sliDelay) >= 0) stgSLIdelay = Number($obj.getAttribute(userSet.slide.data.sliDelay));
	if($obj.getAttribute(userSet.slide.data.sliFrom)) stgSLIfrom = $obj.getAttribute(userSet.slide.data.sliFrom);
	if($obj.classList.contains(userSet.slide.multiClass+"-left")){
		gsap.fromTo($obj.children, {duration:stgSLInAnime, x:-1*stgSLIval,opacity:0},{x:0,opacity:1,delay:stgSLIdelay, stagger:{amount:.15,from:stgSLIfrom}, onComplete:function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute("style");
			}
			$obj.classList.remove(userSet.slide.multiClass, userSet.slide.multiClass+"-left");
		}});
	}else if($obj.classList.contains(userSet.slide.multiClass+"-right")){
		gsap.fromTo($obj.children, {duration:stgSLInAnime, x:stgSLIval,opacity:0},{x:0,opacity:1,delay:stgSLIdelay, stagger:{amount:.15,from:stgSLIfrom}, onComplete:function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute("style");
			}
			$obj.classList.remove(userSet.slide.multiClass, userSet.slide.multiClass+"-right");
		}});
	}else if($obj.classList.contains(userSet.slide.multiClass+"-top")){
		gsap.fromTo($obj.children, {duration:stgSLInAnime, y:-1*stgSLIval,opacity:0},{y:0,opacity:1,delay:stgSLIdelay, stagger:{amount:.15,from:stgSLIfrom}, onComplete:function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute("style");
			}
			$obj.classList.remove(userSet.slide.multiClass, userSet.slide.multiClass+"-top");
		}});
	}else if($obj.classList.contains(userSet.slide.multiClass+"-bottom")){
		gsap.fromTo($obj.children, {duration:stgSLInAnime, y:stgSLIval,opacity:0},{y:0,opacity:1,delay:stgSLIdelay, stagger:{amount:.15,from:stgSLIfrom}, onComplete:function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute("style");
			}
			$obj.classList.remove(userSet.slide.multiClass, userSet.slide.multiClass+"-bottom");
		}});
	}else{
		gsap.fromTo($obj.children, {duration:stgSLInAnime, y:stgSLIval,opacity:0},{y:0,opacity:1,delay:stgSLIdelay, stagger:{amount:.15,from:stgSLIfrom}, onComplete:function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute("style");
			}
			$obj.classList.remove(userSet.slide.multiClass);
		}});
	}
}

/* ========================================================================
 * Event
 * ======================================================================== */

/* -----------------------------------------------
 * アンカークリック
 * ----------------------------------------------- */
let scrollAnc = ($object, $speed, $scroll) => {
	let hash = $object;
	let $target;
	let t_hash;
	// let h_h = document.querySelector(".header").clientHeight; // scrollToの位置の差異を作る

	// if(is_open) $menuBtn.dispatchEvent(new Event("click")); SPでgnavをopenしている時アンカーリンクをクリックしたら
	if(hash==="#") {
		t_hash = 0;
	} else {
		t_hash = $scroll;
	}
	gsap.to(window, {duration:$speed, scrollTo:t_hash});
}


/* -----------------------------------------------
 * ページトップ スクロール
 * ----------------------------------------------- */
$pageTop.addEventListener('click', (e) => {
	e.preventDefault();
	if (!is_pageTop) {
		is_pageTop = true;
		gsap.to(window, {duration:userSet.pageTop.duration, scrollTo: 0 , onComplete: () => {is_pageTop = false;}});
	}
});

/* -----------------------------------------------
 * SP メニュー
 * ----------------------------------------------- */
$menuBtn.addEventListener('click', (e) => {
	let h_gnav = Number(window.innerHeight);
	if (!is_gnav) {
		if (!is_open) {
			menuBtnTop = document.documentElement.scrollTop || document.body.scrollTop;
			is_open = true;
			is_gnav = true;
			$menuBtn.setAttribute(userSet.globalNav.openState,true);
			$wrapper.style.position = "fixed";
			$wrapper.style.top = "-" + menuBtnTop + "px";
			$wrapper.style.left = 0;
			gsap.to($gnav, {duration:.3, height:h_gnav, onComplete: () => {is_gnav = false;}});
		} else {
			$wrapper.removeAttribute('style');
			window.scrollTo({top:menuBtnTop});
			is_open = false;
			is_gnav = true;
			$menuBtn.setAttribute(userSet.globalNav.openState,false);
			gsap.to($gnav, {duration:.3, height:0, onComplete: () => {is_gnav = false;}});
		}
	}
});


/* -----------------------------------------------
 * - スクロール -
 * ----------------------------------------------- */
window.addEventListener('scroll', (e) => {
	e.preventDefault();
	_sTop = document.body.scrollTop || document.documentElement.scrollTop;
	wh = window.innerHeight;
	let _sMdl = _sTop + wh / 2;
	let _sBtm = _sTop + wh;
	let diffVal = 100

	/* sliSL */
	for (let i = 0; i < sliSLArr.length; i++) {
		if (!sliSLFlagArr[i] && sliSLTopArr[i] <= _sBtm - diffVal) {
			sliSLFlagArr[i] = true;
			sliSLAnime(sliSLArr[i]);
		}
	}
	/* stgSL */
	for (let i = 0; i < stgSLArr.length; i++) {
		if (!stgSLFlagArr[i] && stgSLTopArr[i] <= _sBtm - diffVal) {
			stgSLFlagArr[i] = true;
			stgSLInAnime(stgSLArr[i]);
		}
	}

	// headerFixed(_sTop);

	if (_sTop > wh) {
		$pageTop.setAttribute(userSet.pageTop.currentState, true);
	}else{
		$pageTop.setAttribute(userSet.pageTop.currentState, false);
	}


});
