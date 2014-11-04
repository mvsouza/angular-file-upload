module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		copy : {
			build : {
				options : {
					processContent : function(content, srcpath) {
						return grunt.template.process(content);
					}
				},
				files : [ {
					expand : true,
					cwd : 'demo/war/js/',
					src : '<%= pkg.name %>*.js',
					dest : 'dist/',
					flatten : true,
					filter : 'isFile'
				}]
			},
			fileapi: {
				files: [{
					expand : true,
					cwd : 'demo/war/js/',
					src : 'FileAPI.flash.swf',
					dest : 'dist/',
					flatten : true,
					filter : 'isFile'
				}, {
					expand : true,
					cwd : 'demo/war/js/',
					src : 'FileAPI.min.js',
					dest : 'dist/',
					flatten : true,
					filter : 'isFile'
				} ]
			},
			bower : {
				files : [ {
					expand : true,
					cwd : 'dist/',
					src : '*',
					dest : '../angular-file-upload-bower/',
					flatten : true,
					filter : 'isFile'
				}, {
					expand : true,
					cwd : 'dist/',
					src : '*',
					dest : '../angular-file-upload-shim-bower/',
					flatten : true,
					filter : 'isFile'
				} ]
			}
		},
		uglify : {
			options : {
				banner : '/*! <%= pkg.version %> */\n'
			},
			build : {
				files : [ {
					'dist/<%= pkg.name %>.min.js' : 'dist/<%= pkg.name %>.js',
					'dist/<%= pkg.name %>-shim.min.js' : 'dist/<%= pkg.name %>-shim.js',
					'dist/<%= pkg.name %>-html5-shim.min.js' : 'dist/<%= pkg.name %>-html5-shim.js'
				} ]
			}
		},
		replace : {
			version : {
				src: ['nuget/Package.nuspec', '../angular-file-upload-bower/bower.json',
					'../angular-file-upload-shim-bower/bower.json', 'aaaa.txt'
					], 
    			overwrite: true,
    			replacements: [{
      				from: /"version" *: *".*"/g,
      				to: '"version": "<%= pkg.version %>"'
    			}, {
      				from: /<version>.*<\/version>/g,
      				to: '<version><%= pkg.version %></version>'
    			}]
			}	
		},
    	connect: {
    	  all: {
    	    options:{
    	      port: 9000,
    	      hostname: "0.0.0.0",
    	      // No need for keepalive anymore as watch will keep Grunt running
    	      //keepalive: true,
 	
    	      // Livereload needs connect to insert a cJavascript snippet
    	      // in the pages it serves. This requires using a custom connect middleware
    	      middleware: function(connect, options) {
 	
    	        return [
 	
    	          // Load the middleware provided by the livereload plugin
    	          // that will take care of inserting the snippet
    	          require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
 	
    	          // Serve the project folder
    	          connect.static(options.base)
    	        ];
    	      }
    	    }
    	  }
    	},
    	open: {
    	  all: {
    	    path: 'http://localhost:<%= connect.all.options.port%>/demo/war/index.html'
    	  }
    	},    
    	regarde: {
    	  all: {
    	    files:['**/*.html','**/*.js'],
    	    tasks: ['livereload']
    	  }
    	}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Default task(s).
	grunt.registerTask('default', [ 'copy:build', 'uglify', 'copy:fileapi', 'copy:bower', 'replace:version' ]);
  	grunt.registerTask('server',['livereload-start','connect','open','regarde']);
};
