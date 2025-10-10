/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * External dependencies
 */
import { join } from 'path';

export const WP_BASE_URL = 'http://localhost:8889';

/**
 * Creates new URL by parsing base URL, WPPath and query string.
 *
 * @param {string}  WPPath String to be serialized as pathname.
 * @param {?string} query  String to be serialized as query portion of URL.
 * @return {string} String which represents full URL.
 */
export function createURL(WPPath, query = '') {
	const url = new URL(WP_BASE_URL);

	url.pathname = join(url.pathname, WPPath);
	url.search = query;

	return url.href;
}

/**
 * Checks if current URL is a WordPress path.
 *
 * @param {string}  WPPath String to be serialized as pathname.
 * @param {?string} query  String to be serialized as query portion of URL.
 * @return {boolean} Boolean represents whether current URL is or not a WordPress path.
 */
export function isCurrentURL(WPPath, query = '') {
	const currentURL = new URL(page.url());

	currentURL.search = query;

	return createURL(WPPath, query) === currentURL.href;
}

/**
 * Performs log in with specified username and password.
 *
 * @param {?string} username String to be used as user credential.
 * @param {?string} password String to be used as user credential.
 */
export async function loginUser(username = 'admin', password = 'password') {
	if (!isCurrentURL('wp-login.php')) {
		await page.goto(createURL('wp-login.php'));
	}

	await page.focus('#user_login');
	await pressKeyWithModifier('primary', 'a');
	await page.type('#user_login', username);
	await page.focus('#user_pass');
	await pressKeyWithModifier('primary', 'a');
	await page.type('#user_pass', password);

	await Promise.all([page.waitForNavigation(), page.click('#wp-submit')]);
}

/**
 * Visits admin page; if user is not logged in then it logging in it first, then visits admin page.
 *
 * @param {string} adminPath String to be serialized as pathname.
 * @param {string} query     String to be serialized as query portion of URL.
 */
export async function visitAdminPage(adminPath, query) {
	await page.goto(createURL(join('wp-admin', adminPath), query));

	// Handle upgrade required screen.
	if (isCurrentURL('wp-admin/upgrade.php')) {
		// Click update.
		await page.click('.button.button-large.button-primary');
		// Click continue.
		await page.click('.button.button-large');
	}

	if (isCurrentURL('wp-login.php')) {
		await loginUser();
		await visitAdminPage(adminPath, query);
	}
}

/**
 * Get the username of the user that's currently logged into WordPress (if any).
 *
 * @return {string?} username The user that's currently logged into WordPress (if any).
 */
export async function getCurrentUser() {
	const cookies = await page.cookies();
	const cookie = cookies.find(
		c => !!c?.name?.startsWith('wordpress_logged_in_')
	);

	if (!cookie?.value) {
		return null;
	}
	return decodeURIComponent(cookie.value).split('|')[0];
}

/**
 * Deactivates an active plugin with retry logic for CI environments.
 *
 * @param {string} slug Plugin slug.
 */
export default async function deactivatePlugin(slug) {
	const maxRetries = 3;
	let attempt = 1;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		try {
			// eslint-disable-next-line no-await-in-loop
			await visitAdminPage('plugins.php');
			// eslint-disable-next-line no-await-in-loop
			const deleteLink = await page.$(
				`tr[data-slug="${slug}"] .delete a`
			);
			if (deleteLink) {
				return;
			}
			// eslint-disable-next-line no-await-in-loop
			await page.waitForSelector(
				`tr[data-slug="${slug}"] .deactivate a`,
				{
					timeout: 30000,
				}
			);
			// eslint-disable-next-line no-await-in-loop
			await page.click(`tr[data-slug="${slug}"] .deactivate a`);
			// eslint-disable-next-line no-await-in-loop
			await page.waitForSelector(`tr[data-slug="${slug}"] .delete a`, {
				timeout: 30000,
			});
			break; // Success, exit retry loop
		} catch (error) {
			if (attempt === maxRetries) {
				throw error; // Final attempt failed, throw error
			}
			// eslint-disable-next-line no-await-in-loop
			await new Promise(resolve => {
				setTimeout(resolve, 2000);
			}); // Wait 2s before retry
			attempt += 1;
		}
	}
}
