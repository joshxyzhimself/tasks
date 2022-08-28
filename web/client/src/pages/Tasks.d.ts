import React from 'react'; 
import * as useHistory from 'modules/useHistory';
import { session } from '../../../server/sessions';

export interface task {
  name: string;
  completed: boolean;
  completed_date: string;
  depth: number;
}

export interface props {
  history: useHistory.history;
  session: session;
  set_session: React.Dispatch<session>;
}

export type Tasks = (props: props) => JSX.Element;
export const Tasks: Tasks;