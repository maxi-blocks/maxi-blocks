const changeUniqueID = async (page, id) => {
	await page.evaluate(id => {
		// Get the client ID of the currently selected block
		const clientId = wp.data
			.select('core/block-editor')
			.getSelectedBlockClientId();

		// Check if a block is selected
		if (clientId) {
			// Update the block's uniqueID attribute
			wp.data
				.dispatch('core/block-editor')
				.updateBlockAttributes(clientId, { uniqueID: id });
		}
	});
};
export default changeUniqueID;
