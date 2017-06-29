var gulp = require("gulp"),
	cache = require("gulp-cache"),
	jade = require("gulp-jade"),
	sass = require("gulp-sass"),
	pleeease = require("gulp-pleeease"),
	uglify = require("gulp-uglify"),
	notify = require("gulp-notify"),
	browserSync = require("browser-sync"),
	plumber = require("gulp-plumber"),
	runSequence = require("run-sequence");

var options = {
outputStyle: "expanded",
sourceMap: true,
sourceComments: false
};

var autoprefixerOptions = {
browsers: ["last 3 version", "ie >= 9", "Android >= 4.0"]
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
		.pipe(pleeease({
			minifier: false,
			fallbacks: {
				autoprefixer: autoprefixerOptions
			}
		}))
		.pipe(gulp.dest("dist/css"))
		// .pipe(browserSync.stream())
		.pipe(notify({
			message: 'sassをコンパイルしたで',
			title: 'sassマン',
			// sound: 'Glass'
		}));
});

//jade
gulp.task("jade", function() {
	gulp.src(["src/jade/**/*.jade", "!src/jade/**/_*.jade"])
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest("dist/"))
		// .pipe(browserSync.stream())
		.pipe(notify({
			message: 'jadeをコンパイルしたで',
			title: 'jadeマン'
		}));
});

//js
gulp.task("js", function() {
	gulp.src(["dist/js/*.js"])
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
        .pipe(uglify())
		.pipe(gulp.dest("dist/js/min"))
		// .pipe(browserSync.stream())
		.pipe(notify({
			message: 'jsを圧縮したで',
			title: 'jsマン'
		}));
});

//ブラウザリロード
gulp.task('reload', function () {
    browserSync.reload();
});

//監視開始
gulp.task("watch", function() {
	browserSync.init({
		// proxy: {
		//     target: "http://test.dev",
		// }
        server: {
            baseDir: "./dist"
        },
		port: 5236
	});
    gulp.watch('src/jade/**/*.jade', ["jade","reload"]);
    gulp.watch("src/sass/**/*.+(scss|sass)",["sass","reload"]);
	gulp.watch("dist/js/**/*.js",["js","reload"]);
});

gulp.task('default', function(callback){
	return runSequence('clear', 'watch', callback);
});

