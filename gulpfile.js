var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');


gulp.task('default', function() {

});

gulp.task('compress', function() {
    gulp.src('dist/*.js')
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js']
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('scripts', function() {
  return gulp.src(['./js/libs/jquery-2.0.3.min.js',
      './js/libs/createjs-2013.12.12.min.js',
      './js/libs/howler.min.js',
      './js/libs/ctl_utils.js',
      './js/libs/sprite_lib.js',
      './js/settings.js',
      './js/CLang.js',
      './js/CPreloader.js',
      './js/CMain.js',
      './js/CTextButton.js',
      './js/CGfxButton.js',
      './js/CToggle.js',
      './js/CMenu.js',
      './js/CGame.js',
      './js/CCard.js',
      './js/CLevels.js',
      './js/CNextLevel.js',
      './js/CInterface.js',
      './js/CGameOver.js',
      './js/CCredits.js',
      './js/CVictory.js'
      ])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./dist/'));
});
