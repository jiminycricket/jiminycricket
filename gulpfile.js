var gulp           = require('gulp');

var rename         = require('gulp-rename');
var concat         = require('gulp-concat');
var uglify         = require('gulp-uglify');
var changed        = require('gulp-changed');
var jade           = require('gulp-jade');
var compass        = require('gulp-compass');
var sass           = require('gulp-ruby-sass');
var gutil          = require('gulp-util');
var html2jade      = require('gulp-html2jade');
var del            = require('del');
var browserSync    = require('browser-sync');
var merge          = require('merge-stream');
var htmlreplace    = require('gulp-html-replace');
var plumber        = require('gulp-plumber');
var gulpLiveScript = require('gulp-livescript');  
var reload         = browserSync.reload;

var sources = {
  livescripts: './src/livescripts/**/*.ls',
  sass: './src/sass/**/*.sass',
  jade: './src/**/*.jade'
};

var destinations = {
  js: './build/js/app',
  css: './build/stylesheets',
  html: './build/'
};

// Our code After compiled livescripts to js
var ourCodeAfterCompile = [
  './build/js/app/**/*.js',
];

// The AngularJS sources in using
var angularSrc = [
  './build/js/dist/lib/angular.min.js',
];

// Others JS library
var vendorSrc = [
];

// if string have the prefix '!', that file or folder won't be deleted.
var cleanArray = [
  './build/*'
];

// Error handeler
var onError = function (err) {  
    console.log('//////////////////////////////');
    gutil.log(gutil.colors.yellow(err.message));
    console.log('//////////////////////////////');
    //gutil.beep();
    browserSync.notify(err.message, 5000);
};

// Clean all of compiled files
gulp.task('clean', function() {
  del.sync(cleanArray);
}); 

//livescript Compile
gulp.task('ls', function() {
  return gulp.src(sources.livescripts)
    .pipe( plumber({
      errorHandler: onError
    }))
    .pipe(
      changed(destinations.js, {extension: '.js'})
      )
    .pipe(
      gulpLiveScript({bare: true})
      )
    .pipe(
      gulp.dest(destinations.js)
      );
});

// Compass Compile
gulp.task('compass', function() {
    var stream =  gulp.src(sources.sass)
    // .pipe(plumber({
    //   errorHandler: onError
    // }))
    .pipe(compass({
      // config_file: './config.rb',
      css: './build/stylesheets',
      sass: './src/sass',
      require: ['susy']
    })).on('error' , function (err) {  
    console.log('//////////////////////////////');
    gutil.log(gutil.colors.yellow(err.message));
    console.log('//////////////////////////////');
    //gutil.beep();
    browserSync.notify(err.message, 5000);
    stream.end();
    })
    .pipe(gulp.dest(destinations.css))
    .pipe(reload({stream:true}));
    return stream;
});

// Jade Compile
gulp.task('jade', function() {
  // var YOUR_LOCALS = {};
  var all = gulp.src(sources.jade)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(changed(destinations.html, {extension: '.html'}))
    // locals: YOUR_LOCALS,
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(destinations.html));

  var index = gulp.src('./src/index.jade')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(destinations.html));
  return merge(all, index);
});

// Compile HTML to Jade
// gulp.task('html2jade', function() {
//   return gulp.src(['./**/*.html'])
//     .pipe(html2jade({nspace: 2, donotencode: true}))
//     .pipe(gulp.dest('./src'));
// });

// Get the library code to build directory
gulp.task('get-lib', function() {
  return gulp.src('./src/assets/**', {base: './src/assets/'})
    .pipe(gulp.dest('./build'));
});

// Concatenate & Minify JS
// gulp.task('scripts', ['compile'], function() {
//   var ourCode =  gulp.src(ourCodeAfterCompile)
//     .pipe(concat('app.js'))
//     .pipe(rename({suffix: '.min'}))
//     .pipe(uglify({compress: true}))
//     .pipe(gulp.dest('./_public/js/dist/'));

  // var coverflow = gulp.src('./build/js/coverflow/*.js')
  //   .pipe(concat('coverflow.js'))
  //   .pipe(rename({suffix: '.min'}))
  //   .pipe(uglify({compress: true}))
  //   .pipe(gulp.dest(destinations.js + '/dist/'))
  //   .pipe(gulp.dest('./_public/js/dist/'));

  // var vendor = gulp.src(vendorSrc)
  //   .pipe(concat('vendor.js'))
  //   .pipe(rename({suffix: '.min'}))
  //   .pipe(uglify({compress: true}))
  //   .pipe(gulp.dest(destinations.js + '/dist/'))
  //   .pipe(gulp.dest('./_public/js/dist/'));

  // var angularJs = gulp.src(angularSrc)
  //   .pipe(rename(function(path) {
  //     path.basename = path.basename.replace(/.min/g, '') + '.min';
  //   }))
  //   .pipe(uglify({mangle: false, compress: true}))
  //   .pipe(gulp.dest(destinations.js + '/dist/lib/'))
  //   .pipe(gulp.dest('./_public/js/dist/lib/'));

//   return merge(ourCode, coverflow, vendor, angularJs);
// });

// Run Server
gulp.task('browser-sync', ['build'], function() {
  browserSync({
    server: {
      baseDir: './build/'
    },
    port: 8080,
    watchOptions: {debounceDelay: 1000}
  })
});

// Watch files
gulp.task('watch', function() {
  gulp.watch(sources.livescripts, ['ls']);
  gulp.watch(sources.sass, ['compass']);
  gulp.watch(sources.jade, ['jade']);
});

// Livereload
gulp.task('livereload',['watch', 'browser-sync'], function() {
  gulp.watch('./build/**', function(file) {
    if(file.type === 'changed')
      return reload(file.path);
  });
});

gulp.task('bs-reload', function () {
  reload();
});

// Copy necessary files to _pubilc
gulp.task('copy', ['build'], function() {
  var buildDir = [
    './src/assets/**',
    './build/images/**',
    './build/load/**',
    './build/stylesheets/**',
    './build/views/**/*.html',
    './build/notavailable.html',
    './build/js/*.js'
  ];
  var files = gulp.src(buildDir, {base: './build/'})
    .pipe(gulp.dest('./_public/'));

  var mini = gulp.src('./build/index.html')
    .pipe(htmlreplace({
      js: 'js/dist/app.min.js'
    }))
    .pipe(gulp.dest('./_public'));

  return merge(files, mini);
});

// Compile to HTML, CSS, JavaScript
gulp.task('compile', ['clean', 'get-lib', 'ls', 'compass', 'jade']);

gulp.task('build',['compile']);
gulp.task('default',['build', 'livereload']);
// gulp.task('publish',['build', 'scripts', 'copy']);



// CoffeeScript Compile
// gulp.task('coffee', function() {
//     return gulp.src(sources.coffee)
//     .pipe(plumber({
//       errorHandler: onError
//     }))
//     .pipe(changed(destinations.js, {extension: '.js'}))
//     .pipe(coffee({
//       bare: true
//     }))
    // .on('error', function(err){
    //   console.log('//////////////////////////////');
    //   gutil.log(gutil.colors.yellow(err.message));
    //   console.log('//////////////////////////////');
    //   gutil.beep();
    //   browserSync.notify(err.message, 5000);
    //   stream.end();
    // })
    // .pipe(gulp.dest(destinations.js));
    // .pipe(reload({stream: true}))
// });