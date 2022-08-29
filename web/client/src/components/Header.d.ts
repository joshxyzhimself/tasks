
import React from 'react';

export interface props {
  history: useHistory.history;
}

export type Header = (props: props) => JSX.Element;
export const Header: Header;