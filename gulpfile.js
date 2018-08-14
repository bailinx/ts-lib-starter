var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var tsify = require('tsify');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var reload = browserSync.reload;
var buffer = require('vinyl-buffer');
var package = require('./package.json');

var watchedBrowserify = watchify(browserify({
  basedir: '.',
  debug: true,
  entries: ['src/index.ts'],
  cache: {},
  packageCache: {},
  standalone: 'TSLib'
}).plugin(tsify));


function bundle() {
  return watchedBrowserify
    .bundle()
    .pipe(source(`${package.name}.js`))
    .pipe(gulp.dest('dist'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe(reload({ stream: true }));
};

watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', gutil.log);

gulp.task('build', bundle);
gulp.task('dev', ['build'], function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});