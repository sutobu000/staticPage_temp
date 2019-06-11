var gulp = require("gulp"),
	cache = require("gulp-cache"),
	jade = require("gulp-jade"),
	sass = require("gulp-sass"),
	// pleeease = require("gulp-pleeease"),
	postcss = require("gulp-postcss"),
	// autoprefixer = require("gulp-autoprefixer"),
	autoprefixer = require("autoprefixer"),
	// uglify = require("gulp-uglify"),
	terser = require("gulp-terser"),
	rename = require("gulp-rename"),
	notify = require("gulp-notify"),
	changed = require("gulp-changed"),
	browserSync = require("browser-sync"),
	plumber = require("gulp-plumber"),
	runSequence = require("run-sequence");

var options = {
// outputStyle: "expanded",
outputStyle: "compressed",
sourceMap: true,
sourceComments: false
};

var autoprefixerOptions = {
browsers: ["last 2 version", "ie >= 11", "Android >= 4.0"]
};

// キャッシュをクリア
gulp.task('clear', (done) => {
	return cache.clearAll(done);
});

//sassコンバート
gulp.task("sass", () => {
	return gulp.src("src/sass/**/*.+(scss|sass)")
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
gulp.task("jade", () => {
	return gulp.src(["src/jade/**/*.jade","!src/jade/**/_*.jade"])
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(changed("dist", {extension: '.html'}))
		.pipe(gulp.dest("dist/"))
		.pipe(browserSync.stream())
});

//jade (_*.jadeの場合)
gulp.task("jade2", () => {
	return gulp.src(["src/jade/**/*.jade","!src/jade/**/_*.jade"])
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest("dist/"))
		.pipe(browserSync.stream())
});

// js
gulp.task("js", () => {
	return gulp.src(["src/js/*.js","!src/js/*.min.js"])
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
        .pipe(terser())
        .pipe(rename({extname: ".min.js"}))
		.pipe(gulp.dest("dist/js"))
		.pipe(browserSync.stream())
});

// // ブラウザリロード
// gulp.task('reload',  () => {
//     browserSync.reload();
// });

gulp.task("browser-sync", () => {
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
});
//監視開始
gulp.task("watch", () => {
	gulp.watch(['src/jade/**/*.jade','!src/jade/**/_*.jade'], gulp.task("jade"));
	gulp.watch(['src/jade/**/_*.jade'], gulp.task("jade2"));
	gulp.watch("src/sass/**/*.+(scss|sass)", gulp.task("sass"));
	gulp.watch(["src/js/*.js","!src/js/*.min.js"],gulp.task("js"));
	// gulp.watch('src/jade/**/*.jade', gulp.task("reload"));
});

gulp.task('default', gulp.parallel('clear', 'watch', "browser-sync"));


