
// @ts-check

const postcss_import = require('postcss-import');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const postcss_config = {
  plugins: [postcss_import, tailwindcss, autoprefixer],
};

if (process.argv.includes('--production') === true) {
  // @ts-ignore
  postcss_config.plugins.push(cssnano);
}

module.exports = postcss_config;