/**
 * External dependencies
 */
import { get } from 'lodash';
import dotenv from 'dotenv';

/**
 * WordPress dependencies
 */
import {
	enablePageDialogAccept,
	isOfflineMode,
	setBrowserViewport,
	activatePlugin,
	activateTheme,
	setOption,
	visitAdminPage,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { deactivatePlugin } from './utils';

/**
 * Disable debounce for tests.
 */
const _ = require('lodash');

_.debounce = func => func;

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Timeout, in seconds, that the test should be allowed to run.
 *
 * @type {string|undefined}
 */
const { PUPPETEER_TIMEOUT } = process.env;

/**
 * Set of console logging types observed to protect against unexpected yet
 * handled (i.e. not catastrophic) errors or warnings. Each key corresponds
 * to the Puppeteer ConsoleMessage type, its value the corresponding function
 * on the console global object.
 *
 * @type {Object<string,string>}
 */
const OBSERVED_CONSOLE_MESSAGE_TYPES = {
	warning: 'warn',
	error: 'error',
};

// The Jest timeout is increased because these tests are a bit slow
jest.setTimeout(PUPPETEER_TIMEOUT || 100000);

async function setupBrowser() {
	// Disable console logging during setup
	const originalConsoleLog = console.log;
	const originalConsoleError = console.error;
	console.log = () => {};
	console.error = () => {};

	try {
		await setBrowserViewport({ width: 1920, height: 700 });

		// Skip external network checks in test environment
		if (process.env.CI) {
			// Only do network checks in CI environment
			const testUrls = [
				'https://wordpress.org',
				'https://api.wordpress.org',
				'https://google.com',
				'https://github.com',
			];

			let connected = false;
			for (const url of testUrls) {
				try {
					await page.goto(url, {
						waitUntil: 'networkidle0',
						timeout: 10000,
					});
					connected = true;
					break;
				} catch (e) {
					continue;
				}
			}

			if (!connected) {
				throw new Error('Could not establish network connectivity');
			}
		}
	} catch (error) {
		throw error;
	} finally {
		// Restore console functions
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	}
}

/**
 * Adds a page event handler to emit uncaught exception to process if one of
 * the observed console logging types is encountered.
 */
function observeConsoleLogging() {
	page.on('console', message => {
		const type = message.type();
		if (
			!Object.prototype.hasOwnProperty.call(
				OBSERVED_CONSOLE_MESSAGE_TYPES,
				type
			)
		) {
			return;
		}

		let text = message.text();

		// Add ERR_CONNECTION_REFUSED to ignored errors
		if (
			text.includes('net::ERR_CONNECTION_REFUSED') ||
			text.includes(
				'Failed to load resource: net::ERR_CONNECTION_REFUSED'
			)
		) {
			return;
		}

		// wp-bootstrap-block exceptions for WordPress 5.2
		if (
			text.startsWith(
				'Warning: Unsafe lifecycle methods were found within a strict-mode tree'
			)
		) {
			return;
		}
		if (text.startsWith('Warning: %s is deprecated in StrictMode.')) {
			return;
		}

		// wp-bootstrap-block exceptions for WordPress 5.3
		if (
			text.includes(
				'RichText formattingControls prop is deprecated. Please use allowedFormats instead.'
			)
		) {
			return;
		}

		// wp-bootstrap-block exceptions for WordPress 5.4
		if (
			text.includes(
				'wp.components.IconButton is deprecated. Please use wp.components.Button instead.'
			)
		) {
			return;
		}

		// An exception is made for _blanket_ deprecation warnings: Those
		// which log regardless of whether a deprecated feature is in use.
		if (text.includes('This is a global warning')) {
			return;
		}

		// A chrome advisory warning about SameSite cookies is informational
		// about future changes, tracked separately for improvement in core.
		//
		// See: https://core.trac.wordpress.org/ticket/37000
		// See: https://www.chromestatus.com/feature/5088147346030592
		// See: https://www.chromestatus.com/feature/5633521622188032
		if (text.includes('A cookie associated with a cross-site resource')) {
			return;
		}

		// Viewing posts on the front end can result in this error, which
		// has nothing to do with Gutenberg.
		if (text.includes('net::ERR_UNKNOWN_URL_SCHEME')) {
			return;
		}

		// Network errors are ignored only if we are intentionally testing
		// offline mode.
		if (
			text.includes('net::ERR_INTERNET_DISCONNECTED') &&
			isOfflineMode()
		) {
			return;
		}

		// As of WordPress 5.3.2 in Chrome 79, navigating to the block editor
		// (Posts > Add New) will display a console warning about
		// non - unique IDs.
		// See: https://core.trac.wordpress.org/ticket/23165
		if (text.includes('elements with non-unique id #_wpnonce')) {
			return;
		}

		// Sometimes, while loading video URLS, we've got CORS errors.
		if (text.includes('has been blocked by CORS policy')) {
			return;
		}

		// Youtube API returns random errors sometimes
		if (text.includes('The YouTube player is not attached to the DOM')) {
			return;
		}

		// Video headers fails sometimes
		if (text.includes('Error with Permissions-Policy header')) {
			return;
		}

		// CustomCSS validator returns connection errors sometimes
		if (text.includes('Error validating css: TypeError: Failed to fetch')) {
			return;
		}
		if (text.includes('Failed to load resource: net::ERR_FAILED')) {
			return;
		}
		if (
			text.includes(
				'Error validating css: Error: The request took longer than'
			)
		) {
			return;
		}
		if (text.includes('Failed to load resource: the server responded')) {
			return;
		}
		if (text.includes('Error validating css: BadStatusError')) {
			return;
		}
		if (text.includes('Refused to connect to')) {
			return;
		}
		if (
			text.includes(
				'WebSocket is closed before the connection is established'
			)
		) {
			return;
		}
		if (text.includes('Error during WebSocket handshake')) {
			return;
		}

		// Since 6.1 multiline on RichText is deprecated. Need to be update on #3877
		if (
			text.includes(
				'wp.blockEditor.RichText multiline prop is deprecated'
			)
		) {
			return;
		}

		// Handle JSHandle objects more gracefully
		if (typeof text === 'object' && text._remoteObject) {
			text = text._remoteObject.description || text.toString();
		}

		text = get(message.args(), [0, '_remoteObject', 'description'], text);

		// Skip if the text is still a JSHandle reference
		if (text.includes('JSHandle@')) {
			return;
		}

		// Only log errors that aren't explicitly ignored
		const logFunction = OBSERVED_CONSOLE_MESSAGE_TYPES[type];
		if (process.env.DEBUG) {
			console[logFunction](text);
		}
	});
}

// Before every test suite run, delete all content created by the test. This ensures
// other posts/comments/etc. aren't dirtying tests and tests don't depend on
// each other's side-effects.
beforeAll(async () => {
	console.log('Starting test setup...');
	try {
		enablePageDialogAccept();
		observeConsoleLogging();

		await setupBrowser();
		console.log('Browser setup successful');

		console.log('Deactivating plugin...');
		await deactivatePlugin('maxi-blocks');
		console.log('Activating plugin...');
		await activatePlugin('maxi-blocks');

		console.log('Navigating to quick start...');
		await visitAdminPage(
			'admin.php',
			'page=maxi-blocks-quick-start&step=finish'
		);

		console.log('Waiting for selector...');
		await page.waitForSelector(
			'.maxi-quick-start-actions button[data-action="complete"]',
			{ timeout: 30000 }
		);

		console.log('Clicking complete...');
		await page.click(
			'.maxi-quick-start-actions button[data-action="complete"]'
		);

		console.log('Waiting for completion...');
		await page.waitForTimeout(1000);

		console.log('Activating theme...');
		await activateTheme('twentytwentyone');

		console.log('Test setup complete');
	} catch (error) {
		console.log('Test setup failed:', error.message);
		console.log('Full error:', error);
		throw error;
	}
});

afterEach(async () => {
	await setupBrowser();
});
