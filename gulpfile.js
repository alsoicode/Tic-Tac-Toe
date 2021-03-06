var gulp = require('gulp'),
    serve = require('gulp-serve'),
    jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	gutil = require('gulp-util'),
	less = require('gulp-less'),
	LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleanCSS = new LessPluginCleanCSS({ advanced: true }),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	uglify = require('gulp-uglifyjs'),
	concat = require('gulp-concat'),
	mocha = require('gulp-mocha'),
	rename = require('gulp-rename'),
    stripCode = require('gulp-strip-code'),
	staticRoot = 'static/',
	jsRoot = staticRoot + 'js/',
	nodeModulesRoot = 'node_modules/',
	paths = {
		jsRoot: jsRoot,
		common: [
			nodeModulesRoot + 'jquery/dist/jquery.js',
			nodeModulesRoot + 'bootstrap/dist/bootstrap.js',
			nodeModulesRoot + 'underscore/underscore.js'
		],
		less: staticRoot + 'less/',
		css: staticRoot + 'css/',
		browserifySrc: [jsRoot + 'src/game.js'],
		jsDist: jsRoot + 'dist/'
	};

function reportChange(event){
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

function getFileName(path) {
	return path.substr(path.lastIndexOf('/') + 1);
}

gulp.task('compile-bootstrap', function() {
	return gulp.src(nodeModulesRoot + 'bootstrap/less/**/*.less')
		.pipe(plumber(function(error) {
			gutil.beep();
			gutil.log(error);
		}))
		.pipe(less({
	        plugins: [cleanCSS]
	      }))
		.pipe(concat('bootstrap.min.css'))
		.pipe(gulp.dest(paths.css));
});

// compile Less to CSS
gulp.task('compile-less', function() {
  return gulp.src(paths.less + '*.less')
    .pipe(plumber(function(error) {
      gutil.beep();
      gutil.log(error);
    }))
    .pipe(less({
        plugins: [cleanCSS]
      }))
	.pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.css));
});

// concatenate common js libraries into one file
gulp.task('build-common-js', function() {
	return gulp.src(paths.common)
		.pipe(concat('common.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.jsDist));
});

// Browserify js source files
gulp.task('browserify', function(callback) {
	paths.browserifySrc.forEach(function(path) {
		var filename = getFileName(path),
			bundler = new browserify({ debug: true }),
			sourcemapPath = paths.jsDist + filename.split('.')[0] + '.map.json';

		bundler.add(path);
		bundler.plugin('minifyify', {
			map: sourcemapPath,
			output: sourcemapPath
		});

		return bundler.bundle()
				.pipe(plumber(function(error) {
				  gutil.beep();
				  gutil.log(error);
				}))
				.pipe(source(filename))
				.pipe(stripCode())
				.pipe(rename({
					suffix: '.min'
				}))
				.pipe(gulp.dest(paths.jsDist));
	});

	callback();
});

gulp.task('uglify', function() {
    return gulp.src(paths.jsRoot + 'src/*.js')
        .pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
        .pipe(gulp.dest(paths.jsRoot + 'dist'));
});

gulp.task('test', function() {
    return gulp.src('tests/*.js', { read: false })
        .pipe(mocha({
            ui: 'bdd',
            reporter: 'nyan'
        }))
        .once('error', function(error) {
			console.log(error);
            process.exit(1);
        })
        .once('end', function() {
            process.exit();
        });
});

gulp.task('watch', function() {
	gulp.watch(paths.less + '*.less', ['compile-less']).on('change', reportChange);
	gulp.watch(jsRoot + 'src/*.js', ['browserify']).on('change', reportChange);
});

gulp.task('serve', serve('.'));

gulp.task('default', ['watch', 'serve']);
