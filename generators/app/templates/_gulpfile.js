/************************************************
 INCLUDE PLUGINS
 ************************************************/
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var streamify   = require('gulp-streamify');
var minifycss   = require('gulp-cssmin');
var notify      = require('gulp-notify');
var autoprefix  = require('gulp-autoprefixer');
var connect     = require('gulp-connect-php');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync');
var critical    = require('critical');
var reload      = browserSync.reload;


/************************************************
 PATH VARIABLES
 ************************************************/
var markupSrc       = './build/**/*.html';
var phpIni       = 'C:/Ampps/php-5.6/php.exe';
var phpExe       = 'C:/Ampps/php-5.6/php.ini';

var stylesSrc    = './src/scss/**/*.scss';
var stylesDest   = './build/css';

var scriptsSrc   = './src/js/scripts';
var scriptsDest  = './build/js';
var scriptsWatch = './src/js/**/*.js';

/************************************************
 SCSS(libsass) & CSS
 ************************************************/
gulp.task('styles', function() {
    gulp.src('./src/scss/main.scss')
        .pipe(sass({
            errLogToConsole: true,
            sourceComments: 'map',
            sourceMap: 'scss'
        }))
        .pipe(autoprefix("last 15 version"))
        .pipe(minifycss())
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest(stylesDest))
        .pipe(reload({stream: true}));
});

/************************************************
 JS
 ************************************************/
gulp.task('scripts', function() {
    return browserify(scriptsSrc, { debug: true })
        .bundle().on('error', handleError)
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest(scriptsDest))
        .pipe(notify('Scripts compiled!'));
});
// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['scripts'], browserSync.reload);


/************************************************
 PHP SERVER
 ************************************************/
gulp.task('server', function() {
    connect.server({
        bin: phpIni,
        ini: phpExe,
        base: './build'
    }, function (){
        browserSync({
            proxy: 'localhost:8000'
        });

        //Watch
        gulp.watch(stylesSrc, ['styles']);
        gulp.watch(markupSrc).on('change', reload);
        gulp.watch(scriptsWatch, ['js-watch']);
    });
});

/************************************************
 Error handler
 ************************************************/
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

/************************************************
 DEFAULT
 ************************************************/
gulp.task('default', ['server', 'styles', 'scripts']);


/************************************************
 Critical CSS
 ************************************************/
gulp.task('copystyles', function () {
    return gulp.src(['build/css/styles.min.css'])
        .pipe(rename({
            basename: "site" // site.css
        }))
        .pipe(gulp.dest('build/css/'));
});
