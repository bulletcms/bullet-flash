import gulp from 'gulp';
import gutil from 'gulp-util';

import del from 'del';

import size from 'gulp-size';

//SCSS//
import scss from 'gulp-sass';
import cleancss from 'gulp-clean-css';

//LOCAL SERVE//
import webserver from 'gulp-webserver';


const PATHS = {
  DIST: 'dist',
  TEST: 'serve',
  SCSSDIR: 'src/**',
  MAINSCSS: 'src/main.scss',
  INDEXHTML: 'test/**',
};


let scssbuild = ()=>{
  return gulp.src(PATHS.MAINSCSS)
    .pipe(scss({ style: 'compressed' }))
    .pipe(cleancss())
    .pipe(size())
    .pipe(gulp.dest(PATHS.DIST));
};
scssbuild.description = 'processes scss';
gulp.task(scssbuild);


let scsstest = ()=>{
  return gulp.src(PATHS.MAINSCSS)
    .pipe(scss({ style: 'compressed' }))
    .pipe(cleancss())
    .pipe(size())
    .pipe(gulp.dest(PATHS.TEST));
};
scsstest.description = 'test scss';
gulp.task(scsstest);


let htmltest = ()=>{
  return gulp.src(PATHS.INDEXHTML)
    .pipe(gulp.dest(PATHS.TEST));
};
htmltest.description = 'transfers html';
gulp.task(htmltest);


let watchtest = ()=>{
  gulp.watch(PATHS.SCSSDIR, (cb)=>{gulp.series('scsstest')(); cb();})
  gulp.watch(PATHS.INDEXHTML, (cb)=>{gulp.series('htmltest')(); cb();});
};
watchtest.description = 'watches css';
gulp.task(watchtest);


let clean = ()=>{
  return del([PATHS.DIST]);
};
clean.description = 'cleans dist';
gulp.task(clean);


let cleantest = ()=>{
  return del([PATHS.TEST]);
};
cleantest.description = 'cleans test';
gulp.task(cleantest);


let serve = (cb)=>{
  return gulp.src(PATHS.TEST)
    .pipe(webserver({
      livereload: true,
      port: 3030,
      fallback: 'index.html'
    }));
};
serve.description = 'serves ./serve on localhost:3030';
gulp.task(serve);


let build = ()=>{
  return gulp.series(
    'clean',
    'scssbuild'
  )();
};
build.description = 'builds scss';
gulp.task(build);


let buildtest = ()=>{
  return gulp.series(
    'cleantest',
    gulp.parallel('scsstest', 'htmltest'),
    'serve',
    'watchtest'
  )();
};
build.description = 'builds test app';
gulp.task(buildtest);


gulp.task('default', gulp.series('build'));
gulp.task('test', gulp.series('buildtest'));
