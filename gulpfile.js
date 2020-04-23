const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const browserSync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");

const css = function() {
  return gulp
    .src("src/scss/style.scss")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "compressed"
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream({ match: "**/*.css" }));
};
const server = function(cb) {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    notify: false,
    open: true
  });

  cb();
};

const html = function(cb) {
  return gulp
    .src("src/html/**/*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    .pipe(gulp.dest("dist"));
};
const htmlReload = function(cb) {
  browserSync.reload();
  cb();
};
const watch = function() {
  gulp.watch("src/scss/**/*.scss", { usePolling: true }, gulp.series(css));
  gulp.watch(
    "src/html/**/*.html",
    { usePolling: true },
    gulp.series(html, htmlReload)
  );
};

exports.default = gulp.series(html, css, server, watch);
exports.css = css;
exports.watch = watch;
exports.html = html;
