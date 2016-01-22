const {babel, header, plumber} = require('gulp-load-plugins')();
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const mergeStream = require('merge-stream');
const runSequence = require('run-sequence');
const webpackStream = require('webpack-stream');

gulp.task('clean', done => {
  del(['dist', '!dist/.gitkeep']).then(() => done(), done);
});

gulp.task('build', done => runSequence('clean', 'babel', done));

gulp.task('babel', () => {
  const copyright = ['/*\n', fs.readFileSync('license.txt', 'utf8'), '*/\n'].join('');
  const config = require('../config/webpack.config')('production');
  return mergeStream(
    gulp.src(['src/matchers.js']).pipe(plumber()).pipe(babel()).pipe(header(copyright)),
    webpackStream(['src/jasmine_dom_matchers.js'], {base: '.'}).pipe(plumber()).pipe(webpackStream(config)).pipe(header(copyright)),
    gulp.src(['license.txt', 'README.md', 'package.json'], {base: '.'}).pipe(plumber())
  ).pipe(gulp.dest('dist'));
});

gulp.task('build', done => runSequence('clean', 'babel', done));

gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.js', ['babel']);
});