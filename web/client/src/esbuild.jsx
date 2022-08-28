
// @ts-check

/**
 * @typedef {import('modules/useHistory').history} history
 * @typedef {import('../../server/sessions').session} session
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { useHistory } from 'modules/useHistory.mjs';

import { Static403 } from './pages/Static403';
import { Static404 } from './pages/Static404';
import { Header } from './components/Header';
import { Tasks } from './pages/Tasks';

import '@fontsource/inter/100.css';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';

/**
  * @param {history} history
  * @param {session} session
  * @param {React.Dispatch<session>} set_session
  */
const get_content = (history, session, set_session) => {
  switch (location.pathname) {
    case '/': {
      return (<Tasks history={history} session={session} set_session={set_session} />);
    }
    default: {
      return (<Static404 />);
    }
  }
};


const Client = () => {

  const history = useHistory();

  // @ts-expect-error
  const initial_session = window?.session || null;

  /**
   * @type {[session, React.Dispatch<session>]}
   */
  const [session, set_session] = React.useState(initial_session);

  const content = get_content(history, session, set_session);

  return (
    <div>
      <Header history={history} session={session} set_session={set_session} />
      <div className="py-12">
        { content }
      </div>
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Client />);