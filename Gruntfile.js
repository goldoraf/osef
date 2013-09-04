module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-es6-module-transpiler');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    
    grunt.initConfig({
        clean: ['tmp', 'dist'],
        
        transpile: {
            framework: {
                type: 'cjs',
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'tmp/transpiled/'
                }]
            }
        },

        browserify: {
            framework: {
                src: 'tmp/transpiled/osef.js',
                dest: 'dist/osef.es5.js',
                options: {
                    transform: [function(file) {
                        return require('es6ify')(file);
                    }],
                    //standalone: 'Osef'
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
                        return filePath.replace(/testapp\/src\/templates\//, '');
                    }
                },
                files: {
                    'testapp/js/templates.js': ['testapp/src/templates/**/*.hbs']
                }
            }
        },

        copy: {
            js: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['dist/osef.js'],
                    dest: 'testapp/js/'
                }]
            }
        },

        connect: {
            testapp: {
                options: {
                    port: 8020,
                    base: 'testapp',
                    hostname: null,
                    keepalive: true
                }
            }
        }
    });

    grunt.registerTask('testapp', ['copy:js', 'connect:testapp']);
};