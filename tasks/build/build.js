'use strict';

var pathUtil = require('path');
var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var babel = require('gulp-babel');

var utils = require('../utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function () {
    return destDir.dirAsync('.', { empty: true });
});


var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
            overwrite: true,
            matching: [
                'node_modules/**',
                'data/**',
                './**/*.+(html|jpg|png|svg)',
            ]
        });
};
gulp.task('copy', ['clean'], copyTask);
gulp.task('copy-watch', copyTask);

var bundleTask = function () {
    return gulp.src(['app/**/*.js', '!app/{node_modules,node_modules/**}'])
        .pipe(babel())
        .pipe(gulp.dest('build'));
};

gulp.task('bundle', ['clean'], bundleTask);
gulp.task('bundle-watch', bundleTask);

gulp.task('finalize', ['clean', 'copy'], function () {
    var manifest = srcDir.read('package.json', 'json');

    // Add "dev" or "test" suffix to name, so Electron will write all data
    // like cookies and localStorage in separate places for each environment.
    switch (utils.getEnvName()) {
        case 'development':
            manifest.name += '-dev';
            manifest.productName += ' Dev';
            break;
        case 'test':
            manifest.name += '-test';
            manifest.productName += ' Test';
            break;
    }

    // Copy environment variables to package.json file for easy use
    // in the running application. This is not official way of doing
    // things, but also isn't prohibited ;)
    manifest.env = projectDir.read('config/env_' + utils.getEnvName() + '.json', 'json');

    destDir.write('package.json', manifest);
});


gulp.task('watch', function () {
    watch('app/**/*.js', batch(function (events, done) {
        gulp.start('bundle-watch', done);
    }));
    watch('./node_modules/**', { cwd: 'app' }, batch(function (events, done) {
        gulp.start('copy-watch', done);
    }));
});


gulp.task('build', ['bundle', 'copy', 'finalize']);
