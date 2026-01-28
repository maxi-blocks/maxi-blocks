const insertMaxiBlock = async (editor, page, blockTitleOrName) => {
	// Convert display name like "Button Maxi" to block name "maxi-blocks/button-maxi"
	let blockName = blockTitleOrName;

	// If it's a display name (contains "Maxi"), convert to block name format
	if (blockTitleOrName.includes('Maxi') && !blockTitleOrName.includes('/')) {
		const slug = blockTitleOrName
			.replace(' Maxi', '')
			.replace(/ /g, '-')
			.toLowerCase();
		blockName = `maxi-blocks/${slug}-maxi`;
	}

	await editor.insertBlock({ name: blockName });

	// Generate the CSS class selector for waiting
	const blockClass = `.maxi-${blockTitleOrName
		.replace(' Maxi', '')
		.replace(/ /g, '-')
		.replace('Icon', 'svg-icon')
		.toLowerCase()}-block`;

	await page.waitForSelector(blockClass, { state: 'visible' });

	// Special case: container block also needs to wait for row
	if (blockClass === '.maxi-container-block') {
		await page.waitForSelector('.maxi-row-block', { state: 'visible' });
	}
};

export default insertMaxiBlock;
