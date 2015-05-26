module.exports = function(grunt) {

  // Load the plugin that provides the "uglify" task.
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-jade');
  // grunt.loadNpmTasks('grunt-babel');
  // grunt.loadNpmTasks('grunt-sass');
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['public'],
    babel: {
          main: {
               options: {
                    sourceMap: 'inline'
               },
               files:
                    [
                         {
                              expand: true,
                              cwd: 'src/',
                              src: ['**/*.js'],
                              dest: 'public/'
                         }
                    ]
          }
    },
    copy: {
          main: {
               files: [
                    {
                         expand: true,
                         cwd: 'src/',
                         src: ['**'],
                         dest: 'public/'
                    }
               ]
          }
     },
     jade : {
          main: {
               options: {
                    pretty: true
               },
               files: [
                    {
                         expand: true,
                         cwd: 'src/',
                         src: ['**/*.jade', '!**/_*.jade'],
                         dest: 'public/',
                         ext: '.html'
                    }
               ]
          }
     },
     sass: {
          main: {
               options: {
                    sourceMapEmbed: true,
                    sourceMap: true,
               },
               files: {
                    'public/css/main.css' : 'src/scss/main.scss'
               }
          }
     }
  });



  // Default task(s).
  grunt.registerTask('default', []);
  grunt.registerTask('build', [
     'clean',
     'copy'
     ])

};
