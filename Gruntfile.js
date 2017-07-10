const imageminSvgo = require('imagemin-svgo');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');

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
        command: 'ng build --prod --aot false'
      }
    },
    copy: {
      common: {
        files: [
          { expand: true, src: ['dist/*'], dest: 'dist/src', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/app/resources/*'], dest: 'dist/src/app/resources', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/app/config/config.json'], dest: 'dist/src/app/config', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/app/locale/en.json'], dest: 'dist/src/app/locale', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/app/theme/*'], dest: 'dist/src/app/theme', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/libs/css/*'], dest: 'dist/src/libs/css/', filter: 'isFile', flatten: true },
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
          { expand: true, src: ['tslint.json'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['secret.json'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true },
          { expand: true, src: ['build.config.json'], dest: '<%= build.githubFolder %>', filter: 'isFile', flatten: true }
        ]
      }
    },
    uglify: {
      options: {
        mangle: false,
        sourceMap: false,
        sourceMapName: 'build/sourcemap.map'
      },
      javascript: {
        files: {
          'dist/src/libs/js/mt.bundle.min.js': ['dist/src/libs/js/mobileticket-*.js'],
          'dist/src/libs/js/analytics.bundle.min.js': ['dist/src/libs/js/analytics.min.js']
        }
      }
    },
    concat: {
			js: {
				src: ['dist/src/libs/js/analytics.bundle.min.js', 'dist/src/libs/js/mt.bundle.min.js', 'dist/src/inline.*.bundle.js','dist/src/vendor.*.bundle.js', 'dist/src/styles.*.bundle.js', 'dist/src/main.*.bundle.js'],
				dest: 'dist/src/concat.min.js'
			},
			css: {
				src: ['dist/src/styles.*.bundle.css', 'dist/src/libs/css/*.css'],
				dest: 'dist/src/concat.min.css'
			}
		},
    clean: {
      options: { force: true },
      start: ["dist/"],
      folder: ["dist/src/libs/"],
      contents: ["dist/src/inline.*.js", "dist/src/inline.*.bundle.map", "dist/src/main.*.bundle.map", "dist/src/main.*.js", "dist/src/styles.*.js", "dist/src/styles.*.bundle.map", "dist/src/styles.*.css", "dist/src/main.*.bundle.js.gz", "dist/src/concat.min.js", "dist/src/concat.min.css", "dist/src/vendor.*.bundle.js", "dist/src/3rdpartylicenses.txt", "dist/3rdpartylicenses.txt"],
      end: ['dist/*.js', 'dist/*.css', 'dist/*.gz', 'dist/*.map', 'dist/*.html', 'dist/*.ico'],
      git_hub_files: ['<%= build.githubFolder %>/*.*', '!<%= build.githubFolder %>/.git', '!<%= build.githubFolder %>/.gitignore'],
      other_lang_files: ['<%= build.githubFolder %>/src/app/locale/*.json', '!<%= build.githubFolder %>/src/app/locale/en.json'],
      zip_file: ['dist/mobile-ticket.zip']
    }, 
    'string-replace': {
			inline: {
				files: {
					'dist/src/index.html': 'dist/src/index.html',
				},
				options: {
					replacements: [
						{
							pattern: /styles\.[a-f0-9]*\.bundle\.css/g,
          					replacement: 'gz/concat.min.css'
        				},
						{
							pattern: /inline\.[a-f0-9]*\.bundle\.js/g,
          					replacement: 'gz/concat.min.js'
        				},
						{
							pattern: /<script type="text\/javascript" src="((main)|(styles)|(vendor))\.[a-f0-9]*\.bundle\.js"><\/script>/g,
          					replacement: ''
        				},
                {
							pattern: /<link rel="stylesheet" href="libs\/css\/bootstrap\.min\.css">/g,
          					replacement: ''
        				},
                {
							pattern: /<script async type="text\/javascript" src="libs\/js\/analytics\.min\.js"><\/script>/g,
          					replacement: ''
        				},
                {
							pattern: /<script type="text\/javascript" src="libs\/js\/mobileticket-1\.0\.1\.js"><\/script>/g,
          					replacement: ''
        				}
                
					]
				}
			}
		},
    compress: {
			main: {
				options: {
					mode: 'gzip'
				},
				files: [
					{ expand: true, cwd: 'dist/src/', src: ['concat.min.js'], dest: 'dist/src/gz', ext: '.min.js.gz' },
					{ expand: true, cwd: 'dist/src/', src: ['concat.min.css'], dest: 'dist/src/gz', ext: '.min.css.gz' }
				]
			}
		},
    replace: {
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
            },
             {
              match: /xhr.setRequestHeader/g, replacement: function () {
                return '//xhr.setRequestHeader';
              }
            }
          ]
        },
        files: [
          { expand: true, flatten: true, src: ['dist/src/index.html'], dest: 'dist/src' },
          { expand: true, flatten: true, src: ['dist/src/libs/js/mobileticket-1.0.1.js'], dest: 'dist/src/libs/js/' }
        ]
      }
    },
    zip: {
      'using-cwd': {
        cwd: 'dist/',
        //src: ['dist/node_modules/**','dist/src/**','dist/sslcert/**','dist/proxy-config.json','dist/server.js'],
        src: ['dist/**'],
        dest: 'dist/mobile-ticket.zip'
      }
    },
    secret: grunt.file.readJSON('secret.json'),
    sftp: {
      deploy: {
        files: {
            "./": "dist/mobile-ticket.zip"
        },
        options: {
            path: '<%= secret.path %>',
            host: '<%= secret.host %>',
            username: '<%= secret.username %>',
            password: '<%= secret.password %>',
            showProgress: true,
            srcBasePath: "dist/"
        }
      }
    },
    imagemin: {
    svg: {
      options: {
        optimizationLevel: 7,
        user: [
          imageminSvgo({
            plugins: [{removeViewBox: true}]
		      }),
          ]
      },
      files: [
        {
          expand: true,
          src: ['dist/src/app/resources/*.svg'],
          dest: '.',
          ext: '.svg'
        }
      ]
    },
    png: {
      options: {
        optimizationLevel: 7,
        user: [
          imageminOptipng()
          ]
      },
      files: [
        {
          expand: true,
          src: ['dist/src/app/resources/*.png'],
          dest: '.',
          ext: '.png'
        }
      ]
    },
    jpg: {
      options: {
        progressive: true,
        optimizationLevel: 7,
        user: [
          imageminJpegtran()
          ]
      },
      files: [
        {
          expand: true,
          src: ['dist/src/app/resources/*.jpg'],
          dest: '.',
          ext: '.jpg'
        }
      ]
    }
  },
  htmlmin: {               
    dist: {                                    
      options: {                              
        removeComments: true,
        collapseWhitespace: true
      },
      files: {                                   
        'dist/src/index.html': 'dist/src/index.html'
      }
    }
  }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-properties-reader');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-ssh');

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');


  grunt.registerTask('help', function () {
    console.log("Available commands \n");
    console.log("Command - grunt \n");
    console.log("Following flags are supported\n");
    console.log("\t build_production - Build project files and copy them to 'dist' folder \n");
    console.log("\t build_development - Build project files and copy them to 'dist' folder without minification \n");
    console.log("\t extract_for_github - Copy the required files which are intended to go to github repo to 'mobileticket_git_hub' folder  \n");
    console.log("\t remote_deploy - Build production release and deploy the zip file to specified location/server. \n");
  });

  grunt.registerTask('build_development', ['clean:start', 'shell:ngbuild_development:command', 'copy:common', 'clean:end', 'copy:proxy_files']);
  grunt.registerTask('build_production', ['clean:start', 'shell:ngbuild_production:command', 'copy:common','uglify', 'concat', 'string-replace','imagemin', 'compress', 'htmlmin', 'clean:end', 'clean:folder', 'clean:contents','copy:proxy_files']);
  grunt.registerTask('remote_deploy', ['clean:start', 'shell:ngbuild_production:command', 'copy:common','uglify', 'concat', 'string-replace','imagemin', 'compress',  'clean:end', 'clean:folder', 'clean:contents', 'htmlmin','copy:proxy_files', 'zip', 'sftp:deploy', 'clean:zip_file']);
};