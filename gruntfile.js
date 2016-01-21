module.exports = function(grunt) {

	// Configuration
	grunt.initConfig({

		srcPath:        'source/',
		dstPath:        'public/',
		corePath:       'core/',

		defStyle:       'style',
		defScript:      'main',

		srcPathFonts:   '<%= srcPath %>fonts/',
		dstPathFonts:   '<%= dstPath %>fonts/',

		srcPathStyles:  '<%= srcPath %>scss/',
		dstPathStyles:  '<%= dstPath %>css/',

		srcPathImages:  '<%= srcPath %>images/',
		dstPathImages:  '<%= dstPath %>images/',

		srcPathScripts: '<%= srcPath %>js/',
		dstPathScripts: '<%= dstPath %>js/',

		pkg: grunt.file.readJSON('package.json'),

		sass: {
			dist: {
				options: {
					style: 'extended',
					sourcemap: 'auto'
				},
				files: [{
					expand: true,
					cwd: '<%= srcPathStyles %>',
					src: ['**/*.scss'],
					dest: '<%= dstPathStyles %>',
					ext: '.css'
				}]
			}
		},

		postcss: {
			options: {
				processors: [
					require('autoprefixer')({ // add vendor prefixes
						browsers: ['last 2 versions', 'ie >= 8']
					}),
					require('cssnext')({ // add support for future css features
						browsers: ['last 2 versions', 'ie >= 8'],
						compress: false, // minify with cssnano
						sourcemap: true
					}),
					// require('cssnano')(), // minify the result
				],
			},
			dev: {
				options: {
					map: true, // inline sourcemaps
				},
				src: '<%= dstPathStyles %>**/*.css'
			},
			dist: {
				options: {
					map: false,
				},
				src: '<%= dstPathStyles %>**/*.css'
			}
		},

		watch: {

			tpl: {
				files: [
					'<%= srcPath %>_patterns/**/*.mustache',
					'<%= srcPath %>**/*.json'
				],
				tasks: ['shell:patternlab'],
				options: {
					spawn: false
				}
			},

			css: {
				files: ['<%= srcPathStyles %>**/*.scss'],
				tasks: ['sass:dist', 'postcss:dev'],
				options: {
					spawn: false
				}
			},

			js: {
				files: ['<%= srcPathScripts %>**/*.js'],
				tasks: ['scripts','shell:patternlab'],
				options: {
					spawn: false
				}
			},

			assets: {
				files: [
					'<%= corePath %>styleguide/**',
					'<%= srcPathImages %>**',
					'<%= srcPathFonts %>**',
					'<%= srcPath %>_to_root/',
				],
				tasks: ['sync'],
				options: {
					spawn: false
				}
			}
		},

		browserSync: {
			default: {
				bsFiles: {
					src: [
						'<%= dstPathStyles %>*.css',
						'<%= dstPath %>latest-change.txt',
					]
				},
				options: {
					watchTask: true,
					server: {
						baseDir: '<%= dstPath %>',
					},
					ghostMode: {
						clicks: false,
						forms: false,
						scroll: false
					},
					scrollProportionally: false
				},
			},
		},

		sync: {
			default: {
				files: [{ // style guide interface
					expand: true,
					cwd: '<%= corePath %>',
					src: 'styleguide/**',
					dest: '<%= dstPath %>'
				},{ // images
					expand: true,
					cwd: '<%= srcPath %>',
					src: 'images/**',
					dest: '<%= dstPath %>'
				},{ // fonts
					expand: true,
					cwd: '<%= srcPath %>',
					src: 'fonts/**',
					dest: '<%= dstPath %>'
				},{ // files to be copied into root, eg. favicons, manifests, etc
					expand: true,
					cwd: '<%= srcPath %>_to_root/',
					dot: true,
					src: '**',
					dest: '<%= dstPath %>'
				}],
				// pretend: true,
				verbose: true,
				failOnError: true,
				updateAndDelete: false
			},
		},

		shell: {
			patternlab: {
				command: "php core/builder.php -gp"
			},
			cleanlab: {
				command: "php buildlab.php"
			}
		},

		import: {
			dist: {
				options: {},
				files: {
					'<%= dstPathScripts + defScript %>.ext.js' : '<%= srcPathScripts + defScript %>.js',
				},
			}
		},

		uglify: {
			dist: {
				options: {},
				files: {
					'<%= dstPathScripts + defScript %>.js' : '<%= dstPathScripts + defScript %>.ext.js',
				},
			},
		},

		clean: {
			all: '<%= dstPath %>*',
		}
	});


	// Plugins
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-sync');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-import');
	grunt.loadNpmTasks('grunt-contrib-uglify');


/*  ==========================================================================
	Tasks
	========================================================================== */

	grunt.registerTask(
		'scripts',
		'Compiles the scripts.',
		['import:dist', 'uglify:dist']
	);

	grunt.registerTask(
		'build-dev',
		'Compiles all of the assets and copies the files to the public directory. (DEV mode: sourcemaps on)',
		['clean', 'sync', 'sass:dist', 'postcss:dev', 'scripts', 'shell:patternlab']
	);

	grunt.registerTask(
		'build',
		'Compiles all of the assets and copies the files to the public directory.',
		['clean', 'sync', 'sass:dist', 'postcss:dist', 'scripts', 'shell:patternlab']
	);

	grunt.registerTask(
		'build-clean',
		'Compiles all of the assets and copies the files to the public directory, then make a clean build inside the build directory.',
		['build', 'shell:cleanlab']
	);

	/* Default grunt localhost */
	grunt.registerTask(
		'default',
		'Compiles all of the assets and copies the files to the public directory, serves and watch',
		['build-dev', 'browserSync', 'watch']
	);

};
