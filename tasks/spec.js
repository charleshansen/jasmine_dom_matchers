const compact = require('lodash.compact');
const gulp = require('gulp');
const {jasmine, jasmineBrowser, plumber} = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const webpackStream = require('webpack-stream');

function specSrc() {
  return gulp.src(['spec/**/*_spec.js'], {base: '.'}).pipe(plumber());
}

function specBrowserSrc({plugins, ...options} = {}) {
  const {plugins: configPlugins, ...config} = require('../config/webpack.config')('test');
  options = {...config, ...options, plugins: compact([...configPlugins, ...plugins])};
  return specSrc().pipe(webpackStream(options));
}

gulp.task('jasmine', () => {
  const JasminePlugin = require('gulp-jasmine-browser/webpack/jasmine-plugin');
  const plugin = new JasminePlugin();
  return specBrowserSrc({plugins: [plugin]})
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({whenReady: plugin.whenReady}));
});

gulp.task('spec-browser', () => {
  return specBrowserSrc({watch: false})
    .pipe(jasmineBrowser.specRunner({console: true}))
    .pipe(jasmineBrowser.headless({driver: 'phantomjs'}));
});

function specNode() {
  return specSrc().pipe(jasmine({includeStackTrace: true}));
}

gulp.task('spec-node', specNode);

gulp.task('spec', done => runSequence('spec-node', 'spec-browser', done));

module.exports = {
  specNode
};