var gulp = require('gulp'),
    htmlminify = require('gulp-htmlmin'),
    jsminify = require('gulp-minify'),
    cssminify = require('gulp-cssmin'),
    autoprefixer = require('gulp-autoprefixer'),
    fs = require('fs'),
    connect = require('gulp-connect-php'),
    browsersync = require('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    sequence = require('run-sequence');
    es = require('event-stream');


var pkg = JSON.parse(fs.readFileSync('./package.json'));
var dist = 'build'
var build = dist + '/' + pkg.version;

gulp.task('clean', function() {
    return gulp.src(build, { read: false })
        .pipe(clean());
});

// HTML - Minify
gulp.task('html-minify', function() {
    return gulp.src('src/**/*.html')
        .pipe(htmlminify({ collapseWhitespace: true }))
        .pipe(gulp.dest(build));
});

// CSS - Minify
gulp.task('css-minify', function() {
    return gulp.src(['src/public/css/**/*.css*', '!src/public/css/**/*.min.css*'])
        .pipe(sourcemaps.init())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(cssminify())
        .pipe(concat('public.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(build + '/css'));
});

gulp.task('js-minify', function() {
   return gulp.src(['src/public/js/**/*.js*', '!src/public/js/**/*.min.js*'])
        .pipe(sourcemaps.init())
        .pipe(jsminify())
        .pipe(concat('public.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(build + '/js'));
});

gulp.task('css-copy', function() {
    return gulp.src(['src/public/css/**/*.min.css*'])
        .pipe(gulp.dest(build + '/css'));
});


gulp.task('js-copy', function() {
    return gulp.src(['src/public/js/**/*.min.js*'])
        .pipe(gulp.dest(build + '/js'));
});

gulp.task('copy', function() {
    return gulp.src(['src/**/*.php', 'src/**/*.htaccess', 'src/public/fonts/**/fonts/*'])
        .pipe(gulp.dest(build));
});

gulp.task('stream', function () {
    return watch('src/**/*', { ignoreInitial: false }, browsersync.reload);
});


// SERVE
gulp.task('connect', function() {
    connect.server({
        base: 'src',
        ini: 'C:/PHP7/php.ini',
        exe: 'C:/PHP7/php.exe',
        livereload: true
    }, function() {
        browsersync({
            proxy: '127.0.0.1:8000'
        });
    });  
 
});


gulp.task('build', function(done) {
    sequence('clean','html-minify','css-minify','js-minify','css-copy','js-copy','copy', function() {
        console.log('Built!');
    });
});

gulp.task('serve', ['connect']);
