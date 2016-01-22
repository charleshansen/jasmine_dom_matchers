const gulp = require('gulp');
const npm = require('npm');

gulp.task('publish', ['build'], function() {
  npm.load({}, function(error) {
    /* eslint-disable no-console */
    if (error) return console.error(error);
    npm.commands.publish(['dist'], function(error) {
      if (error) return console.error(error);
    });
    /* eslint-enable no-console */
  });
});