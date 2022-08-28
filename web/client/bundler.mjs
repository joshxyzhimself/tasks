#! /usr/bin/env node

// @ts-check

import fs from 'fs';
import url from 'url';
import path from 'path';
import child_process from 'child_process';
import { assert } from 'modules/assert.mjs';

const __filename = url.fileURLToPath(import.meta.url);
console.log({ __filename });

const __dirname = path.dirname(__filename);
console.log({ __dirname });

const __cwd = process.cwd();
console.log({ __cwd });

const process_args = process.argv;

const production = process_args.includes('--production');
console.log(`production: ${production}`);


/**
 * @param {string} command
 * @param {string[]} args
 * @returns {child_process.ChildProcess}
 */
const spawn = (command, args) => {
  assert(typeof command === 'string');
  assert(args instanceof Array);
  assert(args.every((arg) => typeof arg === 'string') === true);
  const spawned_process = child_process.spawn(command, args, { stdio: 'inherit' });
  spawned_process.on('error', (e) => {
    console.log({ command, event: 'error', error: e });
  });
  spawned_process.on('close', (code, signal) => {
    if (code > 0) {
      console.log({ command, event: 'close', code, signal });
    }
  });
  spawned_process.on('exit', (code, signal) => {
    if (code > 0) {
      console.log({ command, event: 'exit', code, signal });
    }
  });
  return spawned_process;
};

/**
 * @param {child_process.ChildProcess} process
 * @returns {Promise<void>}
 */
const process_close_event = (process) => new Promise((resolve, reject) => {
  process.on('close', (code) => {
    if (code === 0) {
      resolve();
      return;
    }
    reject(new Error(`process_close_event, code ${code}`));
  });
});

process.nextTick(async () => {
  try {

    // Favicon
    const favicon_source_path = path.join(__dirname, './src/favicon');
    const favicon_destination_path = path.join(__dirname, './dist/');
    if (fs.existsSync(favicon_destination_path) === false) {
      fs.mkdirSync(favicon_destination_path, { recursive: true });
    }
    if (fs.existsSync(favicon_source_path) === true) {
      const file_source_basenames = fs.readdirSync(favicon_source_path);
      file_source_basenames.forEach((file_source_basename) => {
        const file_source_path = path.join(favicon_source_path, file_source_basename);
        const file_destination_path = path.join(favicon_destination_path, file_source_basename);
        fs.copyFileSync(file_source_path, file_destination_path);
      });
    }

    const index_source_path = path.join(__dirname, './src/index.html');
    const index_destination_path = path.join(__dirname, './dist/index.html');
    fs.copyFileSync(index_source_path, index_destination_path);

    // ESBuild binary
    const esbuild_path = path.join(__cwd, `./node_modules/.bin/esbuild${process.platform === 'win32' ? '.cmd' : ''}`);
    assert(fs.existsSync(esbuild_path) === true);

    // PostCSS binary
    const postcss_path = path.join(__cwd, `./node_modules/.bin/postcss${process.platform === 'win32' ? '.cmd' : ''}`);
    assert(fs.existsSync(postcss_path) === true);

    // ESBuild entry
    const esbuild_entry_path = path.join(__dirname, './src/esbuild.jsx');
    assert(fs.existsSync(esbuild_entry_path) === true, 'Invalid ESBuild entry.');

    // PostCSS entry
    const postcss_entry_path = path.join(__dirname, './src/postcss.css');
    assert(fs.existsSync(postcss_entry_path) === true, 'Invalid PostCSS entry.');

    const esbuild_outfile = path.join(__dirname, './dist/esbuild/esbuild.js');
    const postcss_outfile = path.join(__dirname, './dist/postcss/postcss.css');

    if (production === true) {
      console.log('\n\n>> >> ESBuild..');
      await process_close_event(spawn(esbuild_path, [
        esbuild_entry_path,
        `--outfile=${esbuild_outfile}`,
        '--loader:.woff=file',
        '--loader:.woff2=file',
        '--asset-names=[name]',
        '--target=es6',
        '--sourcemap',
        '--bundle',
        '--minify',
      ]));
      console.log('\n\n>> >> PostCSS..');
      await process_close_event(spawn(postcss_path, [
        postcss_entry_path,
        `--output=${postcss_outfile}`,
        `--config=${__cwd}`,
        '--verbose',
        '--production',
      ]));
    } else {
      console.log('\n\n>> >> ESBuild..');
      spawn(esbuild_path, [
        esbuild_entry_path,
        `--outfile=${esbuild_outfile}`,
        '--loader:.woff=file',
        '--loader:.woff2=file',
        '--asset-names=[name]',
        '--target=es6',
        '--sourcemap',
        '--bundle',
        '--watch',
      ]);
      console.log('\n\n>> >> PostCSS..');
      spawn(postcss_path, [
        postcss_entry_path,
        `--output=${postcss_outfile}`,
        `--config=${__cwd}`,
        '--verbose',
        '--watch',
      ]);
    }
  } catch (e) {
    console.error(e);
  }
});
