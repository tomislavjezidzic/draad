'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require("gulp-rename");

gulp.task('babelize', () =>
    gulp.src('./src/Draad.js')
        .pipe(babel({presets: ['env']}))
        .pipe(gulp.dest('./dist'))
);

gulp.task('uglify', () =>
    gulp.src('./dist/Draad.js')
        .pipe(uglify())
        .pipe(rename('Draad.min.js'))
        .pipe(gulp.dest('./dist'))
);

gulp.task('buildJS', ['babelize', 'uglify']);