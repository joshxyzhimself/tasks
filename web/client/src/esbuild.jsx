
// @ts-check

/**
 * @typedef {import('modules/useHistory').history} history
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

const Client = () => {

  const history = useHistory();

  return (
    <div>
      <Header history={history} />
      <div className="py-12">
        <Tasks history={history} />
      </div>
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Client />);