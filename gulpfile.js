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
            // ���ɵ�spriter��λ��
            'spriteSheet': './images/sprite_bg.png',
            // ������ʽ�ļ�ͼƬ���õ�ַ��·�� ���½�������backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../images/sprite_bg.png'
        }))
        //.pipe(minifyCss())
        .pipe(gulp.dest("./css"))
});

//�����ļ��仯
gulp.task('watch', function () {
    gulp.watch(["./html/*.html","./include/*.html"], ['build-html']);
    gulp.watch("./css/*.css", ['css']);
});

gulp.task('default', ['watch',]);
