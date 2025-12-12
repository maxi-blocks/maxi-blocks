/**
 * WordPress dependencies
 */
import { activateTheme as wpActivateTheme } from '@wordpress/e2e-test-utils';

/**
 * Activates a theme with retry logic for CI environments.
 *
 * @param {string} slug Theme slug.
 */
export default async function activateTheme(slug) {
	const maxRetries = 3;
	let attempt = 1;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		try {
			// eslint-disable-next-line no-await-in-loop
			await wpActivateTheme(slug);
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
