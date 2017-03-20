var gulp=require("gulp"),
  babel = require("gulp-babel"),
  es2015 = require("babel-preset-es2015"),
  breact = require("babel-preset-react");

gulp.task("default",function(){
  gulp.src("./index.js")
    .pipe(babel({presets:[breact, es2015]}))//es6tojs的解析器
    .pipe(gulp.dest('./build'))
});