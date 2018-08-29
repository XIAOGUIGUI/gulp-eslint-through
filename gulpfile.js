'use strict';

const gulp = require('gulp');
const eslint = require('.');

gulp.task('default', () => {
	gulp.src(['**/*.js', '!node_modules/**', '!coverage/**', '!test/fixtures/**'])
		.pipe(eslint())
		.on('end', () => {})
});
