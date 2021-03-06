'use strict';

var gulp       = require('gulp');
var ghPages    = require('gulp-gh-pages');
var $          = require('gulp-load-plugins')();
var sync       = $.sync(gulp).sync;
var del        = require('del');
var browserify = require('browserify');
var babelify   = require('babelify');
var watchify   = require('watchify');
var source     = require('vinyl-source-stream');
var path       = require('path');

require('babel-register');

var bundler = {
  w: null,
  init: function() {
    this.w = watchify(browserify({
      entries: ['./app/app.js'],
      extensions: ['.js'],
      debug: true,
      insertGlobals: true,
      cache: {},
      packageCache: {}
    }).transform(babelify.configure({ presets: ["stage-0", "es2015", "react"], plugins: ["transform-class-properties", "transform-decorators-legacy", "transform-async-to-generator"]})));
  },
  bundle: function() {
    return this.w && this.w.bundle()
      .on('error', $.util.log.bind($.util, 'Browserify Error'))
      .pipe(source('app.js'))
      .pipe(gulp.dest('dist/scripts'));
  },
  watch: function() {
    this.w && this.w.on('update', this.bundle.bind(this));
  },
  stop: function() {
    this.w && this.w.close();
  }
};

gulp.task('deploy', function() {
   return gulp.src('./dist/**/*')
      .pipe(ghPages());
});

gulp.task('scripts', function() {
  bundler.init();
  return bundler.bundle();
});

gulp.task('html', function() {
  return gulp.src('app/*.html')
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('fonts', function() {
  return gulp.src(['app/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size());
});

gulp.task('extras', function () {
  return gulp.src(['app/*.txt', 'app/*.ico'])
    .pipe(gulp.dest('dist/'))
    .pipe($.size());
});

gulp.task('serve', function() {
  gulp.src('dist')
    .pipe($.webserver({
      livereload: true,
      port: 9000
    }));
});

gulp.task('jest', function () {
  var nodeModules = path.resolve('./node_modules');
  return gulp.src('app/**/__tests__')
    .pipe($.jest({
      scriptPreprocessor: nodeModules + '/babel-jest',
      unmockedModulePathPatterns: [nodeModules + '/react']
    }));
});

gulp.task('set-production', function() {
  process.env.NODE_ENV = 'production';
});

gulp.task('minify:js', function() {
  return gulp.src('dist/scripts/**/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe($.size());
});

gulp.task('minify', ['minify:js']);

gulp.task('clean', del.bind(null, 'dist'));

gulp.task('bundle', ['html', 'scripts', 'fonts', 'extras']);

gulp.task('clean-bundle', sync(['clean', 'bundle']));

gulp.task('build', ['clean-bundle'], bundler.stop.bind(bundler));

gulp.task('build:production', sync(['set-production', 'build', 'minify']));

gulp.task('serve:production', sync(['build:production', 'serve']));

gulp.task('test', ['jest']);

gulp.task('default', ['build']);

gulp.task('watch', sync(['clean-bundle', 'serve']), function() {
  bundler.watch();
  gulp.watch('app/*.html', ['html']);
  gulp.watch('app/fonts/**/*', ['fonts']);
});
