'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license']
});

var destDir = 'dist';
//var destDir = '../WebRoot/dist';

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.size());
});

gulp.task('partials', function () {
    return gulp.src('app/partials/**/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: 'app',
            prefix: 'partials/'
        }))
        .pipe(gulp.dest('.tmp/partials'))
        .pipe($.size());
});

gulp.task('html', ['scripts', 'partials'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src('app/*.html')
        .pipe($.inject(gulp.src('.tmp/partials/**/*.js'), {
            read: false,
            starttag: '<!-- inject:partials -->',
            addRootSlash: false,
            addPrefix: '../'
        }))
        .pipe(assets = $.useref.assets())
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(destDir + ''))
        .pipe($.size());
});

gulp.task('images', ['images:admin', 'images:front']);

gulp.task('images:admin', function () {
    return gulp.src('app/images/admin/**/*')
        .pipe(gulp.dest(destDir + '/images/admin'))
        .pipe($.size());
});

gulp.task('images:front', function () {
    return gulp.src('app/images/front/**/*')
        .pipe(gulp.dest(destDir + '/images/front'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest(destDir + '/fonts'))
        .pipe($.size());
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', destDir + ''], { read: false }).pipe($.rimraf());
});

gulp.task('build', ['html', 'partials', 'images', 'fonts']);
