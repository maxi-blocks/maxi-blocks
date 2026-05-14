/**
 * WordPress dependencies
 */
import {
	switchUserToAdmin,
	switchUserToTest,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { visitAdminPage, isCurrentURL } from './deactivatePlugin';

/**
 * Activates an installed plugin.
 * Uses data-plugin attribute instead of data-slug to avoid WP.org cache dependency.
 *
 * @param {string} slug Plugin slug (e.g. 'maxi-blocks').
 */
export default async function activatePlugin(slug) {
	await switchUserToAdmin();
	await visitAdminPage('plugins.php');

	const disableLink = await page.$(
		`tr[data-plugin^="${slug}/"] .deactivate a`
	);
	if (disableLink) {
		await switchUserToTest();
		return;
	}

	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
		page.click(`tr[data-plugin^="${slug}/"] .activate a`),
	]);

	if (!isCurrentURL('plugins.php')) {
		await visitAdminPage('plugins.php');
	}

	await page.waitForSelector(
		`tr[data-plugin^="${slug}/"] .deactivate a`,
		{ timeout: 60000 }
	);

	await switchUserToTest();
}
