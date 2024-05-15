const showStaticOption = blockName => {
	const maxiBlocks = [
		'maxi-blocks/divider-maxi',
		'maxi-blocks/text-maxi',
		'maxi-blocks/button-maxi',
	];

	return maxiBlocks.includes(blockName);
};

export default showStaticOption;
