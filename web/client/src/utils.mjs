// @ts-check

import { assert } from 'modules/assert.mjs';

/**
 * @param {string} value
 * @returns {string}
 */
export const snake_case_to_upper_case = (value) => {
  return value.replace(/_/g, ' ').toUpperCase();
};

export const create_random_id = () => Array.from(window.crypto.getRandomValues(new Uint8Array(32))).map((x) => x.toString(16).padStart(2, '0')).join('');