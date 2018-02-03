const fs = require('mz/fs');
const got = require('got');
const co = require('co');
const cheerio = require('cheerio');
const nunjucks = require('nunjucks');
// Set template default dir to `views`. To be used in `home` task.
nunjucks.configure('views', {
  noCache: true,
  watch: false,
  autoescape: false
});
// Promisify nunjucks render function.
function render(view, context) {
  return new Promise(function(resolve, reject) {
    nunjucks.render(view, context, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

const del = require('del');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const useref = require('gulp-useref');
const wiredep = require('wiredep').stream;

const browserSync = require('browser-sync').create();
const cssnext = require('postcss-cssnext');
const merge = require('merge-stream');
const source = require('vinyl-source-stream');
const lazypipe = require('lazypipe');
const sass = require('node-sass');




// Fetch latest content from home page, and update `app/index.html`
gulp.task('home', () => {
  const timeStamp = new Date().getTime();
  return co(function *() {
    const destDir = 'app';
  // check if `destDir` exitsts  
    try {
      yield fs.access(destDir, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
  // If not, create it.    
      yield fs.mkdir(destDir);
    }

    console.log(`fetching latest body from home page`);
    const latestBody = yield got(`http://www.ftchinese.com/m/corp/p0.html?${timeStamp}`)
      .then(response => {
  // Use cheerio to parse HTML and extract contents inside `<body>`      
        const $ = cheerio.load(response.body, {
          decodeEntities: true
        });      
        return $('body').html();
      });
      
  // Render `views/index.html` using the extracted body contents.
    const html = yield render('index.html', {body: latestBody});
  // Write rendered file to `.tmp/index.html`
    yield fs.writeFile(`${destDir}/index.html`, html, 'utf8');
    console.log(`Updated ${destDir}/index.html`);
  })
  .catch(err => {
    console.error(err.stack);
  });
})


gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'));
});
// Compile SCSS
gulp.task('styles', function () {
  const DEST = '.tmp/styles';

  return gulp.src(['app/styles/main*.scss'])
    .pipe($.changed(DEST)) 
    .pipe($.plumber()) 
    .pipe($.sourcemaps.init({loadMaps:true})) 
    .pipe($.sass({ 
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      cssnext({ 
        features: {
          colorRgba: false
        }
      })
    ]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream({match: '**/**/*.css'})); 
});


gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

// Build css and js.
gulp.task('html', gulp.series('styles', () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .on('error', (err) => {
      if (err instanceof GulpUglifyError) {
        console.log(err.fileName);
        console.log(err.cause);
        console.log(err.line);
      }
    })
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
}));



// Launch static server
gulp.task('serve', 
  gulp.parallel(
    'styles', 

    function serve() {
    browserSync.init({
      server: {
        baseDir: ['app', '.tmp'],
        index: 'EPRS.html',
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch('app/styles/**/*.scss', gulp.parallel('styles'));
    gulp.watch(['app/*.html', 'app/scripts/**/*.js', 'app/images/**/*'], browserSync.reload);
  })
);

// Is this one in use?
gulp.task('wiredep', function () {

  const scss = gulp.src('app/styles/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app/styles'));

  const html = gulp.src('app/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app'));

  return merge(scss, html);
});

gulp.task('clean', function() {
  return del(['.tmp/**', 'dist']).then(()=>{
    console.log('dir .tmp and dist deleted');
  });
});

gulp.task('build', gulp.parallel('jshint', 'html', 'images'/*'fonts', 'extras',*/ ));

// Various copy tasks.
gulp.task('copy:cssjs', () => {
  const staticDest = 'dev_www/frontend/static/n';
  const cssDest = 'dev_www/frontend/tpl/next/styles';
  const jsDest = 'dev_www/frontend/tpl/next/scripts';
  

  let cssStream = gulp.src(['dist/styles/*.css'])
    .pipe(gulp.dest(`../${staticDest}`))
    .pipe(gulp.dest(`../${cssDest}`))
    .pipe(gulp.dest(`../testing/${cssDest}`));


  let jsStream = gulp.src(['dist/scripts/*.js'])
    .pipe(gulp.dest(`../${staticDest}`))
    .pipe(gulp.dest(`../${jsDest}`))
    .pipe(gulp.dest(`../testing/${staticDest}`))
    .pipe(gulp.dest(`../testing/${jsDest}`));
  return merge(cssStream, jsStream);
});


gulp.task('copy:time', () => {
  const dest = 'dev_www/frontend/tpl/next/timestamp';
  const timeStamp = new Date().getTime();
// Create a virtual vinyl stream  
  const stream = source('timestamp.html');
// write date to the stream.  
  stream.end(timeStamp.toString());
// Use the steam with gulp.
  return stream
    .pipe(gulp.dest(`../${dest}`))
    .pipe(gulp.dest(`../testing/${dest}`));
});


gulp.task('copy:script', () => {
  const jsDest = 'Scripts/histogram';

  return gulp.src(['dist/scripts/*.js'])
    .pipe(gulp.dest(`../${jsDest}`))
    .pipe(gulp.dest(`../testing/${jsDest}`));
});



gulp.task('copy', gulp.series(
  'clean',
  'build', 
  gulp.parallel(
    'copy:cssjs',  
    'copy:time'
  )
));

