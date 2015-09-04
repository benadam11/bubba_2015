'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence');

// Path Variables 
var normalize = require('node-normalize-scss').includePaths,
    bourbon = require('node-bourbon').includePaths,
    neat = require('node-neat').includePaths,
    sassSrc ='scss/*.scss',
    jsSrc = 'js/*.js',
    imageSrc = 'images/*',
    cssDest = 'dist/css',
    jsDest = 'dist/js',
    imageDest = 'dist/images',
    dist = 'dist/';

// Static Files that need to be moved
var filesToMove = [
  'index.html'
];

// Clean Dist
gulp.task('clean', function(){
  return gulp.src(dist).pipe(clean());  
});

// Static server
gulp.task('serve',['build'], function() {
  browserSync.init({server: './dist'});
});

// Compile Sass
gulp.task('sass', function () {
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
gulp.task('js', function(){
  return gulp.src(jsSrc)
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(jsDest));
});

// Process Images
gulp.task('images', function(){
  return gulp.src(imageSrc)
    .pipe(gulp.dest(imageDest));
})

// Move Files Into the Build Directory
gulp.task('move',function(){
  return gulp.src(filesToMove, { base: './' })
    .pipe(gulp.dest(dist));
})

// Build that mug
gulp.task('build', function(callback){
  runSequence('clean',['js','sass','move','images', 'watch'], callback );
});

// Watch Files
gulp.task('watch', function(){
  gulp.watch("*.html", ['move']).on("change", browserSync.reload);
  gulp.watch('scss/**/*.scss', ['sass']).on("change", browserSync.reload);
  gulp.watch('js/*.js', ['js']).on("change", browserSync.reload);
  gulp.watch('images/*', ['images']).on("change", browserSync.reload);
});

// Default 
gulp.task('default', ['build', 'serve']);