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
import { PERFORMANCE_TESTS_TIMEOUT } from './config';

function getBlockData() {
	return {
		'button-maxi': {
			name: 'Button Maxi',
		},
		'container-maxi': {
			name: 'Container Maxi with Row and Columns Maxi',
			action: async () => {
				// 8 columns pattern
				await page.waitForSelector('.maxi-row-block__template button');
				await page.$$eval('.maxi-row-block__template button', button =>
					button[7].click()
				);
				await page.waitForSelector('.maxi-column-block');
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
			action: async () => {
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
}

describe('Blocks performance', () => {
	const blockData = getBlockData();

	beforeEach(async () => {
		await warmupRun(page);
	});

	Object.entries(blockData).forEach(
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
									return insertBlock;
								},
								action: async insertBlock => {
									console.log(`Inserting ${blockName}`);
									await insertBlock();
									await action?.();
									await waitForBlocksLoad(page);
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
									await page.reload({
										waitUntil: 'networkidle0',
									});
									console.log(
										`Waiting for blocks to load after reload for ${blockName}`
									);
									await waitForBlocksLoad(page);
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
									return blocks[0].clientId;
								},
								action: async blockClientId => {
									console.log(`Selecting ${blockName}`);
									await page.evaluate(clientId => {
										wp.data
											.dispatch('core/block-editor')
											.selectBlock(clientId);
									}, blockClientId);
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
