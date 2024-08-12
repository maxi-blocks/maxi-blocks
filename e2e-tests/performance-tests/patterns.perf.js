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
	debugLog,
} from './utils';
import { PATTERNS, PERFORMANCE_TESTS_TIMEOUT, WARMUP_TIMEOUT } from './config';

describe('Patterns performance', () => {
	console.info('Starting Patterns performance tests');

	const patternManager = new PatternManager(page);

	beforeEach(async () => {
		await warmupRun();
	}, WARMUP_TIMEOUT);

	PATTERNS.forEach(({ type, patterns }) => {
		patterns.forEach(patternName => {
			it(
				`[${type}] ${patternName} performance`,
				async () => {
					console.info(
						`Starting test for pattern: ${patternName} (${type})`
					);

					const patternCode =
						await patternManager.getPatternCodeEditor(patternName);

					const measurements = await performMeasurements({
						insert: {
							pre: async () => {
								debugLog(
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
								debugLog(
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
						// reload: {
						// 	pre: async ({ totalBlockCount }) => {
						// 		debugLog(
						// 			`Saving draft for pattern: ${patternName} (${type})`
						// 		);
						// 		await saveDraft();
						// 		await page.waitForTimeout(1000);
						// 		return { totalBlockCount };
						// 	},
						// 	action: async ({ totalBlockCount }) => {
						// 		debugLog(
						// 			`Reloading page for pattern: ${patternName} (${type})`
						// 		);
						// 		await page.reload();
						// 		await waitForBlocksLoad(page, totalBlockCount);
						// 		return { totalBlockCount };
						// 	},
						// },
					});

					debugLog(
						`Saving measurements for pattern: ${patternName} (${type})`
					);
					saveEventMeasurements(
						`${type}_${patternName}`,
						measurements
					);
					console.info(
						`Finished test for pattern: ${patternName} (${type})`
					);
				},
				PERFORMANCE_TESTS_TIMEOUT
			);
		});
	});
});
