// @ts-check

import React from 'react';

/**
 * @type {import('./Link').Link}
 */
export const Link = (props) => {
  const { className, children, history, target, href } = props;
  const inferred_target = target || '_self';
  return (
    <a
      className={className || ''}
      target={inferred_target}
      href={href}
      onClick={(e) => {
        if (href.substring(0, 1) === '/') {
          switch (inferred_target) {
            case '_self': {
              e.preventDefault();
              history.push(href);
              break;
            }
            default: {
              break;
            }
          }
        }
      }}
      tabIndex={-1}
      rel="noreferrer noopener"
    >
      { children }
    </a>
  );
};