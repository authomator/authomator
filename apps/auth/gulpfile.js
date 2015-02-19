var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    gutil = require('gulp-util'),
    minifyCSS = require('gulp-minify-css'),
    livereload = require('gulp-livereload'),
    shell = require('gulp-shell'),
    sourceJavaScriptFiles = [
        'build/**/*.js'
    ],
    sourceLessFiles = [
        'build/material.less',
        'build/app.less'
    ],
    bowerDirectory = './bower_components';

/**
 * Build JavaScript library
 *
 * Searches all _build directories in the public directory
 * and concatenates all JavaScript files and concatenates them to:
 *
 * public/build/js/app.js
 * public/build/js/app.min.js
 *
 */
gulp.task('build-js', function () {
    gulp.src(sourceJavaScriptFiles)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/js/'))
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('public/js/'))
});

/**
 * Build CSS files into:
 *
 * public/build/css/app.css
 * public/build/css/app.min.css
 */
gulp.task('build-css', function () {
    return gulp.src(sourceLessFiles)
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('public/css/'))
        .pipe(minifyCSS())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('public/css/'))
        .on('error', gutil.log);
});


/**
 * Copy vendor files to their correct location
 */
gulp.task('copy-vendor-files', function () {

    //gulp
    //    .src(bowerDirectory + '/jquery/dist/**/*.*')
    //    .pipe(gulp.dest('./public/vendor/jquery/'));
    //
    //gulp
    //    .src([
    //        bowerDirectory + '/font-awesome/fonts/*.*'
    //    ])
    //    .pipe(gulp.dest('./public/vendor/font-awesome/'));

});


/**
 * Task for different parts of the build process
 */
gulp.task('process-all', ['process-js', 'process-css', 'process-vendor-files']);
gulp.task('process-js', ['build-js'] );
gulp.task('process-css', ['build-css']);
gulp.task('process-vendor-files', ['copy-vendor-files']);

/**
 * Watch task for default task
 */
gulp.task('watch', function () {
    
    console.log('starting livereload server');
    livereload({start:true});
    
    gulp.watch(sourceJavaScriptFiles, ['process-js']);
    gulp.watch(['build/**/*.less'], ['process-css']);
    gulp
        .watch(['public/**', 'bower_components'])
        .on('change', function (file) {
            livereload.changed(file.path);
        })
        .on('added', function (file) {
            livereload.changed(file.path);
        })
        .on('deleted', function (file) {
            livereload.changed(file.path);
        });
});

/**
 * Default task
 */
gulp.task('default', ['watch', 'process-all']);
