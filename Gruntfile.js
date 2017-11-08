module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            default: {
                tsconfig: {
                    passThrough: true
                }
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
            client: 'hedgehog/client/**/*.ts',
            test: 'test/**/*.ts'
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-symlink');

    grunt.registerTask('protoc', function() {
        var exec = require('child_process').execSync;
        exec("protoc --proto_path=proto --js_out=import_style=commonjs,binary:. `find proto -name '*.proto'`", { encoding: 'utf8' });
    });

    grunt.registerTask('build', ['clean', 'ts', 'copy']);
};