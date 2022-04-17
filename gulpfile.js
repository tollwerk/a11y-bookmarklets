const gulp = require('gulp');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('js', function () {
    return gulp.src('src/*.js')
        .pipe(typescript({ target: 'ES5', allowJs: true }))
        .pipe(uglify())
        .pipe(rename(path => path.basename += '.min'))
        .pipe(gulp.dest('./dist'));
});

// Register Gulp watch task
gulp.task('watch', function () {
    gulp.watch('src/*.js', gulp.series(['js']));
});

// Register Gulp default task
gulp.task('default', gulp.series(['js']));
