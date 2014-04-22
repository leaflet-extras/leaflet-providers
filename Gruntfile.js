/* jshint node:true */
module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['leaflet-providers.js']
		},
		'mocha_phantomjs': {
			all: {
				options: {
					urls: [ //my ide requries process.env.IP and PORT
						'http://' + (process.env.IP || '127.0.0.1') +
						':' + (process.env.PORT || '8080') +
						'/test/index.html'
					]
				}
			}
		},
		connect: {
			server: {
				options: {
					port: process.env.PORT || 8080,
					base: '.'
				}
			}
		}
	});
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	// Default task(s).
	grunt.registerTask('test', ['connect', 'mocha_phantomjs']);
	grunt.registerTask('default', ['jshint', 'test']);
};