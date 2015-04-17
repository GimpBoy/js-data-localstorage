/*
 * js-data-localstorage
 * http://github.com/js-data/js-data-localstorage
 *
 * Copyright (c) 2014-2015 Jason Dobry <http://www.js-data.io/docs/dslocalstorageadapter>
 * Licensed under the MIT license. <https://github.com/js-data/js-data-localstorage/blob/master/LICENSE>
 */
module.exports = function (grunt) {
  'use strict';

  require('jit-grunt')(grunt, {
    coveralls: 'grunt-karma-coveralls'
  });
  require('time-grunt')(grunt);

  var webpack = require('webpack');
  var pkg = grunt.file.readJSON('package.json');
  var banner = 'js-data-localstorage\n' +
    '@version ' + pkg.version + ' - Homepage <http://www.js-data.io/docs/dslocalstorageadapter>\n' +
    '@author Jason Dobry <jason.dobry@gmail.com>\n' +
    '@copyright (c) 2014-2015 Jason Dobry \n' +
    '@license MIT <https://github.com/js-data/js-data-localstorage/blob/master/LICENSE>\n' +
    '\n' +
    '@overview localStorage adapter for js-data.';

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    clean: {
      coverage: ['coverage/'],
      dist: ['dist/']
    },
    watch: {
      dist: {
        files: ['src/**/*.js'],
        tasks: ['build']
      }
    },
    uglify: {
      main: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/js-data-localstorage.min.map',
          banner: '/*!\n' +
          '* js-data-localstorage\n' +
          '* @version <%= pkg.version %> - Homepage <http://www.js-data.io/docs/dslocalstorageadapter>\n' +
          '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
          '* @copyright (c) 2014-2015 Jason Dobry\n' +
          '* @license MIT <https://github.com/js-data/js-data-localstorage/blob/master/LICENSE>\n' +
          '*\n' +
          '* @overview localStorage adapter for js-data.\n' +
          '*/\n'
        },
        files: {
          'dist/js-data-localstorage.min.js': ['dist/js-data-localstorage.js']
        }
      }
    },
    webpack: {
      dist: {
        entry: './src/index.js',
        output: {
          filename: './dist/js-data-localstorage.js',
          libraryTarget: 'umd',
          library: 'DSLocalStorageAdapter'
        },
        externals: {
          'js-data': {
            amd: 'js-data',
            commonjs: 'js-data',
            commonjs2: 'js-data',
            root: 'JSData'
          }
        },
        module: {
          loaders: [
            { test: /(src)(.+)\.js$/, exclude: /node_modules/, loader: 'babel-loader?blacklist=useStrict' }
          ],
          preLoaders: [
            {
              test: /(src)(.+)\.js$|(test)(.+)\.js$/, // include .js files
              exclude: /node_modules/, // exclude any and all files in the node_modules folder
              loader: "jshint-loader?failOnHint=true"
            }
          ]
        },
        plugins: [
          new webpack.BannerPlugin(banner)
        ]
      }
    },
    karma: {
      options: {
        configFile: './karma.conf.js'
      },
      dev: {
        browsers: ['Chrome'],
        autoWatch: true,
        singleRun: false,
        reporters: ['spec'],
        preprocessors: {}
      },
      min: {
        browsers: ['Chrome', 'Firefox', 'PhantomJS'],
        options: {
          files: [
            'node_modules/es6-promise/dist/es6-promise.js',
            'node_modules/js-data/dist/js-data.min.js',
            'dist/js-data-localstorage.min.js',
            'karma.start.js',
            'test/**/*.js'
          ]
        }
      },
      ci: {
        browsers: ['Chrome', 'Firefox', 'PhantomJS']
      }
    },
    coveralls: {
      options: {
        coverage_dir: 'coverage'
      }
    }
  });

  grunt.registerTask('version', function (filePath) {
    var file = grunt.file.read(filePath);

    file = file.replace(/<%= pkg\.version %>/gi, pkg.version);

    grunt.file.write(filePath, file);
  });

  grunt.registerTask('test', ['build', 'karma:ci', 'karma:min']);
  grunt.registerTask('build', [
    'clean',
    'webpack',
    'uglify:main'
  ]);
  grunt.registerTask('go', ['build', 'watch:dist']);
  grunt.registerTask('default', ['build']);
};
