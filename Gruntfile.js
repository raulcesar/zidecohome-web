/*jslint node: true */
'use strict';
module.exports = function(grunt) {

	grunt.initConfig({
		connect : {
			serverDes: {
				options: {
					port: 9090,
					keepalive: true,
					base: ['.','app']
				}
			},
			serverBuild: {
				options: {
					port: 9090,
					keepalive: true,
					base: ['build']
				}
			}

		}
	});


	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['connect:serverDes']);
	grunt.registerTask('build', ['connect:serverBuild']);
};