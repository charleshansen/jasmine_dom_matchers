module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jasmine: {
      test: {
        options: {
          helpers: "lib/**/*.js",
          specs: "spec/**/*.js",
          keepRunner: true
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8888,
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');
};