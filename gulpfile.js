'use strict';
const gulp = require("gulp");
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const source = require('vinyl-source-stream');
const browserify = require('browserify');

gulp.task('default', ['build'], function() {
    gulp.watch('server/*.ts', ['typescript_server']);
    gulp.watch('client/main.ts', ['browserify']);
    gulp.watch('client/static/*', ['static-client']);
    gulp.watch('server/static/*', ['static-server']);
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
    var tsResult = tsProject.src()
		.pipe(tsProject());
	
	return tsResult.js.pipe(gulp.dest('build/server'));
});

gulp.task('typescript_client', function() {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
		.pipe(tsProject());
	
	return tsResult.js.pipe(gulp.dest('build/tmp/client'));
});

/// copy static assets
gulp.task('static-server', function() {
    return gulp.src('server/static/**/*.*')
        .pipe(gulp.dest("build/server/static"));
});

/// copy static, but place at client root
gulp.task('static-client', function() {
    return gulp.src('client/static/**/*.*')
        .pipe(gulp.dest("build/client"));
});

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('build', ['browserify']);