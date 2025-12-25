const getBlockAttributes = async page => {
	return page.evaluate(() => {
		const clientId = wp.data
			.select('core/block-editor')
			.getSelectedBlockClientId();
		return wp.data.select('core/block-editor').getBlockAttributes(clientId);
	});
};

export default getBlockAttributes;
