/* eslint-disable jest/expect-expect */
/* eslint-disable no-console */

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
import {
	PATTERNS,
	PERFORMANCE_TESTS_TIMEOUT,
	WARMUP_TIMEOUT,
	PATTERNS_ITERATIONS,
} from './config';

describe('Patterns performance', () => {
	console.info('Starting Patterns performance tests');

	let patternManager;
	let patternCodes;

	beforeAll(async () => {
		patternManager = new PatternManager();
		const allPatternNames = PATTERNS.flatMap(({ patterns }) => patterns);
		patternCodes = await patternManager.getPatternCodeEditors(
			allPatternNames
		);
	});

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

					const patternCode = patternCodes.get(patternName);

					if (!patternCode) {
						console.warn(
							`Skipping test for pattern: ${patternName} (${type}) - Pattern not found`
						);
						return;
					}

					const measurements = await performMeasurements(
						{
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
									debugLog(
										`Inserting pattern: ${patternName} (${type}) (Total blocks: ${totalBlockCount})`
									);
									await page.evaluate(blocks => {
										wp.data
											.dispatch('core/block-editor')
											.insertBlocks(blocks);
									}, blocks);
									return { blocks, totalBlockCount };
								},
								action: async ({ blocks, totalBlockCount }) => {
									await waitForBlocksLoad(
										page,
										totalBlockCount
									);
									return { totalBlockCount };
								},
							},
						},
						PATTERNS_ITERATIONS
					);

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
