/* These are the required packages needed to carry out the Gulp Task Below. */
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const less = require('gulp-less');
const babel = require('gulp-babel');
// const notify = require('gulp-notify');
const argv = require('yargs').argv;
const babelify = require('babelify');
const runSequence = require('run-sequence');
const del = require('del');
const pump = require('pump');

process.env.NODE_ENV = argv.prod ? 'production' : 'development';

const ROOT_DEV_PATH = './src/public/';
const ROOT_PROD_PATH = './lib/public/';


gulp.task('minify-js-vendor', () => {
  pump([
    gulp.src('./src/public/scripts/*.js'),
    gulp.dest('./lib/public/scripts'),
  ]);
});


gulp.task('minify-xml-transfer', () => {
  pump([
    gulp.src('./src/public/*.xml'),
    gulp.dest('./lib/public'),
  ]);
});

gulp.task('minify-css-styles', () => {
// gulp.task('minify-js-styles', () => {

  pump([
    gulp.src('./src/public/styles/*.*'),
    gulp.dest('./lib/public/styles'),
  ]);
});

gulp.task('babelify', () => {
    return gulp.src(['./src/**/*.js', '!./src/public/**/*.js'])
        .pipe(babel({
            presets: ['es2015', 'stage-2'],
        }))
        .pipe(gulp.dest('./lib'));
});

// This is the imaging task.
gulp.task('image', () => {
    return gulp.src(ROOT_DEV_PATH + 'img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(ROOT_PROD_PATH + 'img/'));
});

gulp.task('svg', () => {
    return gulp.src(ROOT_DEV_PATH + 'svg/**/*')
        .pipe(gulp.dest(ROOT_PROD_PATH + 'svg/'));
});

gulp.task('less', () => {
    gulp.src(ROOT_DEV_PATH + 'less/master.less')
        .pipe(less())
        .pipe(gulp.dest(ROOT_PROD_PATH + 'css'));
});

gulp.task('font', () => {
    return gulp.src(ROOT_DEV_PATH + 'fonts/**/*')
        .pipe(gulp.dest(ROOT_PROD_PATH + 'fonts/'));
});

gulp.task('copy', () => {
    gulp.src(ROOT_DEV_PATH + 'robots.txt')
        .pipe(gulp.dest(ROOT_PROD_PATH))
});

gulp.task('clear', () => {
    return del('./lib');
});

// This task transforms SASS into CSS.
gulp.task('sass', () => {
    return gulp.src('./src/public/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./lib/public/css'));
});

// This task runs unit testing from Mocha.
gulp.task('mocha', () => {
    gulp.src('tests/mocha.js', {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('lint', () => {
// ESLint ignores files with "node_modules" paths.
// So, it's best to have gulp ignore the directory as well.
// Also, Be sure to return the stream from the task;
// Otherwise, the task may end before the stream has finished.
    return gulp.src(['**/*.js', '!node_modules/**', '!lib/**', '!src/public/js/bundle.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});


// THIS IS MY DEFAULT TASK - Needs to watch both folder ([Folders / Files to Watch], [Gulp Task])
gulp.task('watch', () => {
    gulp.watch(['./src/public/img/*'], ['image']);
    gulp.watch(['./src/public/scss/*.scss'], ['sass']);
    gulp.watch(['./src/**/*.js', '!./src/public/**/*.js'], ['babelify']);
    gulp.watch(ROOT_DEV_PATH + 'less/**/*.less', ['less']);
    gulp.watch(ROOT_DEV_PATH + 'img/**/*', ['image']);
    gulp.watch(ROOT_DEV_PATH + 'svg/**/*', ['svg']);
    gulp.watch(ROOT_DEV_PATH + 'fonts/**/*', ['font']);
});

// Make my default task to watch both folders

gulp.task('build', ['less', 'svg', 'image', 'font', 'babelify','minify-js-vendor', 'minify-css-styles','minify-xml-transfer']);

// gulp.task('build', ['less', 'svg', 'image', 'font', 'babelify', 'minify-js-styles']);


