const gulp = require('gulp');
const typescript = require('gulp-typescript');
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const inject = require('gulp-inject');
const path = require('path');
const named = require('vinyl-named');
const fs = require('fs');
const tap = require('gulp-tap');

gulp.task('js', function () {
    return gulp.src('src/*.js')
        .pipe(typescript({ target: 'ES5', allowJs: true }))
        .pipe(uglify())
        .pipe(rename(path => path.basename += '.min'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('webpack', function () {
    return gulp.src('src/pack/*.js')
        .pipe(named())
        .pipe(webpack({ mode: 'production' }))
        .pipe(rename(path => path.basename += '.min'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('html', function () {
    return gulp.src('src/index.html')
        .pipe(inject(gulp.src(['./dist/*.js']), {
            starttag: '<!-- inject:bookmarklet -->',
            transform: function (filePath, file) {
                const name = path.basename(filePath, '.min.js').replace(/-(.)/g, function (match, chr) {
                    return ` ${chr.toUpperCase()}`;
                }).replace(/^(.)/g, function (match, chr) {
                    return chr.toUpperCase();
                });
                const code = file.contents.toString('utf8').replace(/^!(.*)(\(.*?\);?)$/g, function (match, b, c) {
                    return `(${b})${c}`;
                });
                const docs = fs.existsSync(`./src/docs/${path.basename(filePath, '.min.js')}.html`) ?
                    ` (<a href="${path.basename(filePath, '.min.js')}.html" class="doc">Documentation</a>)` : '';
                return `<li><a href="javascript:${encodeURI(code)}">${name}</a>${docs}</li>`;
            }
        }))
        .pipe(gulp.dest('./docs'));
});

gulp.task('docs', function () {
    return gulp.src('src/docs/*.html')
        .pipe(tap(function (file, t) {
            const basename = path.basename(file.path, '.html');
            if (fs.existsSync(`./dist/${basename}.min.js`)) {
                return t.through(inject, [gulp.src([`./dist/${basename}.min.js`]), {
                    starttag: '<!-- inject:bookmarklet -->',
                    transform: function (filePath, file) {
                        const name = path.basename(filePath, '.min.js').replace(/-(.)/g, function (match, chr) {
                            return ` ${chr.toUpperCase()}`;
                        }).replace(/^(.)/g, function (match, chr) {
                            return chr.toUpperCase();
                        });
                        const code = file.contents.toString('utf8').replace(/^!(.*)(\(.*?\);?)$/g, function (match, b, c) {
                            return `(${b})${c}`;
                        });
                        return `<a href="javascript:${encodeURI(code)}">${name}</a>`;
                    }
                }])
            }
        }))
        .pipe(gulp.dest('./docs'));
});

// Register Gulp watch task
gulp.task('watch', function () {
    gulp.watch(['src/*.js', 'src/**/*.html', 'docs/*.css'], gulp.series(['js', 'html', 'docs']));
    gulp.watch(['src/pack/*.js', 'src/**/*.html', 'docs/*.css'], gulp.series(['webpack', 'html', 'docs']));
});

// Register Gulp default task
gulp.task('default', gulp.series(['js', 'webpack', 'html', 'docs']));
