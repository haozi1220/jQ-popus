var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var changed = require('gulp-changed');
var cache = require('gulp-cached');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var notifier = require('node-notifier');
var eslint = require('gulp-eslint');
var postcss = require('gulp-postcss');
var livereload = require('gulp-livereload');
var Config = require('../gulpfile.config.js');

function showError (arg) {
    notifier.notify({
        title: 'Error:',
        message: '' + arg
    });
    console.log(arg);
}

function dev () {
    gulp.task('sass:dev', ['scss-lint'], function () {
        return gulp.src(Config.sass.srcMain)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(sass.sync({
                onError: showError
            }).on('error', function (error) {
                showError(error);
            }))
            .pipe(postcss([autoprefixer({
                browsers: [
                    '> 1%',
                    'last 10 versions',
                    'ie >= 8',
                    'Firefox >= 20',
                    'iOS >= 7',
                    'Android >= 4'
                ]
            })]))
            .pipe(sourcemaps.write('./maps'))
            .pipe(gulp.dest(Config.css.srcFile));
    }); // sass语法检查，css兼容样式加前缀
    gulp.task('sass:single', ['scss-lint:single'], function () {
        return gulp.src([Config.sass.baseSingle, '!' + Config.sass.baseSingleNo])
            .pipe(plumber())
            .pipe(sass.sync({
                onError: showError
            }).on('error', function (error) {
                showError(error);
            }))
            .pipe(postcss([autoprefixer({
                browsers: [
                    '> 1%',
                    'last 10 versions',
                    'ie >= 8',
                    'Firefox >= 20',
                    'iOS >= 7',
                    'Android >= 4'
                ]
            })]))
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(Config.css.srcFile));
    }); // sass语法检查，css兼容样式加前缀
    gulp.task('scss-lint', function () {
        return gulp.src([Config.sass.src, '!' + Config.sass.baseSass])
            .pipe(plumber())
            .pipe(cache('scsslint'))
            .pipe(scsslint({
                'config': './lint.yml'
            }));
    });
    gulp.task('scss-lint:single', function () {
        return gulp.src([Config.sass.baseSingle, '!' + Config.sass.baseSass])
            .pipe(plumber())
            .pipe(cache('scsslint'))
            .pipe(scsslint({
                'config': './lint.yml'
            }));
    });
    gulp.task('img:dev', function () {
        return gulp.src([Config.img.src, '!' + Config.img.src_images])
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(Config.img.images));
    });
    gulp.task('eslint:dev', function () {
        return gulp.src([Config.js.srcMain, '!node_modules/**', '!' + Config.js.srcLib])
            .pipe(plumber())
            .pipe(eslint('./.eslintrc'))
            .pipe(eslint.format());
    }); // js语法检查
    gulp.task('pug:dev', function () {
        return gulp.src(Config.pug.pugSrc)
            .pipe(changed(Config.pug.pugDest, {extension: '.html'}))
            .pipe(plumber())
            .pipe(pug({
                pretty: true
            }))
            .pipe(gulp.dest(Config.pug.pugDest))
            .pipe(livereload());
    }); // pug模板转换
    gulp.task('reload', function () {
        livereload.listen({
            start: true,
            basePath: 'app'
        });
        gulp.watch(Config.src, ['sass:dev'], function (file) {
            livereload.changed(file.path);
        });
    });
    gulp.task('watch', function () {
        gulp.watch(Config.pug.src, ['pug:dev']);
        gulp.watch(Config.sass.src, ['sass:dev']);
        gulp.watch(Config.js.srcMain, ['eslint:dev']);
        gulp.watch([Config.img.src, '!' + Config.img.src_images], ['img:dev']);
    });
    gulp.task('watch:single', function () {
        gulp.watch(Config.pug.src, ['pug:dev']);
        gulp.watch(Config.sass.src, ['sass:dev']);
        gulp.watch(Config.sass.src, ['sass:single']);
        gulp.watch(Config.js.srcMain, ['eslint:dev']);
        gulp.watch([Config.img.src, '!' + Config.img.src_images], ['img:dev']);
    });
    gulp.task('d', ['pug:dev', 'sass:dev', 'img:dev', 'eslint:dev', 'reload', 'watch']);
    gulp.task('ds', ['pug:dev', 'sass:dev', 'img:dev', 'sass:single', 'eslint:dev', 'reload', 'watch:single']);
}

module.exports = dev;
