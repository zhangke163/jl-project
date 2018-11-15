/**
 layuiAdmin pro 构建
*/

var pkg = require('./package.json');
var inds = pkg.independents;

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var htmlmin = require("gulp-htmlmin");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var header = require('gulp-header');
var del = require('del');
var gulpif = require('gulp-if');
var minimist = require('minimist');

var babel = require("gulp-babel");
var connect = require('gulp-connect'); //首先需要在gukpfile.js中require这个插件，不要忘记了在项目中npm install






//获取参数
var argv = require('minimist')(process.argv.slice(2), {
        default: {
            ver: 'all'
        }
    })

    //注释
    ,
    note = [
        '/** <%= pkg.name %>-v<%= pkg.version %> <%= pkg.license %> License By <%= pkg.homepage %> */\n <%= js %>', {
            pkg: pkg,
            js: ';'
        }
    ]

    ,
    destDir = './dist' //构建的目标目录
    ,
    releaseDir = '../pack/layuiAdmin.pack/' + pkg.name + '-v' + pkg.version //发行版本目录

    //任务
    ,
    /*
 *任务处理完后加上.pipe(connect.reload()),为了热更新服务
 *
 */
    task = {
        //压缩 JS
        minjs: function () {
                var src = [
                    './src/**/*.js',
                    '!./src/config.js',
                    '!./src/lib/extend/echarts.js',
                    '!./src/lib/extend/leaflet.js',
                    '!./src/lib/extend/esri-leaflet.js',
                    '!./src/lib/extend/leaflet.hotline.js',
                    '!./src/lib/extend/wicket.js',
                    '!./src/lib/extend/leaflet-echarts.js',
                    '!./src/controller/DateTimeCalendar.js',
                ];

                return gulp.src(src).pipe(babel())
                    .pipe(header.apply(null, note))
                    .pipe(gulp.dest(destDir)).pipe(connect.reload());
            }

            //压缩 CSS
            ,
        mincss: function () {
                var src = [
                        './src/**/*.css'
                    ],
                    noteNew = JSON.parse(JSON.stringify(note));

                noteNew[1].js = '';

                return gulp.src(src).pipe(minify({
                        compatibility: 'ie7'
                    })).pipe(header.apply(null, noteNew))
                    .pipe(gulp.dest(destDir)).pipe(connect.reload());
            },

            //压缩html

        minhtml:function () {
                var src = [
                        './src/views/**/*'
                    ];
                return gulp.src(src).pipe(htmlmin({collapseWhitespace: true, minifyCSS:true, minifyJS:true}))
        .pipe(gulp.dest("dist/views/"))
        .pipe(connect.reload());
            }

            //复制文件夹
            ,
        mv: function () {
            gulp.src('./src/config.js')
                .pipe(gulp.dest(destDir));
            gulp.src('./src/lib/extend/echarts.js')
                .pipe(gulp.dest(destDir + '/lib/extend'));
            gulp.src('./src/lib/extend/leaflet.js')
                .pipe(gulp.dest(destDir + '/lib/extend'));
            gulp.src('./src/lib/extend/esri-leaflet.js')
                .pipe(gulp.dest(destDir + '/lib/extend'));
            gulp.src('./src/lib/extend/leaflet.hotline.js')
                .pipe(gulp.dest(destDir + '/lib/extend'));
            gulp.src('./src/lib/extend/wicket.js')
                .pipe(gulp.dest(destDir + '/lib/extend'));
            gulp.src('./src/lib/extend/leaflet-echarts.js')
                .pipe(gulp.dest(destDir + '/lib/extend'));
            gulp.src('./src/controller/DateTimeCalendar.js')
                .pipe(gulp.dest(destDir + '/controller'));
            gulp.src('./src/style/res/**/*')
                .pipe(gulp.dest(destDir + '/style/res'));
            gulp.src('./src/style/zTree/**/*')
                .pipe(gulp.dest(destDir + '/style/zTree'));
            gulp.src('./src/style/font-awesome/fonts/*')
                .pipe(gulp.dest(destDir + '/style/font-awesome/fonts'));
            return gulp.src('./src/style/leaflet/images/*')
                .pipe(gulp.dest(destDir + '/style/leaflet/images')).pipe(connect.reload());
        }
    };

//清理
gulp.task('clear', function (cb) {
    return del(['./dist/*'], cb);
});
gulp.task('clearRelease', function (cb) {
    return del(['./json/*', releaseDir], cb);
});

gulp.task('minjs', task.minjs);
gulp.task('mincss', task.mincss);
gulp.task('minhtml', task.minhtml);
gulp.task('mv', task.mv);

gulp.task('src', function () { //命令：gulp src
    return gulp.src('./dev-pro/**/*')
        .pipe(gulp.dest('./src'));
});
//这是gulp-connect插件的使用方法
// 启动服务器
gulp.task("server", function(){
    connect.server({
        port:8088,
        root : 'dist',
        livereload : true
    });
});
//用指定的task名称去监听指定的路径
gulp.task("watch", function(){
    gulp.watch("src/sass/**/*.css", ["mincss"]);
    gulp.watch("./src/**/*.js", ["minjs"]);
    gulp.watch(["./src/views/**/*.html"], ["minhtml"]);
    gulp.watch(["./src/views/**/*.html","./src/style/res/**/*","./src/config.js","./src/style/leaflet/images/*"], ["mv"]);
});

//构建核心源文件
gulp.task('default', ['clear', 'src',"server","watch"], function () { //命令：gulp
    for (var key in task) {
        task[key]();
    }
});

//发行 - layuiAdmin 官方使用
gulp.task('release', function () { //命令：gulp && gulp release

    //复制核心文件
    gulp.src('./dist/**/*')
        .pipe(gulp.dest(releaseDir + '/dist'));

    gulp.src('./src/**/*')
        .pipe(gulp.dest(releaseDir + '/src'));

    //复制 json
    gulp.src('./dev/json/**/*')
        .pipe(gulp.dest('./json'))
        .pipe(gulp.dest('./start/json'))
        .pipe(gulp.dest(releaseDir + '/start/json'));

    //复制并转义宿主页面
    gulp.src('./dev/index.html')
        .pipe(replace(/\<\!-- clear s --\>([\s\S]*?)\<\!-- clear e --\>/, ''))
        .pipe(replace('//local.res.layui.com/layui/src', 'layui'))
        .pipe(replace("base: '../dev-pro/'", "base: '../dist/'"))
        .pipe(replace('@@version@@', pkg.version))
        .pipe(gulp.dest('./start'))
        .pipe(gulp.dest(releaseDir + '/start'));

    //复制 gulpfile
    gulp.src([
        'gulpfile.js', 'package.json'
    ]).pipe(gulp.dest(releaseDir));

    //复制 layui
    return gulp.src('../../../../res/layui/rc/**/*')
        .pipe(gulp.dest('./start/layui'))
        .pipe(gulp.dest(releaseDir + '/start/layui'))
});