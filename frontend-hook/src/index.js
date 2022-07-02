import { AppMain } from './components/AppMain.js';
import React from 'react';
import './styles/styles.scss';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');

const root = createRoot(container);
root.render(<AppMain />);
