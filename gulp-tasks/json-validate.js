//
// Uses (jsonlint)[https://github.com/zaach/jsonlint], the library that
// validates jsonlint.com to, well... validate JSON. This library provides
// details that V8's JSON.parse does not.
//

'use strict';

var
  gulp = require( 'gulp' ),
  jsonlint = require( 'gulp-jsonlint' );

gulp.task( 'lint-json', function() {
  var files = gulp.files( 'json' );

  return gulp.src( files )
    .pipe( jsonlint() )
    .pipe( jsonlint.reporter() );
} );