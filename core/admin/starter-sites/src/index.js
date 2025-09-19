import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './Main';
import apiFetch from '@wordpress/api-fetch';

// Set up the REST API nonce for admin context
const apiNonce = window.maxiStarterSites?.apiNonce;
const apiRoot =
	window.maxiStarterSites?.apiRoot ||
	window.maxiBlocksMain?.apiRoot ||
	`${window.location.origin}/wp-json/`;

apiFetch.use(apiFetch.createNonceMiddleware(apiNonce));
apiFetch.use(apiFetch.createRootURLMiddleware(apiRoot));

const container = document.getElementById('maxi-starter-sites-root');
if (container) {
	const isQuickStart = document.querySelector('.maxi-quick-start-content')
		? true
		: false;
	const root = createRoot(container);
	root.render(<Main type='starter-sites' isQuickStart={isQuickStart} />);
}
