'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () => {
	return gulp.src('index.js')
		.pipe(babel({
			presets: ['es2015', 'stage-0'],
      plugins: ['transform-decorators-legacy', 'transform-object-rest-spread']
		}))
		.pipe(gulp.dest('dist'));
});
