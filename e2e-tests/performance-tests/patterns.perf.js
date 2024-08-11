/**
 * WordPress dependencies
 */
import { saveDraft } from '@wordpress/e2e-test-utils';

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
		await warmupRun();
	});

	PATTERNS.forEach(({ type, patterns }) => {
		patterns.forEach(patternName => {
			it(
				`[${type}] ${patternName} performance`,
				async () => {
					console.log(
						`Starting test for pattern: ${patternName} (${type})`
					);

					const patternCode =
						await patternManager.getPatternCodeEditor(patternName);

					const measurements = await performMeasurements({
						insert: {
							pre: async () => {
								console.log(
									`Preparing to insert pattern: ${patternName} (${type})`
								);
								const blocks = await page.evaluate(code => {
									return wp.blocks.rawHandler({
										HTML: code,
										mode: 'BLOCKS',
									});
								}, patternCode);

								const countBlocks = blocks => {
									let count = 0;
									for (const block of blocks) {
										if (
											block.name.startsWith(
												'maxi-blocks/'
											)
										) {
											count += 1;
										}

										if (
											block.innerBlocks &&
											block.innerBlocks.length > 0
										) {
											count += countBlocks(
												block.innerBlocks
											);
										}
									}
									return count;
								};

								const totalBlockCount = countBlocks(blocks);

								const block = await page.waitForSelector(
									'.block-editor-default-block-appender__content',
									{ visible: true }
								);
								await page.evaluate(block => {
									block.focus();
								}, block);
								return { blocks, totalBlockCount };
							},
							action: async ({ blocks, totalBlockCount }) => {
								console.log(
									`Inserting pattern: ${patternName} (${type}) (Total blocks: ${totalBlockCount})`
								);
								await page.evaluate(blocks => {
									wp.data
										.dispatch('core/block-editor')
										.insertBlocks(blocks);
								}, blocks);
								await waitForBlocksLoad(page, totalBlockCount);
								return { totalBlockCount };
							},
						},
						reload: {
							pre: async ({ totalBlockCount }) => {
								console.log(
									`Saving draft for pattern: ${patternName} (${type})`
								);
								await saveDraft();
								await page.waitForTimeout(1000);
								return { totalBlockCount };
							},
							action: async ({ totalBlockCount }) => {
								console.log(
									`Reloading page for pattern: ${patternName} (${type})`
								);
								await page.reload();
								await waitForBlocksLoad(page, totalBlockCount);
								return { totalBlockCount };
							},
						},
					});

					console.log(
						`Saving measurements for pattern: ${patternName} (${type})`
					);
					saveEventMeasurements(
						`${type}_${patternName}`,
						measurements
					);
					console.log(
						`Finished test for pattern: ${patternName} (${type})`
					);
				},
				PERFORMANCE_TESTS_TIMEOUT
			);
		});
	});
});
