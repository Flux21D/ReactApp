/* These are the required packages needed to carry out the Gulp Task Below. */
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const argv = require('yargs').argv;
const babelify = require('babelify');
const pump = require('pump');

process.env.NODE_ENV = argv.prod ? 'production' : 'development';

const ROOT_DEV_PATH = './src/public/';
const ROOT_PROD_PATH = './lib/public/';

gulp.task('minify-vendor', () => {
  pump([
    gulp.src('./src/public/vendor/**/*.js'),
    gulp.dest('./lib/public/vendor'),
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

gulp.task('css', () => {
    gulp.src(ROOT_DEV_PATH + 'vendor/css/*.css')
        .pipe(gulp.dest(ROOT_PROD_PATH + 'vendor/css'));
});

gulp.task('font', () => {
    return gulp.src(ROOT_DEV_PATH + 'fonts/**/*')
        .pipe(gulp.dest(ROOT_PROD_PATH + 'fonts/'));
});

// This task transforms SASS into CSS.
gulp.task('sass', () => {
    return gulp.src('./src/public/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./lib/public/css'));
});

gulp.task('lint', () => {
// ESLint ignores files with "node_modules" paths.
// So, it's best to have gulp ignore the directory as well.
// Also, Be sure to return the stream from the task;
// Otherwise, the task may end before the stream has finished.
    return gulp.src(['**/*.js', '!node_modules/**', '!lib/**', '!src/public/js/bundle.js', '!src/public/vendor/scripts/*.js'])
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
// gulp.task('watch', () => {
//     gulp.watch(['./src/public/vendor/scripts/*.js'],['minify-js-vendor']);
//     gulp.watch(['./src/public/*.xml'],['minify-xml-transfer']);
//     gulp.watch(['./src/public/*.txt'],['minify-text-transfer']);
//     gulp.watch(['./src/public/vendor/styles/*.css'],['minify-css-styles']);
//     gulp.watch(['./src/**/*.js', '!./src/public/**/*.js'],['babelify']);
//     gulp.watch([ROOT_DEV_PATH + 'img/**/*'],['image']);
//     gulp.watch([ROOT_DEV_PATH + 'svg/**/*'],['svg']);
//     gulp.watch([ROOT_DEV_PATH + 'less/master.less'],['less']);
//     gulp.watch([ROOT_DEV_PATH + 'fonts/**/*'],['font']);
//     gulp.watch(['./src/public/scss/*.scss'],['sass']);
//     gulp.watch(['tests/mocha.js'],['mocha']);
//     gulp.watch(['**/*.js', '!node_modules/**', '!lib/**', '!src/public/js/bundle.js', '!src/public/vendor/scripts/*.js'],['lint']);
// });

// Make my default task to watch both folders


gulp.task('build', ['minify-vendor', 'babelify', 'image', 'css', 'font', 'sass', 'lint']);
// gulp.task('default', ['watch']);


