const gulp = require("gulp"),
	pug = require("gulp-pug"),
	sass = require("gulp-sass"),
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	terser = require("gulp-terser"),
	rename = require("gulp-rename"),
	notify = require("gulp-notify"),
	changed = require("gulp-changed"),
	browserSync = require("browser-sync"),
	plumber = require("gulp-plumber"),
	babel = require("gulp-babel");

let baseOption = {
	destDir: "dist",
	srcDir: "src"
}

let assets = {
	assetsDir: "assets/",
}

let pugOption = {
	pretty: true
}

let sassOptions = {
	outputStyle: "expanded",
	// outputStyle: "compressed",
	sourceMap: true,
	sourceComments: false
}

let jsOptions = {
	minify: false
}

let browserOption = {
	online: true,
	ui: false,
	// proxy: {
	//     target: "http://test.dev",
	// }
	server: {
		baseDir: "./"+baseOption.destDir,
	},
	port: 2527
}


const autoprefixerOptions = {
	browsers: ["last 2 version", "ie >= 11", "Android >= 4.0"]
};

// キャッシュをクリア
gulp.task("clear", (done) => {
	return cache.clearAll(done);
});

//sassコンバート
gulp.task("sass", () => {
	return gulp.src(baseOption.srcDir +"/sass/**/*.+(scss|sass)")
		.pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
		.pipe(sass(sassOptions))
		.pipe(postcss([autoprefixer({autoprefixerOptions})]))
		.pipe(gulp.dest(baseOption.destDir+"/"+assets.assetsDir+"/css"))
		.pipe(browserSync.stream())
});

//pug
gulp.task("pug", () => {
	return gulp.src([baseOption.srcDir +"/pug/**/*.pug","!"+ baseOption.srcDir +"/pug/**/_*.pug"])
        .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
		.pipe(pug(pugOption))
		.pipe(changed(baseOption.destDir, {extension: ".html"}))
		.pipe(gulp.dest(baseOption.destDir+"/"))
		.pipe(browserSync.stream())
});

//pug (_*.pugの場合)
gulp.task("pug2", () => {
	return gulp.src([baseOption.srcDir +"/pug/**/*.pug","!"+ baseOption.srcDir +"/pug/**/_*.pug"])
        .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
		.pipe(pug(pugOption))
		.pipe(gulp.dest(baseOption.destDir+"/"))
		.pipe(browserSync.stream())
});

// js
gulp.task("js", () => {
	if(jsOptions.minify){
		return gulp.src([baseOption.srcDir +"/js/*.js","!"+ baseOption.srcDir +"/js/*.min.js"])
			.pipe(babel({presets: ["@babel/preset-env"]}))
			.pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
			.pipe(terser())
			.pipe(rename({extname: ".min.js"}))
			.pipe(gulp.dest(baseOption.destDir+"/"+assets.assetsDir+"js"))
			.pipe(browserSync.stream())
	}else{
		return gulp.src([baseOption.srcDir +"/js/*.js","!"+ baseOption.srcDir +"/js/*.min.js"])
			.pipe(babel({presets: ["@babel/preset-env"]}))
			.pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
			.pipe(rename({extname: ".min.js"}))
			.pipe(gulp.dest(baseOption.destDir+"/"+assets.assetsDir+"js"))
			.pipe(browserSync.stream())
	}
});

gulp.task("browser-sync", () => {
	browserSync.init(browserOption);
});

//監視開始
gulp.task("watch", () => {
	gulp.watch([baseOption.srcDir +"/pug/**/*.pug","!"+ baseOption.srcDir +"/pug/**/_*.pug"], gulp.task("pug"));
	gulp.watch([baseOption.srcDir +"/pug/**/_*.pug"], gulp.task("pug2"));
	gulp.watch(baseOption.srcDir +"/sass/**/*.+(scss|sass)", gulp.task("sass"));
	gulp.watch([baseOption.srcDir +"/js/*.js","!"+ baseOption.srcDir +"/js/*.min.js"],gulp.task("js"));
	// gulp.watch(baseOption.srcDir +"/pug/**/*.pug", gulp.task("reload"));
});

gulp.task("default", gulp.parallel( "watch", "browser-sync"));

gulp.task("buildOption", () => {
	baseOption.destDir = "build";
	pugOption.pretty = false;
	sassOptions.outputStyle = "compressed";
	jsOptions.minify = true;
	browserOption.baseDir = "./build";
});

gulp.task("build", gulp.parallel("buildOption",  "watch", "browser-sync"));

