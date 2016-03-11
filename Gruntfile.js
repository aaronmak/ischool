// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    'use strict';
    // load all grunt tasks
    var matchdep = require('matchdep');
    matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
        options: {
          separator: ';'
        },
        dist: {
          src: ['src/components/jquery/dist/jquery.js'],
          dest: 'dist/<%= pkg.name %>.js'
        }
      },
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
          files: {
            'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
          }
        }
      },
      jshint: {
        files: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js'],
        options: {
          // options here to override JSHint defaults
          globals: {
            jQuery: true,
            console: true,
            module: true,
            document: true
          }
        }
      },
      sass: {
        dist: {
          files: [{
            expand: true,
            cwd: 'src/scss',
            src: ['**/*.scss'],
            dest: 'dist/css',
            ext: '.css'
          }]
        }
      },
      cssmin: {
        target: {
          files: [{
            expand: true,
            cwd: 'dist/css',
            src: ['*.css', '!*.min.css'],
            dest: 'dist/css',
            ext: '.min.css'
          }]
        }
      },
      watch: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      }
    });

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['sass','cssmin','jshint', 'concat', 'uglify']);
};
