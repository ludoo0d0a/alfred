var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  livereload = require('gulp-livereload'),
  less = require('gulp-less'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename');

gulp.task('less', function () {
  gulp.src('./public/css/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.less', ['less']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js swig coffee',
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed(__dirname);
    }, 500);
  });
});

////https://github.com/thejameskyle/marionette-wires/blob/master/gulpfile.js
// function bundle(cb, watch) {
//   return bundler(watch).bundle()
//     .on('error', $.util.log)
//     .pipe(source('bundle.js'))
//     .pipe(buffer())
//     .pipe($.sourcemaps.init({ loadMaps: true }))
//     .pipe($.sourcemaps.write('./'))
//     .pipe(gulp.dest('./dist'))
//     .on('end', cb)
//     .pipe(reload({ stream: true }));
// }
// gulp.task('scripts', function(cb) {
//   process.env.BROWSERIFYSWAP_ENV = 'dist';
//   bundle(cb, true);
// });
// gulp.task('jshint', function() {
//   return gulp.src(['./src/**/*.js', './test/**/*.js'])
//     .pipe($.plumber())
//     .pipe($.jshint())
//     .pipe($.jshint.reporter(stylish));
// });



// Compiles LESS > CSS 
gulp.task('bootstrap:less', function(){
    return gulp.src('./public/components/bootstrap/less/bootstrap.less')
        .pipe(less())
        .pipe(cssmin().on('error', function(err) {
            console.log(err);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('standalone', [
  'less',
  'develop',
  'watch'
]);
