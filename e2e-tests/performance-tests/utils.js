/**
 * WordPress dependencies
 */
import { createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	BLOCKS_LOAD_TIMEOUT,
	PATTERNS_ITERATIONS,
	RESULTS_FILE_DIR,
	RESULTS_FILE_NAME,
	WARMUP_ITERATIONS,
	COOL_DOWN_TIME,
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
 * @param {Page}   page
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
 * @param {Page}     page
 * @param {Function} action
 * @param {any}      context
 * @returns {Promise<Object<string, any>>} { time: number, context: Any }
 */
export async function measureSingleAction(page, action, context) {
	const startMetrics = await page.metrics();
	const newContext = await action(context);
	const endMetrics = await page.metrics();

	const endDuration =
		endMetrics.ScriptDuration +
		endMetrics.RecalcStyleDuration +
		endMetrics.LayoutDuration;

	const startDuration =
		startMetrics.ScriptDuration +
		startMetrics.RecalcStyleDuration +
		startMetrics.LayoutDuration;

	const detailedMetrics = {
		ScriptDuration: endMetrics.ScriptDuration - startMetrics.ScriptDuration,
		RecalcStyleDuration:
			endMetrics.RecalcStyleDuration - startMetrics.RecalcStyleDuration,
		LayoutDuration: endMetrics.LayoutDuration - startMetrics.LayoutDuration,
		TaskDuration: endMetrics.TaskDuration - startMetrics.TaskDuration,
	};

	const duration = endDuration - startDuration;

	return {
		time: duration,
		context: newContext,
		detailedMetrics,
	};
}

/**
 * Perform measurements for a set of events.
 *
 * @param {Object<string, {pre: Function, action: Function, post: Function}>} events
 * @param {number}                                                            iterations
 * @returns {Promise<Object<string, {times: number[], average: number}>>} measurements
 */
export async function performMeasurements(
	events,
	iterations = PATTERNS_ITERATIONS
) {
	const results = Object.fromEntries(
		Object.keys(events).map(key => [
			key,
			{ times: [], detailedMetrics: [] },
		])
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
				const {
					time,
					context: newContext,
					detailedMetrics,
				} = await measureSingleAction(page, event.action, context);
				results[key].times.push(time);
				results[key].detailedMetrics.push(detailedMetrics);
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
 * @param {string}                                             key
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

	let existingResults = {};

	if (fs.existsSync(resultsFilePath)) {
		try {
			const fileContent = fs.readFileSync(resultsFilePath, 'utf8');
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
		fs.writeFileSync(
			resultsFilePath,
			JSON.stringify(mergedResults, null, 2)
		);
		debugLog(`Results saved to: ${resultsFilePath}`);
	} catch (error) {
		console.error('Error writing to file:', error);
	}
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
 * @param {Page}   page
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
	constructor() {
		this.searchClient = this.createSearchClient();
	}

	async searchPatternsByNames(patternNames) {
		debugLog(`Searching for patterns: ${patternNames.join(', ')}`);
		const searches = patternNames.map(name => ({
			collection: 'post',
			q: name,
			query_by: 'post_title',
			filter_by: 'gutenberg_type:=[Patterns,Pages]',
			sort_by: '_text_match:desc',
			per_page: 1,
		}));

		try {
			const searchResults = await this.searchClient.multiSearch.perform({
				searches,
			});
			return searchResults.results.map(result =>
				result.hits.length > 0 ? result.hits[0].document : null
			);
		} catch (error) {
			console.error('Error searching for patterns:', error);
			return patternNames.map(() => null);
		}
	}

	async getPatternCodeEditors(patternNames) {
		const patterns = await this.searchPatternsByNames(patternNames);
		const patternMap = new Map();

		for (let i = 0; i < patternNames.length; i++) {
			const requestedName = patternNames[i];
			const pattern = patterns[i];

			if (pattern) {
				if (
					pattern.post_title
						.toLowerCase()
						.includes(requestedName.toLowerCase())
				) {
					debugLog(`Pattern found: ${pattern.post_title}`);
					const modifiedCode = PatternManager.replaceMediaURLs(
						pattern.gutenberg_code
					);
					patternMap.set(requestedName, modifiedCode);
				} else {
					console.warn(
						`Pattern mismatch for "${requestedName}". Found: "${pattern.post_title}"`
					);
					patternMap.set(requestedName, null);
				}
			} else {
				console.warn(`Pattern not found: ${requestedName}`);
				patternMap.set(requestedName, null);
			}
		}

		return patternMap;
	}

	static replaceMediaURLs(code) {
		return code
			.replace(/"mediaURL"\s*:\s*"https:\/\/[^"]*"/g, '"mediaURL":""')
			.replace(/src="https:\/\/[^"]*"/g, 'src=""');
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
