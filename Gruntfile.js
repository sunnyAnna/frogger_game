module.exports = function (grunt) {

    grunt.initConfig({
        jsdoc: [{
            src: ['js/*.js'],
            dest: 'documentation/'
                }],
        clean: {
            dev: {
                src: ['documentation']
            }
        },
        mkdir: {
            dev: {
                options: {
                    create: ['documentation']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.registerTask('default', ['clean', 'mkdir', 'jsdoc']);
};
