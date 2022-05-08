const gulp = require('gulp');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const inject = require('gulp-inject');
const path = require('path');

gulp.task('js', function () {
    return gulp.src('src/*.js')
        .pipe(typescript({ target: 'ES5', allowJs: true }))
        .pipe(uglify())
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
                return `<li><a href="javascript:${encodeURI(file.contents.toString('utf8'))}">${name}</a></li>`;
            }
        }))
        .pipe(gulp.dest('./docs'));
});

// Register Gulp watch task
gulp.task('watch', function () {
    gulp.watch('src/*.js', gulp.series(['js', 'html']));
});

// Register Gulp default task
gulp.task('default', gulp.series(['js', 'html']));
