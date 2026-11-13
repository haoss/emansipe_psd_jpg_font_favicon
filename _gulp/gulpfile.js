'use strict';

import gulp from 'gulp';
import gulpif from 'gulp-if';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import tinypng from 'gulp-tinypng';
import { rimraf } from 'rimraf';
import rename from 'gulp-rename';
import wait from 'gulp-wait2';
import fs from 'fs';
import crypto from 'crypto';
import realFavicon from 'gulp-real-favicon';
import changed, { compareLastModifiedTime } from 'gulp-changed';

const sass = gulpSass(dartSass);

// Ключ активации для оптимизации 500 бесплатных картинок в месяц на сайте https://tinypng.com/
const TINYPNG_API = process.env.TINYPNG_API || 'GuAIy8BmW79-zVDoYRzRR_9eVe-QnhlN';

// Pug (инкрементальная компиляция через gulp-changed)
gulp.task('pug', () =>
  new Promise((resolve, reject) => {
    gulp.src(['_pug/*.pug', '!_pug/_include/**', '!_pug/_email/**'])
      .pipe(changed('dist', {
        extension: '.html',
        hasChanged: async (file, targetPath) => {
          if (/(?:^|[\\/])modals?\.pug$/i.test(file.path)) {
            return file;  // modals.pug всегда перекомпилировать
          }
          return compareLastModifiedTime(file, targetPath);
        }
      }))
      .pipe(plumber())
      .pipe(pug({ pretty: '    ' }))
      .pipe(gulp.dest('dist'))
      .on('end', resolve)
      .on('error', reject);
  })
);

// Pug (полная перекомпиляция всех верхнеуровневых страниц)
gulp.task('pug_all', () =>
  new Promise((resolve, reject) => {
    gulp.src(['_pug/*.pug', '!_pug/_include/**', '!_pug/_email/**'])
      .pipe(plumber())
      .pipe(pug({ pretty: '    ' }))
      .pipe(gulp.dest('dist'))
      .on('end', resolve)
      .on('error', reject);
  })
);

// SCSS → style.min.css (Level 2 CleanCSS + автохеширование в _head.pug)
gulp.task('scss', function () {
  const scssSource = fs.existsSync('_scss/main.scss')
    ? '_scss/main.scss'
    : (fs.existsSync('_sass/main.sass') ? '_sass/main.sass' : '_scss/main.scss');

  return gulp.src(scssSource)
    .pipe(wait(200))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      loadPaths: ['.'],
      silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
    }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({
      debug: true,
      level: {
        1: { specialComments: 0 },
        2: {
          mergeMedia: true,
          mergeAdjacentRules: true,
          removeDuplicateRules: true,
          removeDuplicateMediaBlocks: true
        }
      },
      compatibility: '*'
    }, (details) => {
      const orig = (details.stats.originalSize / 1024).toFixed(1);
      const min = (details.stats.minifiedSize / 1024).toFixed(1);
      console.log(`[clean-css] ${details.name}: ${orig}KB → ${min}KB (-${(details.stats.efficiency * 100).toFixed(0)}%)`);
    }))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('dist/css/'))
    .on('data', function (file) {
      if (file.path && file.path.endsWith('style.min.css') && file.contents) {
        const hash = crypto.createHash('md5').update(file.contents).digest('hex').slice(0, 10);
        const headFile = '_pug/_include/_head.pug';
        if (fs.existsSync(headFile)) {
          const content = fs.readFileSync(headFile, 'utf8');
          const updated = content.replace(
            /link\(rel=['"]stylesheet['"],\s*href=['"]\.\/css\/style\.min\.css(?:\?[^'"]*)?['"]\)/g,
            `link(rel='stylesheet', href='./css/style.min.css?v=${hash}')`
          );
          if (content !== updated) {
            fs.writeFileSync(headFile, updated, 'utf8');
            console.log(`[hash] _head.pug: обновлен хеш стилей (?v=${hash})`);
          }
        }
      }
    })
    .pipe(browserSync.stream());
});

// Tinypng
gulp.task('tiny', function () {
  return gulp.src('_tinypng/**/*.{png,jpg}')
    .pipe(tinypng(TINYPNG_API))
    .pipe(gulp.dest('dist/images/tinypng/'));
});

gulp.task('rimraf', function () {
  return rimraf('.gulp');
});

gulp.task('compress', gulp.series('tiny', 'rimraf'));

// Favicon tasks
const FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('favicon-1-generate', function (done) {
  realFavicon.generateFavicon({
    masterPicture: './_favicon/favicon.png',
    dest: './dist/favicon/',
    iconsPath: './favicon/',
    design: {
      ios: {
        pictureAspect: 'noChange'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#da532c',
        onConflict: 'override'
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          name: 'projectName',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override'
        }
      },
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 53.90625,
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function () {
    done();
  });
});

gulp.task('favicon-2-inject', function () {
  return gulp.src(['./dist/index.html'])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('favicon-3-check-for-update', function (done) {
  const currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
    done();
  });
});

// Watch
gulp.task('watch', () => {
  global.watch = true;

  // Отслеживаем только файлы верхнего уровня _pug/*.pug (исключаем _include и _email,
  // чтобы при правке инклюдов не пересобирались все 60+ страниц проекта)
  gulp.watch(['_pug/*.pug', '!_pug/_include/**', '!_pug/_email/**'], gulp.series('pug'));
  gulp.watch('dist/*.html').on('change', browserSync.reload);

  gulp.watch(['_scss/**/*.scss', '_sass/**/*.{sass,scss}'], gulp.series('scss'));
  gulp.watch('dist/js/*.js').on('change', browserSync.reload);
  gulp.watch('dist/css/*.css').on('change', browserSync.reload);
});

// Browser-sync
gulp.task('browser-sync', function () {
  browserSync.init({
    server: { baseDir: './' },
    notify: false
  });
});

// Default
gulp.task('default', gulp.parallel('browser-sync', 'watch'));
