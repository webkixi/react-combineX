var gulp=require("gulp"),
  babel = require("gulp-babel"),
  es2015 = require("babel-preset-es2015"),
  stage0 = require('babel-preset-stage-0'),
  breact = require("babel-preset-react");

gulp.task("default",function(){
  gulp.src("./index.js")
    .pipe(babel({presets:[breact, es2015, stage0]}))//es6tojs的解析器
    .pipe(gulp.dest('./build'))
});
