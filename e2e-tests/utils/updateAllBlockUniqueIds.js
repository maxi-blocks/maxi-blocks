/* eslint-disable no-await-in-loop */
import uniqueIDGenerator from './uniqueIDGenerator';

const updateAllBlockUniqueIds = async (page, innerBlocks) => {
	// Determine the blocks to process (either provided innerBlocks or all top-level blocks)
	const blocks =
		innerBlocks ||
		(await page.evaluate(() => {
			return wp.data.select('core/block-editor').getBlocks();
		}));

	for (const block of blocks) {
		const { clientId } = block;
		const oldUniqueID = await page.evaluate(clientId => {
			return wp.data
				.select('core/block-editor')
				.getBlockAttributes(clientId).uniqueID;
		}, clientId);

		// Check if oldUniqueID already generated
		if (oldUniqueID && !oldUniqueID.includes('se8ef1z')) {
			// Generate the new unique ID based on the block's name
			const blockName = block.name;
			const newUniqueID = uniqueIDGenerator({ blockName, oldUniqueID });

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

			// Change the element ID in the DOM and update content
			await page.evaluate(
				(oldUniqueID, newUniqueID) => {
					const element = document.getElementById(
						`maxi-blocks__styles--${oldUniqueID}`
					);
					if (element) {
						// Update the element's ID
						element.id = `maxi-blocks__styles--${newUniqueID}`;

						// Update the content of the element
						element.innerHTML = element.innerHTML.replace(
							new RegExp(oldUniqueID, 'g'),
							newUniqueID
						);

						// Update any data attributes that might contain the old ID
						Array.from(element.attributes).forEach(attr => {
							if (attr.value.includes(oldUniqueID)) {
								element.setAttribute(
									attr.name,
									attr.value.replace(
										new RegExp(oldUniqueID, 'g'),
										newUniqueID
									)
								);
							}
						});
					}
				},
				oldUniqueID,
				newUniqueID
			);
		}

		// If the block has inner blocks, recursively call the function to update them
		if (block?.innerBlocks && block?.innerBlocks?.length > 0) {
			await updateAllBlockUniqueIds(page, block.innerBlocks);
		}
	}
};

export default updateAllBlockUniqueIds;
