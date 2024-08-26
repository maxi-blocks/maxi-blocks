/**
 * Internal dependencies
 */
import { waitForBlocksLoad } from './utils';

/**
 * External dependencies
 */
import path from 'path';

/**
 * Number of warmup iterations to perform.
 */
export const WARMUP_ITERATIONS = 5;

/**
 * Timeout for warmup.
 */
export const WARMUP_TIMEOUT = 20000 * WARMUP_ITERATIONS;

/**
 * Cool down time between iterations.
 */
export const COOL_DOWN_TIME = 1000;

/**
 * Number of iterations to perform for each pattern.
 */
export const PATTERNS_ITERATIONS = 5;

/**
 * Number of iterations to perform for each block.
 */
export const BLOCKS_ITERATIONS = 5;

/**
 * Timeout for performance tests.
 * 2 mins for each iteration
 */
export const PERFORMANCE_TESTS_TIMEOUT =
	120000 * Math.max(PATTERNS_ITERATIONS, BLOCKS_ITERATIONS);

/**
 * Timeout for blocks to load.
 */
export const BLOCKS_LOAD_TIMEOUT = 90000;

/**
 * Directory where the results will be stored.
 */
export const RESULTS_FILE_DIR = path.join(__dirname, '../../bin');

/**
 * Results file name
 */
export const RESULTS_FILE_NAME = 'performance-results.json';

/**
 * Patterns to test
 *
 * @type {Array<{ type: string, patterns: string[] }>}
 */
export const PATTERNS = [
	{
		type: 'Simple',
		patterns: [
			'HOL-PRO-95',
			'ANL-PRO-09',
			'NML-PRO-18',
			// 'PIL-PRO-164',
			// 'SML-PRO-61',
			// 'SML-38',
		],
	},
	{
		type: 'DC/CL/IB',
		patterns: [
			'PBGL-PRO-60',
			'PBGL-PRO-97',
			'WCL-PRO-01',
			// 'PBGL-PRO-12',
			// 'WCL-PRO-06',
		],
	},
	{
		type: 'IB',
		patterns: [
			'PIL-PRO-75',
			'PIL-PRO-82',
			'PIL-PRO-83',
			// 'PIL-PRO-118',
			// 'HOL-PRO-133',
			// 'SML-PRO-137',
			// 'PTML-PRO-77',
		],
	},
	{
		type: 'Complex',
		patterns: [
			'HOL-PRO-62',
			'SML-PRO-134',
			'PFL-PRO-62',
			// 'HOL-PRO-53',
			// 'HOL-PRO-47',
			// 'SML-PRO-162',
		],
	},
	{
		type: 'Pages',
		patterns: [
			'DSP-PRO-01',
			'GMP-PRO-01',
			'NGOP-PRO-02',
			// 'HEP-PRO-05',
			// 'GDSP-PRO-01',
			// 'CSPY-PRO-01',
		],
	},
];

/**
 * Blocks test config
 *
 * @type {Record<string, { name: string, action?: (page: Page) => Promise<void> }>}
 */
export const BLOCKS_DATA = {
	'button-maxi': {
		name: 'Button Maxi',
	},
	'container-maxi': {
		name: 'Container Maxi with Row and Columns Maxi',
		action: async page => {
			await page.waitForSelector('.maxi-row-block__template button');
			await page.$$eval('.maxi-row-block__template button', buttons =>
				// 8 columns pattern
				buttons.at(-1).click()
			);
			await waitForBlocksLoad(page, 10); // 1 container + 1 row + 8 columns
		},
	},
	'divider-maxi': {
		name: 'Divider Maxi',
	},
	'group-maxi': {
		name: 'Group Maxi',
	},
	'image-maxi': {
		name: 'Image Maxi',
	},
	'map-maxi': {
		name: 'Map Maxi',
	},
	'number-counter-maxi': {
		name: 'Number Counter Maxi',
	},
	'svg-icon-maxi': {
		name: 'Icon Maxi',
		action: async page => {
			await page.$eval('button[aria-label="Close"]', button =>
				button.click()
			);
		},
	},
	'text-maxi': {
		name: 'Text Maxi',
	},
	'slider-maxi': {
		name: 'Slider Maxi',
	},
	'accordion-maxi': {
		name: 'Accordion Maxi',
	},
	'video-maxi': {
		name: 'Video Maxi',
	},
	'search-maxi': {
		name: 'Search Maxi',
	},
};