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
                noImplicitAny: false
            },
            all: {
                src: ['hedgehog/**/*.ts', 'typings/index.d.ts'],
                outDir: 'build/hedgehog'
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
                        cwd: 'proto/',
                        src: ['**/*.proto'],
                        dest: 'build/proto'
                    }
                ]
            }
        },
        tslint: {
            options: {
                configuration: "tslint.json"
            },
            protocol: 'hedgehog/**/*.ts',
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-babel');


    grunt.registerTask('compile', ['ts', 'babel']);
    grunt.registerTask('build', ['clean', 'compile', 'copy']);
};