import React from 'react'; 

export interface task {
  name: string;
  completed: boolean;
  completed_date: string;
  depth: number;
}

export interface props {
  history: useHistory.history;
}

export type Tasks = (props: props) => JSX.Element;
export const Tasks: Tasks;