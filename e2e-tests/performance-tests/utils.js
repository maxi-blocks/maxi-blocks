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
	COOL_DOWN_TIME,
	currentSessionFilePath,
	setCurrentSessionFilePath,
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
 * @param {Page} page
 * @param {Function} action
 * @param {any} context
 * @returns {Promise<Object<string, any>>} { time: number, context: Any }
 */
export async function measureSingleAction(page, action, context) {
	const startMetrics = await page.metrics();
	const newContext = await action(context);
	const endMetrics = await page.metrics();

	const duration = endMetrics.ScriptDuration - startMetrics.ScriptDuration;

	return {
		time: duration,
		context: newContext,
	};
}

/**
 * Perform measurements for a set of events.
 *
 * @param {Object<string, {pre: Function, action: Function, post: Function}>} events
 * @param {number} iterations
 * @returns {Promise<Object<string, {times: number[], average: number}>>} measurements
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
					page,
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

		await cleanupAfterIteration();

		await page.waitForTimeout(COOL_DOWN_TIME);
	}

	return results;
}

async function cleanupAfterIteration() {
	debugLog('Performing cleanup after iteration');
	// Clear browser cache and cookies
	const client = await page.target().createCDPSession();
	await client.send('Network.clearBrowserCache');
	await client.send('Network.clearBrowserCookies');

	// Clear JavaScript heap
	await client.send('HeapProfiler.collectGarbage');

	debugLog('Cleanup completed');
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

	try {
		fs.mkdirSync(RESULTS_FILE_DIR, { recursive: true });
	} catch (error) {
		console.error('Error creating directory:', error);
		return;
	}

	const newFilePath = getNewFilePath(resultsFilePath);
	let existingResults = {};

	if (fs.existsSync(newFilePath)) {
		try {
			const fileContent = fs.readFileSync(newFilePath, 'utf8');
			existingResults = JSON.parse(fileContent);
		} catch (error) {
			console.warn(
				`Error reading existing file: ${error.message}. Creating a new file.`
			);
		}
	}

	const mergedResults = {
		...existingResults,
		[key]: measurements,
	};

	try {
		fs.writeFileSync(newFilePath, JSON.stringify(mergedResults, null, 2));
		debugLog(`Results saved to: ${newFilePath}`);
	} catch (error) {
		console.error('Error writing to file:', error);
	}
}

/**
 * Get a new session file path with a unique name.
 *
 * @param {string} originalPath
 * @returns {string}
 */
function getNewFilePath(originalPath) {
	if (currentSessionFilePath) {
		return currentSessionFilePath;
	}

	const dir = path.dirname(originalPath);
	const ext = path.extname(originalPath);
	const baseName = path.basename(originalPath, ext);

	let counter = 1;
	let newPath;

	do {
		newPath = path.join(dir, `${baseName}-${counter}${ext}`);
		counter++;
	} while (fs.existsSync(newPath));

	setCurrentSessionFilePath(newPath);
	return newPath;
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
