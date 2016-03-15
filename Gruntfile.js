// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    'use strict';
    require('es6-promise').polyfill();
    // load all grunt tasks
    var matchdep = require('matchdep');
    matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      bower_concat: {
        all: {
          dest: {
            'js': 'src/js/_bower.js',
            'css': 'src/css/_bower.css'
          },
          exclude: [

          ],
          dependencies: {
            'jquerymy' : ['sugar','jquery'],
            'jquery' : 'sugar'
          },
          bowerOptions: {
            relative: false
          }
        }
      },
      concat: {
        options: {
          // separator: ';'
        },
        // js: {
        //   // src: ['src/components/jquery/dist/jquery.js','src/components/leaflet/dist/leaflet.js',
        //   src: ['src/js/_bower.js', 'src/js/*.js'],
        //   dest: 'dist/js/<%= pkg.name %>.js'
        // },
        css: {
          src: ['src/css/_bower.css','src/css/*.css'],
          dest: 'dist/css/<%=pkg.name %>.css'
        }
      },
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
          files: {
            'dist/js/_bower.min.js': 'src/js/_bower.js',
            'dist/js/main.min.js': 'src/js/main.js'
          }
        }
      },
      jshint: {
        files: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js', '!src/**/_bower.js'],
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
            dest: 'src/css',
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
      postcss: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({
              browsers: ['last 2 versions']
            }),
            require('cssnano')() // minify result
          ]
        },
        dist: {
          src: ['dist/css/**/*.css', '!dist/css/**/*min.css']
        }
      },
      copy: {
         main: {
           expand: true,
           cwd: 'src',
           src: ['**', '!css/**', '!js/**', '!scss/**', '!components/**'],
           dest: 'dist/'
         }
      },
      browserSync: {
        dev: {
          options:  {
            server: 'dist',
            background: true
          }
        }
      },
      bsReload: {
        css: {
          reload: "dist/css/ischool.min.css"
        },
        js: {
          reload: ["dist/js/main.min.js","dist/js/_bower.min.js"]
        },
        all: {
          reload: true
        }
      },
      watch: {
        options: {
          spawn: false
        },
        sass: {
          files: ['<%= sass.dist.files[0].src %>'],
          tasks: ['sass','concat:css','postcss:dist', 'cssmin', 'bsReload:css']
        },
        js: {
          files: ['<%= jshint.files %>'],
          tasks: ['jshint','uglify','bsReload:js']
        },
        html: {
          files: 'src/*.html',
          tasks: ['copy', 'bsReload:all']
        }
      }
    });

    grunt.registerTask('test', ['jshint']);
    // Concat bower components, convert scss to css, concat css, autoprefix css, minify css, lint js, concat js, minify js, copy remaining files over, and watch
    grunt.registerTask('default', ['bower_concat','sass','concat:css','postcss:dist','jshint', 'uglify', 'copy','browserSync', 'watch']);
};
