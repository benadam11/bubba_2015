'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename');

// Path Variables 
var normalize = require('node-normalize-scss').includePaths,
    bourbon = require('node-bourbon').includePaths,
    neat = require('node-neat').includePaths,
    sassSrc ='scss/*.scss',
    jsSrc = 'js/*.js',
    cssDest = 'dist/css',
    jsDest = 'dist/js',
    dist = 'dist/';

// Static Files that need to be moved
var filesToMove = [
  'index.html'
];

// Clean Dist
gulp.task('clean', function(){
  return gulp.src(dist, {read:false})
    .pipe(clean());
});

// Static server
gulp.task('serve',['build'], function() {

    browserSync.init({
        server: {
            baseDir: "./"
        } 
    });

    gulp.watch("*").on("change", browserSync.reload);

});

// Compile Sass
gulp.task('sass',['clean'], function () {
  return gulp.src(sassSrc)
    .pipe(sass({
      includePaths:[normalize, bourbon, neat],
      outputStyle:'compressed'
    })
    .on('error', sass.logError))
    .pipe(autoprefixer({ browsers:['> 5% in US']}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(cssDest));

});

// Minify JS
gulp.task('js',['clean'], function(){
  return gulp.src(jsSrc)
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(jsDest));
});

// Build that mug
gulp.task('build',['js','sass'], function(){
  gulp.src(filesToMove, { base: './' })
    .pipe(gulp.dest(dist));
});

// Default 
gulp.task('default', ['build', 'serve']);