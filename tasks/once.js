/*
 * grunt-once
 * https://github.com/tomknig/grunt-once
 *
 * Copyright (c) 2014 Tom König
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	grunt.registerMultiTask('once', 'Open HTML files with PhantomJS and save their DOM to a new file when certain criteria are met.', function () {
		var done,
			phantom,
			binPath,
			which,
			path = require('path'),
			asset = path.join.bind(null, __dirname, '..'),
			options = this.options({
				mergeStylesheets: false,
				mergeScripts: false
			});

		try {
			which = require('which');
			binPath = which.sync('phantomjs');
		} catch (e) {
			binPath = require('phantomjs').path;
		}

		done = this.async();

		this.files.forEach(function (f) {
			var src = f.src.filter(function (filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			});

			if (src.length !== 1) {
				grunt.log.warn('Please specify exactly one source file.');
				return;
			}

			src.forEach(function (file) {
				var code = grunt.file.read(file),
					tempfile = f.dest + '~tmp';

				phantom = grunt.util.spawn({
					cmd: binPath,
					args: [asset('lib/phantom.js'), path.join(__dirname, '../../../', file), tempfile, options]
				}, function () {
					var html = grunt.file.read(tempfile);
					grunt.file.delete(tempfile);
					grunt.file.write(f.dest, html);
					done();
				});
			});
		});
	});
};
