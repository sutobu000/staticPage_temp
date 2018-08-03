var gulp = require("gulp"),
	cache = require("gulp-cache"),
	jade = require("gulp-jade"),
	sass = require("gulp-sass"),
	// pleeease = require("gulp-pleeease"),
	postcss = require("gulp-postcss"),
	// autoprefixer = require("gulp-autoprefixer"),
	autoprefixer = require("autoprefixer"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	notify = require("gulp-notify"),
	changed = require("gulp-changed"),
	browserSync = require("browser-sync"),
	plumber = require("gulp-plumber"),
	runSequence = require("run-sequence");

var options = {
outputStyle: "expanded",
sourceMap: true,
sourceComments: false
};

var autoprefixerOptions = {
browsers: ["last 3 version", "ie >= 10", "Android >= 4.0"]
};

// キャッシュをクリア
gulp.task('clear', function (done) {
	return cache.clearAll(done);
});

//sassコンバート
gulp.task("sass", function() {
	gulp.src("src/sass/**/*.+(scss|sass)")
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(sass(options))
		.pipe(postcss([autoprefixer({autoprefixerOptions})]))
		// .pipe(pleeease({
		// 	minifier: false,
		// 	fallbacks: {
		// 		autoprefixer: autoprefixerOptions
		// 	}
		// }))
		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.stream())
});

//jade
gulp.task("jade", function() {
	gulp.src(["src/jade/**/*.jade","!src/jade/**/_*.jade"])
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(changed("dist", {extension: '.html'}))
		.pipe(gulp.dest("dist/"))
});

//jade (_*.jadeの場合)
gulp.task("jade2", function() {
	gulp.src(["src/jade/**/*.jade","!src/jade/**/_*.jade"])
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest("dist/"))
});

// js
gulp.task("js", function() {
	gulp.src(["src/js/*.js","!src/js/*.min.js"])
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
        .pipe(uglify({output:{comments: 'some'}}))
        .pipe(rename({extname: ".min.js"}))
		.pipe(gulp.dest("dist/js"))
});

// ブラウザリロード
gulp.task('reload', function () {
    browserSync.reload();
});

//監視開始
gulp.task("watch", function() {
	browserSync.init({
		online: true,
		ui: false,
		// proxy: {
		//     target: "http://test.dev",
		// }
        server: {
            baseDir: "./dist",
        },
		port: 2527
	});
  gulp.watch(['src/jade/**/*.jade','!src/jade/**/_*.jade'], ["jade","reload"]);
  gulp.watch(['src/jade/**/_*.jade'], ["jade2","reload"]);
  gulp.watch("src/sass/**/*.+(scss|sass)",["sass"]);
	gulp.watch(["src/js/*.js","!src/js/*.min.js"],["js"]);
});

gulp.task('default', function(callback){
	return runSequence('clear', 'watch', callback);
});

