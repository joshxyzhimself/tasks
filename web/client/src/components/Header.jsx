// @ts-check

import React from 'react';
import { assert } from 'modules/assert.mjs';
import { request } from 'modules/request.mjs';
import { SpinIcon } from './SpinIcon';
import { Link } from './Link';

// Checklist
// - [ ] /users endpoint for administrators and supervisors
// - [ ] mobile responsiveness

/**
 * @type {import('./Header').Header}
 */
export const Header = (props) => {
  const { history } = props;
  return (
    <div>
      <div className="fixed bg-white h-12 p-4 w-full flex flex-row justify-between items-center shadow">
        <div>
          <Link history={history} href="/">
            <div className="text-left text-base font-bold hover:underline">
              Tasks
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};