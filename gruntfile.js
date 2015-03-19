module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jasmine: {
      test: {
        options: {
          helpers: ["spec/vendor/**/*.js", "lib/**/*.js", "spec/SpecHelper.js"],
          specs: "spec/**/*Spec.js",
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