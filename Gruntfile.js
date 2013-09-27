module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-es6-module-transpiler');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    
    grunt.initConfig({
        clean: ['tmp', 'dist'],
        
        transpile: {
            framework: {
                type: 'cjs',
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'tmp/framework/transpiled/'
                }]
            },
            app: {
                type: 'cjs',
                files: [{
                    expand: true,
                    cwd: 'testapp/src/',
                    src: ['**/*.js'],
                    dest: 'tmp/testapp/transpiled/'
                }]
            },
            tests: {
                type: 'cjs',
                files: [{
                    expand: true,
                    cwd: 'test/src/support/',
                    src: ['**/*.js'],
                    dest: 'tmp/test/transpiled/'
                }]
            }
        },

        browserify: {
            framework: {
                src: 'tmp/framework/transpiled/osef.js',
                dest: 'dist/osef.es5.js',
                options: {
                    transform: [function(file) {
                        return require('es6ify')(file);
                    }],
                    standalone: 'Osef'
                }
            },
            app: {
                src: 'tmp/testapp/transpiled/app.js',
                dest: 'testapp/js/app.js',
                options: {
                    transform: [function(file) {
                        return require('es6ify')(file);
                    }],
                    standalone: 'Testapp'
                }
            },
            tests: {
                src: 'tmp/test/transpiled/index.js',
                dest: 'test/js/support.js',
                options: {
                    transform: [function(file) {
                        return require('es6ify')(file);
                    }],
                    standalone: 'Tests'
                }
            }
        },

        concat: {
            framework: {
                src: [
                    // FIXME: This one really ought to be require('es6ify').runtime.
                    // See https://github.com/thlorenz/es6ify/issues/3.
                    'node_modules/es6ify/node_modules/traceur/src/runtime/runtime.js',
                    'dist/osef.es5.js'
                ],
                dest: 'dist/osef.js'
            },
        },
        
        uglify: {
            framework: {
                files: {
                    'dist/osef.min.js': ['dist/osef.js']
                }
            }
        },

        handlebars: {
            compile: {
                options: {
                    namespace: "JST",
                    processName: function(filePath) {
                        return filePath.replace(/testapp\/src\/templates\//, '')
                                       .replace(/test\/src\/templates\//, '')
                                       .replace(/\.hbs/, '');
                    }
                },
                files: {
                    'testapp/js/templates.js': ['testapp/src/templates/**/*.hbs'],
                    'test/js/templates.js': ['test/src/templates/**/*.hbs']
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        copy: {
            testapp_framework: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['dist/osef.js'],
                    dest: 'testapp/js/'
                }]
            },
            tests_framework: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['dist/osef.js'],
                    dest: 'test/js/lib/'
                }]
            }
        },

        connect: {
            testapp: {
                options: {
                    port: 8020,
                    base: 'testapp',
                    hostname: null
                }
            },
            tests: {
                options: {
                    port: 8020,
                    base: 'test',
                    hostname: null,
                    keepalive: true
                }
            }
        },

        watch: {
            testapp_code: {
                files: ['testapp/src/**/*.js'],
                tasks: ['build:testapp']
            },
            testapp_templates: {
                files: ['testapp/src/templates/**/*.hbs'],
                tasks: ['handlebars:compile']
            },
            framework_code: {
                files: ['src/**/*.js'],
                tasks: ['build:framework', 'copy:tests_framework', 'copy:testapp_framework']
            },
            test_support_code: {
                files: ['test/src/support/**/*.js'],
                tasks: ['build:test_support_code']
            }
        }
    });

    grunt.registerTask('build:framework', [
        'clean',
        'transpile:framework',
        'browserify:framework',
        'concat:framework',
        'uglify:framework'
    ]);
    grunt.registerTask('build:testapp', [
        'transpile:app',
        'browserify:app'
    ]);
    grunt.registerTask('build:test_support_code', [
        'transpile:tests',
        'browserify:tests'
    ]);
    grunt.registerTask('setup_test_files', [
        'build:test_support_code',
        'handlebars:compile',
        'copy:tests_framework',
        'browserify:tests'
    ]);
    grunt.registerTask('testapp', [
        'build:testapp',
        'handlebars:compile',
        'copy:testapp_framework',
        'connect:testapp',
        'watch'
    ]);
};