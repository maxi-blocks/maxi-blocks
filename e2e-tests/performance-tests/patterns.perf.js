/**
 * Internal dependencies
 */
import {
	warmupRun,
	performMeasurements,
	saveEventMeasurements,
	waitForBlocksLoad,
	PatternManager,
} from './utils';
import { PATTERNS, PERFORMANCE_TESTS_TIMEOUT } from './config';

describe('Patterns performance', () => {
	const patternManager = new PatternManager(page);

	console.log('Starting Patterns performance tests');

	beforeEach(async () => {
		await warmupRun(page);
	});

	PATTERNS.forEach(patternName => {
		it(
			`${patternName} performance`,
			async () => {
				console.log(`Starting test for pattern: ${patternName}`);

				const patternCode = await patternManager.getPatternCodeEditor(
					patternName
				);

				try {
					const measurements = await performMeasurements({
						insert: {
							pre: async () => {
								console.log(
									`Preparing to insert pattern: ${patternName}`
								);
								const blocks = await page.evaluate(code => {
									return wp.blocks.rawHandler({
										HTML: code,
										mode: 'BLOCKS',
									});
								}, patternCode);
								const block = await page.waitForSelector(
									'.block-editor-default-block-appender__content',
									{ visible: true }
								);
								await page.evaluate(block => {
									block.focus();
								}, block);
								return blocks;
							},
							action: async blocks => {
								console.log(
									`Inserting pattern: ${patternName}`
								);
								await page.evaluate(blocks => {
									wp.data
										.dispatch('core/block-editor')
										.insertBlocks(blocks);
								}, blocks);
								await waitForBlocksLoad(page);
							},
						},
						reload: {
							pre: async () => {
								console.log(
									`Saving draft for pattern: ${patternName}`
								);
								await page.waitForSelector(
									'.editor-post-save-draft'
								);
								await page.click('.editor-post-save-draft');
								await page.waitForTimeout(2000);
							},
							action: async () => {
								console.log(
									`Reloading page for pattern: ${patternName}`
								);
								await page.reload({
									waitUntil: 'networkidle0',
								});
								await waitForBlocksLoad(page);
							},
						},
					});

					console.log(
						`Saving measurements for pattern: ${patternName}`
					);
					saveEventMeasurements(patternName, measurements);
					console.log(`Finished test for pattern: ${patternName}`);
				} catch (error) {
					console.error(
						`Error in test for pattern ${patternName}:`,
						error
					);
					throw error;
				}
			},
			PERFORMANCE_TESTS_TIMEOUT
		);
	});
});
