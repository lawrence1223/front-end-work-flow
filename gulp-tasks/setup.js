//
// This attempts to load all gulp tasks. If it fails, then will tell the user to
// run gulp install.
//

'use strict';

var
  gulp = require( 'gulp' ),
  gutil = require( './install' ),
  R, err,

  aggTasks = {};

// Attempt to load all the tasks.
try {
  require( 'require-dir' )( '.' );
  R = require( 'ramda' );
} catch ( e ) {
  err = e;

  gutil.log(
    gutil.colors.red(
      'FEW: Dependencies are not installed. Please run gulp install.\n'
    )
  );

}

// Grab the names of all the tasks before adding the workflows.
module.exports.tasks = Object.keys( gulp.tasks );

module.exports.defaults = {
  globals: { },
  esnext: false,
  root: './app/',
  angular: {
    enabled: false,
    module: 'app',
    root: '/'
  },
  files: {
    package: [ ],
    node: [ ],
    json: [ ],
    browser: [ ],
    css: [ ],
    html: [ ],
    'static': [ ],
    unit: [ ],
    libraries: { },
    devLibraries: { }
  },
  build: {
    directory: './dist/',
    js: 'app.js',
    css: 'style.css',
    header: [ '/**',
      ' * <%= pkg.name %> - <%= pkg.description %>',
      ' * @version v<%= pkg.version %>',
      ' * @license <%= pkg.license %>',
      ' */',
      ''
    ].join( '\n' ),
    cssAutoprefix: [ 'IE 8', '> 1%', 'last 2 versions' ]
  }
};

// Don't proceede if there was an error loading the required modules.
if( !err ) {

  //
  // Define all the aggregate tasks
  //

  // The standard development workflow
  aggTasks[ 'siren-sing' ] =  {
    dependencies: [ 'serve' ],
    watches: [
      {
        files: [ 'node' ],
        tasks: [ 'lint-node' ]
      }, {
        files: [ 'browser' ],
        tasks: [ 'lint-browser', 'unit-test' ]
      }, {
        files: [ 'json' ],
        tasks: [ 'lint-json' ]
      }, {
        files: [ 'html' ],
        tasks: [ 'lint-html' ]
      }, {
        files: [ 'unit' ],
        tasks: [ 'unit-test' ]
      }
    ]
  };

  // The "enhanced" development workflow
  aggTasks[ 'medusa-gaze' ] = R.cloneDeep( aggTasks[ 'siren-sing' ] );
  aggTasks[ 'medusa-gaze' ].watches[ 0 ].tasks.push( 'js-styles' );
  aggTasks[ 'medusa-gaze' ].watches[ 1 ].tasks.push( 'js-styles' );
  aggTasks[ 'medusa-gaze' ].watches[ 4 ].tasks.push( 'js-styles' );

  // The benchmark/E2E testing
  aggTasks[ 'manticore-sting' ] = function() {
    gutil.log(
      gutil.colors.red( 'FEW: manticore-sting is not yet implemented' )
    );
  };

  // The build task
  aggTasks[ 'cyclops-whack' ] = {
    dependencies: [ 'build-html' ]
  };

  // The deploy task
  aggTasks[ 'minotaur-charge' ] = function() {
    gutil.log(
      gutil.colors.red( 'FEW: minotaur-charge is not yet implemented' )
    );
  };

  // Expose all the aggregate tasks
  module.exports.aggTasks = Object.keys( aggTasks );

  // Add an accessor method that gets configuration values.
  module.exports.config = R.flip( R.path )( module.exports.defaults );

  // Add an accessor for getting all the files. This allows for the gulp tasks
  // to be split across multiple files effectively.
  module.exports.files = function( path ) {
    return ( R.path( 'defaults.files.' + path, module.exports ) || [] );
  };

  // Create all the aggregate tasks and "workflows"
  Object.keys( aggTasks ).forEach( function( taskName ) {
    var
      workflowConfig = aggTasks[ taskName ],
      dependencies = workflowConfig.dependencies || [],
      task = typeof workflowConfig === 'function' ?
        workflowConfig : function() {

          ( workflowConfig.watches || [] ).forEach( function( watch ) {
            var files =
              watch.files.map( module.exports.files ).reduce( R.concat );

            gulp.watch( files, watch.tasks );
          } );

        };

    gulp.task( taskName, dependencies, task );
  } );

}