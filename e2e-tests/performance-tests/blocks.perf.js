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

function getBlockData() {
	return {
		'button-maxi': {
			name: 'Button Maxi',
		},
		'container-maxi': {
			name: 'Container Maxi',
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
		'row-maxi': {
			name: 'Row Maxi',
			action: async () => {
				// 8 columns pattern
				await page.waitForSelector('.maxi-row-block__template button');
				await page.$$eval('.maxi-row-block__template button', button =>
					button[7].click()
				);
				await page.waitForSelector('.maxi-column-block');
			},
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
			it(`${blockName} performance`, async () => {
				let insertBlock = null;
				let blockClientId = null;

				const measurements = await performMeasurements({
					insert: {
						pre: async () => {
							insertBlock = await prepareInsertMaxiBlock(
								page,
								blockName
							);
						},
						action: async () => {
							await insertBlock();
							await action?.();
							await waitForBlocksLoad(page);
						},
					},
					reload: {
						pre: async () => {
							await saveDraft();
							await page.reload({ waitUntil: 'networkidle0' });
						},
						action: async () => {
							await waitForBlocksLoad(page);
						},
					},
					select: {
						pre: async () => {
							const blocks = await page.evaluate(() =>
								wp.data.select('core/block-editor').getBlocks()
							);
							blockClientId = blocks[0].clientId;
						},
						action: async () => {
							console.log(`Selecting block ${blockClientId}`);
							await page.evaluate(clientId => {
								console.log(`Inside evaluate ${clientId}`);
								wp.data
									.dispatch('core/block-editor')
									.selectBlock(clientId);
							}, blockClientId);
							await page.waitForSelector('.is-selected');
						},
					},
				});

				saveEventMeasurements(blockName, measurements);
			});
		}
	);
});
