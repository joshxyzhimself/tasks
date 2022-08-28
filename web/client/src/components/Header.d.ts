
import React from 'react';
import * as useHistory from 'modules/useHistory';
import { session } from '../../../server/sessions';

export interface props {
  history: useHistory.history;
  session: session;
  set_session: React.Dispatch<session>;
}

export type Header = (props: props) => JSX.Element;
export const Header: Header;