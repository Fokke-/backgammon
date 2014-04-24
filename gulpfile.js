// Gulp
var gulp = require('gulp');

// Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var rsync = require("rsyncwrapper").rsync;
var clean = require('gulp-clean');

// Vars
var tplDir = './';

// CSS
gulp.task('css', function() {
    // Site CSS
    gulp.src([
        tplDir + 'css/src/_main.scss',
    ])
    .pipe(concat('styles.css'))
    .pipe(sass({errLogToConsole: true}))
    .pipe(prefix("last 3 version", "> 1%", "ie 8"))
    .pipe(minifyCSS())
    .pipe(gulp.dest(tplDir + 'css/'));
});

// JS Bottom
gulp.task('js_bottom', function() {
    gulp.src([
        tplDir + 'js/src/three.js',
        tplDir + 'js/src/OrbitControls.js',
        tplDir + 'js/src/main.js',
    ])
    .pipe(concat('js_bottom.js'))
    .pipe(uglify())
    .pipe(gulp.dest(tplDir + 'js/'));
});

// Watch
gulp.task('watch', function() {
    gulp.watch(tplDir + 'js/src/*.js', ['js_bottom']);
    gulp.watch(tplDir + 'css/src/*.scss', ['css']);
});

// Default Task
gulp.task('default', ['js_bottom', 'css']);