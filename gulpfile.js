var gulp=require("gulp"),
  pump = require('pump'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  babel = require("gulp-babel"),
  es2015 = require("babel-preset-es2015"),
  stage0 = require('babel-preset-stage-0'),
  breact = require("babel-preset-react");

gulp.task("default",function(){
  pump([
      gulp.src("./index.js"),
      sourcemaps.init(),
      babel({presets:[breact, es2015, stage0]}),
      uglify(),
      sourcemaps.write('./maps'),
      gulp.dest('./build')
    ]
  );
});
