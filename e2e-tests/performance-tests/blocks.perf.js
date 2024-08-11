/**
 * WordPress dependencies
 */
import { saveDraft } from '@wordpress/e2e-test-utils';

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
} from './config';

describe('Blocks performance', () => {
	console.info('Starting Blocks performance tests');

	beforeEach(async () => {
		await warmupRun();
	}, WARMUP_TIMEOUT);

	Object.entries(BLOCKS_DATA).forEach(
		([blockType, { name: blockName, action }]) => {
			it(
				`${blockName} performance`,
				async () => {
					console.info(`Starting test for ${blockName}`);

					try {
						const measurements = await performMeasurements({
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
									await waitForBlocksLoad(page, 1);
								},
							},
							reload: {
								pre: async () => {
									debugLog(`Saving draft for ${blockName}`);
									await saveDraft();
									await page.waitForTimeout(1000);
								},
								action: async () => {
									debugLog(`Reloading page for ${blockName}`);
									await page.reload();
									debugLog(
										`Waiting for blocks to load after reload for ${blockName}`
									);
									await waitForBlocksLoad(page, 1);
								},
							},
							select: {
								pre: async () => {
									debugLog(
										`Getting block client ID for ${blockName}`
									);
									const blocks = await page.evaluate(() =>
										wp.data
											.select('core/block-editor')
											.getBlocks()
									);
									return { clientId: blocks[0].clientId };
								},
								action: async ({ clientId }) => {
									debugLog(`Selecting ${blockName}`);
									await page.evaluate(clientId => {
										wp.data
											.dispatch('core/block-editor')
											.selectBlock(clientId);
									}, clientId);
									await page.waitForSelector('.is-selected');
								},
							},
							reload: {
								pre: async () => {
									debugLog(`Saving draft for ${blockName}`);
									await saveDraft();
									await page.waitForTimeout(1000);
								},
								action: async () => {
									debugLog(`Reloading page for ${blockName}`);
									await page.reload();
									debugLog(
										`Waiting for blocks to load after reload for ${blockName}`
									);
									await waitForBlocksLoad(page, 1);
								},
							},
						});

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
