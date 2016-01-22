var gulp = require( 'gulp' );
var fileinclude = require("gulp-include-html");
var rename = require('gulp-rename');
var header = require('gulp-header');
//var clean = require('gulp-clean');
var aliasCombo = require('gulp-alias-combo');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var util= require( 'gulp-util' );
var spriter=require( 'gulp-css-spriter' );

var Version='2.0.5';
var buildDate = util.date(Date.now(), 'isoDate')+" "+util.date(Date.now(), 'isoTime');
var banner = '/*\n * Version:'+Version+'\n * Author:Junr \n * Updated:'+buildDate+'\n*/\n';



gulp.task('build-html' , function(){
    return gulp.src("./html/*.html")
        .pipe(fileinclude())
        .pipe(gulp.dest("./"))
});


gulp.task('css', function() {
    return gulp.src(['./css/base.css'])
        .pipe(spriter({
            // 生成的spriter的位置
            'spriteSheet': './images/sprite_bg.png',
            // 生成样式文件图片引用地址的路径 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../images/sprite_bg.png'
        }))
        //.pipe(minifyCss())
        .pipe(gulp.dest("./css"))
});

//监听文件变化
gulp.task('watch', function () {
    gulp.watch(["./html/*.html","./include/*.html"], ['build-html']);
    gulp.watch("./css/*.css", ['css']);
});

gulp.task('default', ['watch',]);
