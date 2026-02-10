/* eslint-disable no-await-in-loop */
import uniqueIDGenerator from './uniqueIDGenerator';

const updateAllBlockUniqueIds = async (page, innerBlocks) => {
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
			const blockName = block.name;
			const newUniqueID = uniqueIDGenerator({ blockName, oldUniqueID });

			await page.evaluate(
				({ clientId, uniqueID }) => {
					wp.data
						.dispatch('core/block-editor')
						.updateBlockAttributes(clientId, {
							uniqueID,
						});
				},
				{ clientId, uniqueID: newUniqueID }
			);

			// Update the injected style tag id/content if present
			await page.evaluate(
				({ oldUniqueID, newUniqueID }) => {
					const element = document.getElementById(
						`maxi-blocks__styles--${oldUniqueID}`
					);
					if (!element) return;

					element.id = `maxi-blocks__styles--${newUniqueID}`;
					element.innerHTML = element.innerHTML.replace(
						new RegExp(oldUniqueID, 'g'),
						newUniqueID
					);

					Array.from(element.attributes).forEach(attr => {
						if (!attr.value.includes(oldUniqueID)) return;
						element.setAttribute(
							attr.name,
							attr.value.replace(
								new RegExp(oldUniqueID, 'g'),
								newUniqueID
							)
						);
					});
				},
				{ oldUniqueID, newUniqueID }
			);
		}

		if (block?.innerBlocks?.length) {
			await updateAllBlockUniqueIds(page, block.innerBlocks);
		}
	}
};

export default updateAllBlockUniqueIds;
