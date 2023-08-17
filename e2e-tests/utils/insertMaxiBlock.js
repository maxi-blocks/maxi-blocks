import { insertBlock } from '@wordpress/e2e-test-utils';

const uniqueIDGenerator = ({ blockName }) => {
	const name = blockName
		.replace('maxi-blocks/', '')
		.replace(/ /g, '-')
		.toLowerCase();
	const uniquePart = '4se8ef1z'; // Fixed unique part
	return `${name}-${uniquePart}-u`;
};

const getClientIdOfInsertedBlock = async (page, blockName) => {
	// Define the block class
	const blockClass = `.maxi-${blockName
		.replace(' Maxi', '')
		.replace(/ /g, '-')
		.replace('Icon', 'svg-icon')
		.toLowerCase()}-block`;

	// Wait for the block to be inserted
	await page.waitForSelector(blockClass);

	// Get the client ID of the inserted block
	return page.evaluate(() => {
		const block = wp.data.select('core/block-editor').getBlocks().pop();
		return block.clientId;
	});
};

const processBlockAndInnerBlocks = async (page, clientId) => {
	// Get the old unique ID
	const oldUniqueID = await page.evaluate(clientId => {
		return wp.data.select('core/block-editor').getBlockAttributes(clientId)
			.uniqueID;
	}, clientId);

	// Get the block name
	const blockName = await page.evaluate(clientId => {
		return wp.data.select('core/block-editor').getBlockName(clientId);
	}, clientId);

	// Generate the newUniqueID based on blockName
	const newUniqueID = uniqueIDGenerator({ blockName });

	// Update the block's uniqueID attribute
	await page.evaluate(
		(clientId, uniqueID) => {
			wp.data
				.dispatch('core/block-editor')
				.updateBlockAttributes(clientId, {
					uniqueID,
				});
		},
		clientId,
		newUniqueID
	);

	// Change the element ID in the DOM
	await page.evaluate(
		(oldUniqueID, newUniqueID) => {
			const element = document.getElementById(
				`maxi-blocks__styles--${oldUniqueID}`
			);
			if (element) {
				element.id = `maxi-blocks__styles--${newUniqueID}`;
			}
		},
		oldUniqueID,
		newUniqueID
	);

	// Get inner blocks if any
	const innerBlocks = await page.evaluate(clientId => {
		return wp.data
			.select('core/block-editor')
			.getBlocksByClientId(clientId)[0].innerBlocks;
	}, clientId);

	// Recursively process inner blocks
	for (const innerBlock of innerBlocks) {
		await processBlockAndInnerBlocks(page, innerBlock.clientId);
	}
};

const insertMaxiBlock = async (page, blockName) => {
	await insertBlock(blockName);
	const clientId = await getClientIdOfInsertedBlock(page, blockName);
	await processBlockAndInnerBlocks(page, clientId);
};

export default insertMaxiBlock;
