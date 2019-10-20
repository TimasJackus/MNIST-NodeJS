const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const del = require("del");

gulp.task('build', function() {
    return gulp.src('src/**/*')
        .pipe(tsProject())
        .on('error', function() { process.exit(1) })
        .pipe(gulp.dest('dist/'));
});
gulp.task('clean', function() {
    console.log('clean');
    return del(['dist']);
});

gulp.task('watch', function() {
    gulp.watch('src/**/*', gulp.parallel('build'));
});

gulp.task('default', gulp.series('clean', 'build', 'watch'), function() {
    return;
});
