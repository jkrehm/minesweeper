module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compile: {
                options: {
                    baseUrl: '../js/',
                    mainConfigFile: '../js/main.js',
                    out: '../js/dist/minesweeper.js',
                    name: 'main',
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('default', ['requirejs']);

};