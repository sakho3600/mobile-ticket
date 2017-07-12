
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'aot/src/main-aot.js',
    dest: 'aot/dist/src/build.js', // output a single application bundle
    sourceMap: false,
    treeshake: true,
    format: 'iife',
    plugins: [
        nodeResolve({jsnext: true, module: true}),
      commonjs(),
      uglify()
    ],
    onwarn: function(warning) {
      // Skip certain warnings

      // should intercept ... but doesn't in some rollup versions
      if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }

      // console.warn everything else
      console.warn( warning.message );
    }
}