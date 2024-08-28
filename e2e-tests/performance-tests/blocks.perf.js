/* eslint-disable jest/expect-expect */
/* eslint-disable no-console */

/**
 * Internal dependencies
 */
import {
	waitForBlocksLoad,
	performMeasurements,
	saveEventMeasurements,
	warmupRun,
	prepareInsertMaxiBlock,
	debugLog,
} from './utils';
import {
	BLOCKS_DATA,
	PERFORMANCE_TESTS_TIMEOUT,
	WARMUP_TIMEOUT,
	BLOCKS_ITERATIONS,
} from './config';

describe('Blocks performance', () => {
	console.info('Starting Blocks performance tests');

	beforeEach(async () => {
		await warmupRun();
	}, WARMUP_TIMEOUT);

	Object.entries(BLOCKS_DATA).forEach(
		([blockType, { name: blockName, action, amountOfBlocks }]) => {
			it(
				`${blockName} performance`,
				async () => {
					console.info(`Starting test for ${blockName}`);

					try {
						const measurements = await performMeasurements(
							{
								insert: {
									pre: async () => {
										debugLog(
											`Preparing to insert ${blockName}`
										);
										const insertBlock =
											await prepareInsertMaxiBlock(
												page,
												blockType
											);
										return { insertBlock };
									},
									action: async ({ insertBlock }) => {
										debugLog(`Inserting ${blockName}`);
										await insertBlock();
										await action?.(page);
										await waitForBlocksLoad(
											page,
											amountOfBlocks ?? 1
										);
									},
								},
							},
							BLOCKS_ITERATIONS
						);

						debugLog(`Saving measurements for ${blockName}`);
						saveEventMeasurements(blockName, measurements);
						console.info(`Finished test for ${blockName}`);
					} catch (error) {
						console.error(`Error in test for ${blockName}:`, error);
						throw error;
					}
				},
				PERFORMANCE_TESTS_TIMEOUT
			);
		}
	);
});
