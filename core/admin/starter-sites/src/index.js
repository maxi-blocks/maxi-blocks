import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './Main';

const container = document.getElementById('maxi-starter-sites-root');
if (container) {
    const root = createRoot(container);
    root.render(<Main type='patterns' />);
}
