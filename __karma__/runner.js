'use strict';
/**
 * This file is merely an entry point for karma, it runs all the files found
 * in this directory
 */


require('babel-polyfill');
require('core-js/fn/object/assign');

// Add support for all files in the test directory
const testsContext = require.context('.', true, /(test\.js$)/);
testsContext.keys().forEach(testsContext);
