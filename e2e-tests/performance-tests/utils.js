/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	BLOCKS_LOAD_TIMEOUT,
	ITERATIONS,
	RESULTS_FILE_DIR,
	RESULTS_FILE_NAME,
	WARMUP_ITERATIONS,
} from './config';

/**
 * External dependencies
 */
import fs from 'fs';
import path from 'path';
import { Client } from 'typesense';

const DEBUG = process.env.DEBUG_PERF_TESTS === 'true';

export function debugLog(...args) {
	if (DEBUG) {
		console.debug(...args);
	}
}

/**
 * Wait for the blocks to load.
 *
 * @param {Page} page
 * @param {number} expectedBlocksCount
 * @param {number} maxWaitTime
 */
export async function waitForBlocksLoad(page, expectedBlocksCount) {
	debugLog(`Waiting for ${expectedBlocksCount} blocks to load...`);
	try {
		await page.waitForFunction(
			expectedCount => {
				const editor = document.querySelector(
					'.block-editor-block-list__layout'
				);
				if (!editor) {
					console.log('Editor not found');
					return false;
				}
				const blocks = editor.querySelectorAll('.maxi-block');
				const loader = editor.querySelector(
					'.maxi-blocks-content-loader__bar'
				);

				return (
					(!loader || loader.offsetParent === null) &&
					blocks.length >= expectedCount
				);
			},
			{ timeout: BLOCKS_LOAD_TIMEOUT },
			expectedBlocksCount
		);
		debugLog('Blocks loaded successfully');
	} catch (error) {
		const blocks = await page.evaluate(() => {
			const editor = document.querySelector(
				'.block-editor-block-list__layout'
			);
			if (!editor) return 'Editor not found';
			const blocks = editor.querySelectorAll('.maxi-block');
			return blocks.length;
		});
		console.error(
			`Timeout waiting for ${expectedBlocksCount} blocks to load, actual count: ${blocks}`
		);
		console.error(error);
		throw error;
	}
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
		debugLog(`Starting iteration ${i + 1} of ${iterations}`);
		await createNewPost();
		let context = {};
		for (const [key, event] of Object.entries(events)) {
			try {
				if (event.pre) {
					debugLog(`Pre-action for ${key}`);
					context = await event.pre(context);
				}
				debugLog(`Measuring action for ${key}`);
				const { time, context: newContext } = await measureSingleAction(
					event.action,
					context
				);
				results[key].times.push(time);
				context = newContext;
				if (event.post) {
					debugLog(`Post-action for ${key}`);
					context = await event.post(context);
				}
			} catch (error) {
				console.error(`Error in test for event ${key}:`, error);
				throw error;
			}
		}
		debugLog(`Iteration ${i + 1} completed`);
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
	debugLog(`Saving measurements for ${key}`);
	const resultsFilePath = path.join(RESULTS_FILE_DIR, RESULTS_FILE_NAME);

	let results = {};
	try {
		fs.mkdirSync(RESULTS_FILE_DIR, { recursive: true });
		if (fs.existsSync(resultsFilePath)) {
			results = JSON.parse(fs.readFileSync(resultsFilePath, 'utf8'));
			const backupPath = getBackupFilePath(resultsFilePath);
			fs.copyFileSync(resultsFilePath, backupPath);
			debugLog(`Backup created: ${backupPath}`);
		}
		results[key] = measurements;
		fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
	} catch (error) {
		console.error('Error saving measurements:', error);
	}
}

/**
 * Get a backup file path for the results file.
 *
 * @param {string} originalPath
 * @returns {string}
 */
function getBackupFilePath(originalPath) {
	const dir = path.dirname(originalPath);
	const ext = path.extname(originalPath);
	const baseName = path.basename(originalPath, ext);
	let counter = 1;
	let backupPath;

	do {
		backupPath = path.join(dir, `${baseName}_backup${counter}${ext}`);
		counter++;
	} while (fs.existsSync(backupPath));

	return backupPath;
}

/**
 * Warmup runs to stabilize the environment.
 */
export async function warmupRun() {
	console.info(`Starting warmup (${WARMUP_ITERATIONS} iterations)`);
	for (let i = 0; i < WARMUP_ITERATIONS; i++) {
		debugLog(`Warmup iteration ${i + 1}`);
		await createNewPost();
	}
	console.info('Warmup completed');
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
		debugLog(`Searching for pattern: ${patternName}`);
		const searchParameters = {
			q: patternName,
			query_by: 'post_title',
			filter_by: 'gutenberg_type:=[Patterns,Pages]',
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
			debugLog(`Pattern found: ${pattern.post_title}`);
			return pattern.gutenberg_code;
		} else {
			console.warn(`Pattern not found: ${patternName}`);
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
