const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.styles([
    'assets/css/app.css',
    'assets/css/daterangepicker.css',
    'assets/css/jquery-ui.css',
    'assets/css/quill.snow.css',
    'bundle.css',
    ], 'css/app.css')
    // .version()
    // .webpackConfig({
    //     output: {
    //         chunkFilename: 'js/[name].js'
    //     }
    // })
