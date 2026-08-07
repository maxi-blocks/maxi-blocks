/**
 * External dependencies
 */
import { request } from '@playwright/test';

/**
 * WordPress dependencies
 */
import { RequestUtils } from '@wordpress/e2e-test-utils-playwright';

async function globalSetup(config) {
	const { storageState, baseURL } = config.projects[0].use;
	const storageStatePath =
		typeof storageState === 'string' ? storageState : undefined;

	const requestContext = await request.newContext({
		baseURL,
	});

	const requestUtils = new RequestUtils(requestContext, {
		storageStatePath,
	});
	const login = requestUtils.login;
	requestUtils.login = async (...args) => {
		const nonce = (await login(...args)).trim();

		if (!/^[a-f0-9]{10}$/i.test(nonce)) {
			throw new Error('WordPress returned an invalid REST API nonce.');
		}

		return nonce;
	};

	// Authenticate and save the storageState to disk.
	await requestUtils.setupRest();

	// Reset the test environment before running the tests.
	await Promise.all([
		requestUtils.activateTheme('twentytwentyone'),
		requestUtils.activatePlugin('maxiblocks'),
		requestUtils.deleteAllPosts(),
		requestUtils.deleteAllBlocks(),
		requestUtils.resetPreferences(),
	]);

	await requestContext.dispose();
}

export default globalSetup;
