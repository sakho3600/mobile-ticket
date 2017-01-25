module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    build: grunt.file.readJSON('build.config.json'),
    pkg: grunt.file.readJSON('package.json'),
    browsers: ['Chrome', 'Chrome_without_security'],
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },
    shell: {
      options: {
        stderr: false,
        execOptions: {
          maxBuffer: 1000 * 1000 * 100
        }
      },
      ngbuild_development: {
        command: 'ng build --dev'
      },
      ngbuild_production: {
        command: 'ng build --prod'
      }
    },
    copy: {
      common: {
        files: [
          { expand: true, src: ['dist/*'], dest: 'dist/src', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/app/resources/*'], dest: 'dist/src/app/resources', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/app/config/config.json'], dest: 'dist/src/app/config', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/app/locale/en.json'], dest: 'dist/src/app/locale', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/app/theme/*'], dest: 'dist/src/app/theme', filter: 'isFile', flatten: true }
        ]
      },
      mobileticket_lib: {
        files: [
          { expand: true, src: ['src/libs/js/*'], dest: 'dist/src/libs/js/', filter: 'isFile', flatten: true }
        ]
      },
      proxy_files: {
        files: [
          { expand: true, cwd: 'node', src: '**', dest: 'dist/' },
          { expand: true, src: ['node/*'], dest: 'dist/', filter: 'isFile', flatten: true }
        ]
      },
      git_hub_files: {
        files: [
          { expand: true, cwd: 'node', src: '**', dest: '<%= build.githubFolder %>/node' },
          { expand: true, cwd: 'e2e', src: '**', dest: '<%= build.githubFolder %>/e2e' },
          { expand: true, cwd: 'src', src: '**', dest: '<%= build.githubFolder %>/src' },
          { expand: true, src: ['.editorconfig'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['Gruntfile.js'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['README.md'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['angular-cli.json'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['karma.conf.js'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['license.md'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['package.json'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['protractor.conf.js'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['proxy.config.json'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['setup_grunt.sh'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['tslint.json'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true }
        ]
      }
    },
    uglify: {
      options: {
        mangle: false,
        sourceMap: true,
        sourceMapName: 'build/sourcemap.map'
      },
      javascript: {
        files: {
          'dist/src/libs/js/mobileticket-1.0.1.min.js': ['src/libs/js/mobileticket-1.0.1.js']
        }
      }
    },
    clean: {
      options: { force: true },
      start: ["dist/"],
      end: ['dist/*.js', 'dist/*.css', 'dist/*.gz', 'dist/*.map', 'dist/*.html', 'dist/*.ico'],
      git_hub_files: ['<%= build.githubFolder %>/*.*', '!<%= build.githubFolder %>/.git', '!<%= build.githubFolder %>/.gitignore'],
      other_lang_files: ['<%= build.githubFolder %>/src/app/locale/*.json', '!<%= build.githubFolder %>/src/app/locale/en.json']
    }, replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /<script type="text\/javascript"(.*?)src="libs\/js\/mobileticket-1.0.1.js"><\/script>/g,
              replacement: function () {
                return '';
              }
            },
            {
              match: /<!-- MOBILE-TICKET-MIN-JS -->/g, replacement: function () {
                return '<script type=\'text/javascript\' src=\'libs/js/mobileticket-1.0.1.min.js\' ></script>';
              }
            }
          ]
        },
        files: [
          { expand: true, flatten: true, src: ['dist/src/index.html'], dest: 'dist/src' }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-properties-reader');

  grunt.registerTask('help', function () {
    console.log("Available commands \n");
    console.log("Command - grunt \n");
    console.log("Following flags are supported\n");
    console.log("\t build_production - Build project files and copy them to 'dist' folder \n");
    console.log("\t build_development - Build project files and copy them to 'dist' folder without minification \n");
    console.log("\t extract_for_github - Copy the required files which are intended to go to github repo to 'mobileticket_git_hub' folder  \n");
  });

  grunt.registerTask('build_development', ['clean:start', 'shell:ngbuild_development:command', 'copy:common', 'copy:mobileticket_lib', 'clean:end', 'copy:proxy_files']);
  grunt.registerTask('build_production', ['clean:start', 'shell:ngbuild_production:command', 'uglify', 'copy:common', 'copy:mobileticket_lib', 'clean:end', 'copy:proxy_files', 'replace']);
  grunt.registerTask('extract_for_github', ['clean:git_hub_files', 'copy:git_hub_files', 'clean:other_lang_files']);


};
