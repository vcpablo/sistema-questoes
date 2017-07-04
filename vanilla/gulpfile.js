var gulp = require('gulp'),
    htmlminify = require('gulp-htmlmin'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    jsminify = require('gulp-minify'),
    csslint = require('gulp-csslint'),
    cssminify = require('gulp-cssmin'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    fs = require('fs'),
    connect = require('gulp-connect-php'),
    browsersync = require('browser-sync'),
    git = require('gulp-git'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    bower = require('main-bower-files'),
    inject = require('gulp-inject'),
    watch = require('gulp-watch'),
    sequence = require('run-sequence');
    bowerfiles = require('gulp-bower-files'),
    es = require('event-stream');
    // less = require('gulp-less');


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


gulp.task('img-minify', function() {
    return gulp.src('src/public/img/**/*.{jpg,jpeg,png,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest(build + '/images'));
});

gulp.task('css-copy', function() {
    return gulp.src(['src/public/css/**/*.min.css*'])
        .pipe(gulp.dest(build + '/css'));
});


gulp.task('js-copy', function() {
    return gulp.src(['src/public/js/**/*.min.js*'])
        .pipe(gulp.dest(build + '/js'));
});


// Copy index.php, .htaccess
gulp.task('copy', function() {
    return gulp.src(['src/**/*.php', 'src/**/*.htaccess', 'src/public/fonts/**/fonts/*'])
        .pipe(gulp.dest(build));
});


gulp.task('bower-copy', function(){
    return gulp.src(bower({ read: false}), { base: './../bower_components' }).pipe(gulp.dest(build + "/bower_components"));
});

// gulp.task('less', function () {
//   gulp.src(build + '/bower_components/**/variables.less')
//     .pipe(less())
//     .pipe(gulp.dest(build + '/bower_components'));
// });


// gulp.task('bootstrap:clean', ['bootstrap:inject'], function() {
//     return gulp.src(build + '/bower_components/bootstrap/less', { read: false })
//         .pipe(clean());
// });

// gulp.task('bootstrap:inject', function() {
//     var bootstrap = gulp.src(build + '/bower_components/bootstrap/less/bootstrap.less')
//         .pipe(less())
//         .pipe(cssminify())
//         .pipe(concat('bootstrap.min.css'))
//         .pipe(gulp.dest(build + '/bower_components/bootstrap/dist/css'))

//     gulp.src(build + '/index.php')
//         .pipe(inject(es.merge(bootstrap), { name:'bootstrap', relative:true}))
//         .pipe(gulp.dest(build));



// });


// Bower Components
gulp.task('bower-inject', function() {  
     var jsFiles = gulp.src(['src/public/js/**/*.js*', '!src/public/js/**/*.min.js*'])
        .pipe(sourcemaps.init())
        .pipe(jsminify())
        .pipe(concat('public.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(build + '/js'));

    var cssFiles = gulp.src(['src/public/css/**/*.css*', '!src/public/css/**/*.min.css*'])
        .pipe(sourcemaps.init())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(cssminify())
        .pipe(concat('public.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(build + '/css'));

    var bowerFiles = gulp.src(bower({ read: false}), { base: './../bower_components' }).pipe(gulp.dest(build + "/bower_components"));

    return gulp.src(build + '/index.php')
        .pipe(inject(es.merge(bowerFiles), { name:'bower', relative:true}))
        .pipe(inject(es.merge(jsFiles, cssFiles), {name:'public', relative:true}))
        .pipe(gulp.dest(build));
});


gulp.task('stream', function () {
    // Endless stream mode 
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

    // gulp.start('stream');
    // gulp.watch(['src/**/*'], browsersync.reload);
    // gulp.watch('src/css/**/*.css', [browsersync.reload]);
    // gulp.watch('src/js/**/*.js', [browsersync.reload]);
    // gulp.watch(['src/**/*.php', 'src/**/*.htaccess', 'src/img/*'], [browsersync.reload]);
 
});


gulp.task('build', function(done) {
    sequence('clean','html-minify','css-minify','js-minify','img-minify','css-copy','js-copy','copy','bower-inject', function() {
        console.log('Built!');
    });
});

gulp.task('serve', ['connect', 'bower-inject']);
