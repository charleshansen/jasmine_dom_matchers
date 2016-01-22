'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

global.document = require('jsdom').jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;

require('babel-core/register');
require('babel-polyfill');
(require('require-dir'))('./tasks');