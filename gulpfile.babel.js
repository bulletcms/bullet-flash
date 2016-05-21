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
  DISTDIR: 'dist/**',
  SCSSDIR: 'src/**',
  MAINSCSS: 'src/main.scss',
  INDEXHTML: 'test/index.html',
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


let htmlbuild = ()=>{
  return gulp.src(PATHS.INDEXHTML)
    .pipe(gulp.dest(PATHS.DIST));
};
htmlbuild.description = 'transfers html';
gulp.task(htmlbuild);


let watch = ()=>{
  gulp.watch(PATHS.SCSSDIR, (cb)=>{gulp.series('scssbuild')(); cb();})
  gulp.watch(PATHS.INDEXHTML, (cb)=>{gulp.series('htmlbuild')(); cb();});
};
watch.description = 'watches css';
gulp.task(watch);


let clean = ()=>{
  return del([PATHS.DIST]);
};
clean.description = 'cleans dist';
gulp.task(clean);


let serve = (cb)=>{
  return gulp.src(PATHS.DIST)
    .pipe(webserver({
      livereload: true,
      port: 3030,
      fallback: 'index.html'
    }));
};
serve.description = 'serves ./dist on localhost:3030';
gulp.task(serve);


let build = ()=>{
  return gulp.series(
    'clean',
    gulp.parallel('scssbuild', 'htmlbuild'),
    'serve',
    'watch'
  )();
};
build.description = 'builds test app';
gulp.task(build);


gulp.task('default', gulp.series('build'));
