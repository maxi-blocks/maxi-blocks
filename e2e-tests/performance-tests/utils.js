/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { execSync } from 'child_process';
import { ITERATIONS, RESULTS_FILE_DIR } from './config';

/**
 * External dependencies
 */
import fs from 'fs';
import path from 'path';

export async function waitForBlocksLoad(page, maxWaitTime = 100000) {
	await page.waitForFunction(
		() => {
			const loader = document.querySelector(
				'.maxi-blocks-content-loader__bar'
			);
			return !loader || loader.offsetParent === null;
		},
		{ timeout: maxWaitTime }
	);
}

/**
 * Measure the time it takes to perform a single action.
 *
 * @param {Function} action
 * @returns {number} time in milliseconds
 */
export async function measureSingleAction(action) {
	const start = performance.now();
	await action();
	const end = performance.now();
	return end - start;
}

/**
 * Perform measurements for a set of events.
 *
 * @param {Object<string, {pre: Function, action: Function, post: Function}>} events
 * @param {number} iterations
 * @returns {Object<string, {times: number[], average: number}>} measurements
 */
export async function performMeasurements(events, iterations = ITERATIONS) {
	const results = Object.fromEntries(
		Object.keys(events).map(key => [key, { times: [] }])
	);

	for (let i = 0; i < iterations; i++) {
		await createNewPost();
		for (const [key, event] of Object.entries(events)) {
			if (event.pre) await event.pre();
			results[key].times.push(await measureSingleAction(event.action));
			if (event.post) await event.post();
		}
	}

	for (const key in results) {
		results[key].average =
			results[key].times.reduce((a, b) => a + b, 0) / iterations;
	}

	return results;
}

/**
 * Save the measurements for a single event.
 *
 * @param {string} key
 * @param {Object<string, {times: number[], average: number}>} measurements
 */
export function saveEventMeasurements(key, measurements) {
	const resultsFileName = getResultsFileName();
	const resultsFilePath = path.join(RESULTS_FILE_DIR, resultsFileName);

	let results = {};
	if (fs.existsSync(resultsFilePath)) {
		results = JSON.parse(fs.readFileSync(resultsFilePath, 'utf8'));
	}
	results[key] = measurements;
	fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
}

/**
 * Generate the results file name with the current branch
 */
export function getResultsFileName() {
	const hash = getCurrentHash();
	return `performance-results-${hash}.json`;
}

/**
 * Get the current git hash
 */
export function getCurrentHash() {
	try {
		return execSync('git rev-parse --short HEAD').toString().trim();
	} catch (error) {
		console.error('Error getting git hash:', error);
		return 'unknown';
	}
}

/**
 * Warmup runs to stabilize the environment.
 *
 * @param {Page} page
 */
export async function warmupRun(page) {
	for (let i = 0; i < 3; i++) {
		await createNewPost();
	}
}

/**
 * Returns callback, click on which will add block to the page
 *
 * @param {Page} page
 * @param {string} blockName
 * @returns {Promise<Function>} Callback to click on to insert block
 */
export async function prepareInsertMaxiBlock(page, blockName) {
	await page
		.$('.block-editor-default-block-appender__content')
		.then(el => el.focus());
	await page.keyboard.type(`/${blockName}`);
	return async () =>
		page.$('.components-autocomplete__result').then(el => el.click());
}
