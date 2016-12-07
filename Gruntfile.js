module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            options: {
                target: 'es6',
                module: 'commonjs',
                moduleResolution: 'node',
                sourceMap: true,
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                removeComments: false,
                noImplicitAny: false,
                allowJs: true
            },
            all: {
                src: ['hedgehog/**/*.ts', 'typings/index.d.ts'],
                outDir: 'build/hedgehog'
            },
            test: {
                src: ['test/**/*.ts', 'typings/index.d.ts'],
                outDir: 'build'
            }
        },
        babel: {
            options: {
                presets: ['es2015']
            },
            all: {
                files: [{
                    expand: true,
                    cwd: 'build',
                    src: ['**/*.js', '!src/client/node_modules/*'],
                    dest: 'build'
                }]
            }
        },
        clean: [
            'build',
            'tmp'
        ],
        copy: {
            proto: {
                files: [
                    {
                        expand: true,
                        cwd: 'hedgehog/protocol/proto',
                        src: ['*.js'],
                        dest: 'build/hedgehog/protocol/proto'
                    }
                ]
            }
        },
        tslint: {
            options: {
                configuration: "tslint.json"
            },
            proto: 'hedgehog/proto/**/*.ts',
            test: 'test/**/*.ts'
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('protoc', function() {
        var exec = require('child_process').execSync;
        exec("protoc --proto_path=proto --js_out=import_style=commonjs,binary:. `find proto -name '*.proto'`", { encoding: 'utf8' });
    });

    grunt.registerTask('compile', ['ts', 'babel']);
    grunt.registerTask('build', ['clean', 'compile', 'copy']);
};