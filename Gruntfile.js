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
    grunt.loadNpmTasks('grunt-mocha');
    
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
                                       .replace(/\.hbs/, '');
                    }
                },
                files: {
                    'testapp/js/templates.js': ['testapp/src/templates/**/*.hbs']
                }
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

        mocha: {
            all: {
                src: ['test/index.html'],
                options: {
                    // Pipe output console.log from your JS to grunt. False by default.
                    log: true,
                    reporter: 'Nyan',
                    run: true
                }
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
            unittests: {
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
    grunt.registerTask('test', [
        'build:framework',
        'copy:tests_framework',
        'mocha'
    ]);

    grunt.registerTask('testapp', [
        'build:testapp',
        'handlebars:compile',
        'copy:testapp_framework',
        'connect:testapp',
        'watch'
    ]);
    grunt.registerTask('unittests', [
        'copy:tests_framework',
        'connect:unittests'
    ]);

};