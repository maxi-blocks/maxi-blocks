/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { execSync } from 'child_process';
import { ITERATIONS, RESULTS_FILE_DIR, WARMUP_ITERATIONS } from './config';

/**
 * External dependencies
 */
import fs from 'fs';
import path from 'path';
import { Client } from 'typesense';

export async function waitForBlocksLoad(
	page,
	expectedBlocksCount,
	maxWaitTime = 30000
) {
	await page.waitForFunction(
		expectedCount => {
			const blocks = document.querySelectorAll('.maxi-block');
			const loader = document.querySelector(
				'.maxi-blocks-content-loader__bar'
			);
			const editor = document.querySelector(
				'.block-editor-block-list__layout'
			);
			return (
				(!loader || loader.offsetParent === null) &&
				editor !== null &&
				blocks.length >= expectedCount
			);
		},
		{ timeout: maxWaitTime },
		expectedBlocksCount
	);
}

/**
 * Measure the time it takes to perform a single action.
 *
 * @param {Function} action
 * @param {any} context
 * @returns {Object<string, any>} { time: number, context: Any }
 */
export async function measureSingleAction(action, context) {
	const start = performance.now();
	const newContext = await action(context);
	const end = performance.now();
	return { time: end - start, context: newContext };
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
		let context = {};
		for (const [key, event] of Object.entries(events)) {
			try {
				if (event.pre) {
					context = await event.pre(context);
				}
				const { time, context: newContext } = await measureSingleAction(
					event.action,
					context
				);
				results[key].times.push(time);
				context = newContext;
				if (event.post) {
					context = await event.post(context);
				}
			} catch (error) {
				console.error(`Error in test for event ${key}:`, error);
				throw error;
			}
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
	try {
		fs.mkdirSync(RESULTS_FILE_DIR, { recursive: true });
		if (fs.existsSync(resultsFilePath)) {
			results = JSON.parse(fs.readFileSync(resultsFilePath, 'utf8'));
		}
		results[key] = measurements;
		fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
	} catch (error) {
		console.error('Error saving measurements:', error);
	}
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
 */
export async function warmupRun() {
	for (let i = 0; i < WARMUP_ITERATIONS; i++) {
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
	const block = await page.waitForSelector(
		'.block-editor-default-block-appender__content',
		{ visible: true }
	);
	await page.evaluate(block => {
		block.focus();
	}, block);
	await page.keyboard.type(`/${blockName}`);
	return async () => {
		const block = await page.waitForSelector(
			'.components-autocomplete__result',
			{ visible: true }
		);
		await page.evaluate(block => {
			block.click();
		}, block);
	};
}

export class PatternManager {
	constructor(page) {
		this.page = page;
		this.searchClient = this.createSearchClient();
	}

	async searchPatternByName(patternName) {
		const searchParameters = {
			q: patternName,
			query_by: 'post_title',
			filter_by: 'gutenberg_type:=Patterns',
			sort_by: '_text_match:desc',
			per_page: 1,
		};

		try {
			const searchResults = await this.searchClient
				.collections('post')
				.documents()
				.search(searchParameters);

			if (searchResults.hits.length > 0) {
				return searchResults.hits[0].document;
			}
			return null;
		} catch (error) {
			console.error('Error searching for pattern:', error);
			return null;
		}
	}

	async getPatternCodeEditor(patternName) {
		const pattern = await this.searchPatternByName(patternName);
		if (pattern) {
			console.log(`Pattern found: ${pattern.post_title}`);
			return pattern.gutenberg_code;
		} else {
			console.log(`Pattern not found: ${patternName}`);
		}
	}

	createSearchClient() {
		return new Client({
			nodes: [
				{
					host: process.env.REACT_APP_TYPESENSE_API_URL,
					port: '443',
					protocol: 'https',
				},
			],
			apiKey: process.env.REACT_APP_TYPESENSE_API_KEY,
		});
	}
}
