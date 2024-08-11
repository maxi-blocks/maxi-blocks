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
} from './utils';
import { BLOCKS_DATA, PERFORMANCE_TESTS_TIMEOUT } from './config';

describe('Blocks performance', () => {
	beforeEach(async () => {
		await warmupRun();
	});

	Object.entries(BLOCKS_DATA).forEach(
		([blockType, { name: blockName, action }]) => {
			it(
				`${blockName} performance`,
				async () => {
					console.log(`Starting test for ${blockName}`);

					try {
						const measurements = await performMeasurements({
							insert: {
								pre: async () => {
									console.log(
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
									console.log(`Inserting ${blockName}`);
									await insertBlock();
									await action?.(page);
									await waitForBlocksLoad(page, 1);
								},
							},
							reload: {
								pre: async () => {
									console.log(
										`Saving draft for ${blockName}`
									);
									await saveDraft();
									await page.waitForTimeout(1000);
								},
								action: async () => {
									console.log(
										`Reloading page for ${blockName}`
									);
									await page.reload();
									console.log(
										`Waiting for blocks to load after reload for ${blockName}`
									);
									await waitForBlocksLoad(page, 1);
								},
							},
							select: {
								pre: async () => {
									console.log(
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
									console.log(`Selecting ${blockName}`);
									await page.evaluate(clientId => {
										wp.data
											.dispatch('core/block-editor')
											.selectBlock(clientId);
									}, clientId);
									await page.waitForSelector('.is-selected');
								},
							},
						});

						console.log(`Saving measurements for ${blockName}`);
						saveEventMeasurements(blockName, measurements);
						console.log(`Finished test for ${blockName}`);
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
