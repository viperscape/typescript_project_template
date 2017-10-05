'use strict';
const gulp = require("gulp");
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const seq = require('gulp-sequence')
const source = require('vinyl-source-stream');
const browserify = require('browserify');

gulp.task('default', ['start'], function() {
    gulp.watch('server/**/*.ts', ['typescript_server']);
    gulp.watch('client/**/*.ts', ['browserify']);
    gulp.watch(["client/**/*.*", "!client/**/*.ts"], ['static-client']);
    gulp.watch(["server/**/*.*", "!server/**/*.ts"], ['static-server']);
});

/// bundle client modules
gulp.task('browserify', ['typescript_client'], function () {
    return browserify('build/tmp/client/main.js')
            .bundle()
            .on('error', function (e) { console.error(e.toString()) })
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('build/client'));
});

gulp.task('typescript_server', function() {
    var tsProject = ts.createProject('tsconfig.json');
    tsProject.config.exclude.push("client");
    var tsResult = tsProject.src()
		.pipe(tsProject());
	
	return tsResult.js.pipe(gulp.dest('build/server'));
});

gulp.task('typescript_client', function() {
    var tsProject = ts.createProject('tsconfig.json');
    tsProject.config.exclude.push("server");
    var tsResult = tsProject.src()
		.pipe(tsProject());
	
	return tsResult.js.pipe(gulp.dest('build/tmp/client'));
});

/// copy static assets
gulp.task('static-server', function() {
    return gulp.src(["server/**/*.*", "!server/**/*.ts"])
        .pipe(gulp.dest("build/server"));
});

/// copy static, but place at client root
gulp.task('static-client', function() {
    return gulp.src(["client/**/*.*", "!client/**/*.ts"])
        .pipe(gulp.dest("build/client"));
});

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});


gulp.task('build', ['browserify','typescript_server','static-server','static-client']);
gulp.task('start', seq("clean","build"));