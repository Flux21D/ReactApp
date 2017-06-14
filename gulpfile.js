/* GULP TASKS */

/* These are the required packages needed to carry out the Gulp Task Below. */
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const argv = require('yargs').argv;
const babelify = require('babelify');
const runSequence = require('run-sequence');
const del = require('del');
const less = require('gulp-less');
const pump = require('pump');
const ROOT_DEV_PATH = './src/public/';
const ROOT_PROD_PATH = './lib/public/';
/*  -----------------------  */

/* BABEL TASKS  */


/*  These compily the server controllers from ES6 to ES5 and puts the relevant
    files in the lib/server-controllers/ */
gulp.task('babelify-server-controllers', () => {
  return gulp.src('src/server-controllers/**/*.js').pipe(babel({
    presets: ['es2015'],
  })).pipe(gulp.dest('lib/server-controllers/'));
});

/*  These compily the routes from ES6 to ES5 and puts the relevant
    files in the lib/routes/ */
gulp.task('babelify-routes', () => {
  return gulp.src('src/routes/**/*.js').pipe(babel({
    presets: ['es2015'],
  })).pipe(gulp.dest('lib/routes/'));
});


/*  These compily the web files from ES6 to ES5 and puts the relevant
    files in the lib/web/ */
gulp.task('babelify-web', () => {
  return gulp.src(['src/web/**/*.html']).pipe(gulp.dest('lib/web/'));
});

gulp.task('babelify', () => {
    return gulp.src(['./src/**/*.js', '!./src/public/**/*.js'])
        .pipe(babel({
            presets: ['es2015', 'stage-2'],
        }))
        .pipe(gulp.dest('./lib'));
});

/*  -----------------------  */

/* BROWSERIFY TASKS  */

/*  Browserify turns front end modules into a single bundle.js. It reads the ES6
    files found in the src directory and then outputs the bundle.js file to
    public/js to in the lib be rendered on the browser. */
gulp.task('browserify', () => {
  return browserify('src/client-controllers/main.js')
        .transform('babelify')
        .bundle()
        .pipe(source('bundle.js')) // this is the output file name
        .pipe(gulp.dest('./lib/public/js/')); // and this is where it ends up
});

/*  -----------------------  */

/* IMAGE COMPRESSION TASKS  */

/*  This taks compresses all images from the src directory into the lib directory.
    If no compression is possible it simply copies the file from src to lib.*/
gulp.task('image', () => {
  return gulp.src('./src/public/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('lib/public/img/'));
});

/*  -----------------------  */

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

/* SASS TASKS  */

/*  This task complies SASS to CSS and ouputs the single .css file into the lib
    directory.*/
gulp.task('sass', () => {
  return gulp.src('./src/public/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./lib/public/css'));
});

/*  -----------------------  */

/* MOCHA UNIT TEST TASKS  */

/*  Unit Testing comes as default for this codebase. Mocha is used to run the Unit
    Tests, this test is being called from 'npm test' */
gulp.task('mocha', () => {
  gulp.src('tests/mocha.js', {
    read: false,
  }).pipe(mocha({
    reporter: 'nyan',
  }));
});

gulp.task('minify-xml-transfer', () => {
  pump([
    gulp.src('./src/public/*.xml'),
    gulp.dest('./lib/public'),
  ]);
});
/*  -----------------------  */

/* ESLINT TEST TASK */

/*  This task runs the linting task and makes sure the code matches the standards
    found in the .eslintrc file, this test is being called from 'npm test' */
gulp.task('lint', () => {
  return gulp.src(['**/**/*.js', '!node_modules/**', '!lib/**', '!src/public/js/bundle.js', '!src/public/vendor/*.js'])
        .pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError());
});

/*  -----------------------  */

/* Minify Tasks TASK */

/*  The purpose of this task is to minify any vendor JavaScript code that the
    project uses. */
gulp.task('minify-js-vendor', () => {
  pump([
    gulp.src('src/public/vendor/*.js'),
    uglify(),
    gulp.dest('lib/public/vendor'),
  ]);
});

/*  The purpose of this task is to minify CSS code that the project uses. */
gulp.task('minify-css-vendor', () => {
  return gulp.src('src/public/vendor/*.css')
        .pipe(cleanCSS({
          compatibility: 'ie8',
        }))
        .pipe(gulp.dest('lib/public/vendor'));
});

gulp.task('minify-css-styles', () => {
// gulp.task('minify-js-styles', () => {

  pump([
    gulp.src('./src/public/styles/*.*'),
    gulp.dest('./lib/public/styles'),
  ]);
});

/*  The purpose of this task is to minify any user-built JavaScript code that the
    project uses. */
gulp.task('minify-js', () => {
  pump([
    gulp.src('./src/public/scripts/*.js'),
    uglify(),
    gulp.dest('./lib/public/scripts'),
  ]);
});


/*  -----------------------  */

/* DEFAULT TASK */

/*  This is the default task and watches any folder / file which changes.
    The structure goes: ([Folders / Files to Watch], [Gulp Task]) */
gulp.task('watch', () => {
   gulp.watch(['./src/**/*.js', '!./src/public/**/*.js'], ['babelify']);
  gulp.watch(['./src/routes/*.js'], ['babelify-routes']);
  gulp.watch(['./src/web/*.js'], ['babelify-web']);
  gulp.watch(['./src/public/img/*'], ['image']);
  gulp.watch(['./src/public/scss/*.scss'], ['sass']);
  gulp.watch(['./src/client-controllers/*.js'], ['browserify']);
  gulp.watch(['./src/public/vendor/*.js'], ['minify-js-vendor']);
  gulp.watch(['./src/public/scripts/*.js'], ['minify-js']);
  gulp.watch(['./src/public/vendor/*.css'], ['minify-css-vendor']);
  gulp.watch(ROOT_DEV_PATH + 'less/**/*.less', ['less']);
  gulp.watch(ROOT_DEV_PATH + 'img/**/*', ['image']);
  gulp.watch(ROOT_DEV_PATH + 'svg/**/*', ['svg']);
  gulp.watch(ROOT_DEV_PATH + 'fonts/**/*', ['font']);
});

/*  -----------------------  */

/* START TASK */

// Make my default task to watch both folders
//gulp.task('default', ['watch']);
gulp.task('build', ['less', 'image', 'font','babelify','babelify-web','minify-js-vendor','minify-js', 'minify-css-styles','minify-xml-transfer']);

/*  -----------------------  */
