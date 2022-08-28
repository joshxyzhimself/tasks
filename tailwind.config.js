
// @ts-check

const path = require('path');

const tailwind_config = {
  content: [],
  safelist: [
    { pattern: /(bg)-(emerald|rose)-(50|100|200|300|400|500|600|700|800|900)/ },
  ],
  variations: {
    extend: {
      textColor: ['disabled'],
      backgroundColor: ['disabled'],
    },
  },
};

const output_file_path = process.argv.find((x) => x.includes('--output=') === true);

if (typeof output_file_path === 'string') {
  const output_dir_path = path.dirname(output_file_path.replace('--output=', ''));
  const js_path = path.join(output_dir_path, '../../src/**/*.js');
  const jsx_path = path.join(output_dir_path, '../../src/**/*.jsx');
  tailwind_config.content.push(js_path, jsx_path);
}

module.exports = tailwind_config;