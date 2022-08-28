import * as React from 'react';
import { history } from 'modules/useHistory';

export interface props {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  history: history;
  target?: string;
  href: string;
}

export type Link = (props: props) => JSX.Element;
export const Link: Link;