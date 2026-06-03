export const shouldWrapWithLink = ({
	blockName,
	allowedBlocks,
	linkElements,
	linkSettings = {},
	dynamicContent = {},
}) =>
	!!(
		(allowedBlocks.includes(blockName) &&
			(!linkElements || linkSettings.linkElement === 'canvas')) ||
		(dynamicContent['dc-status'] && blockName === 'maxi-blocks/text-maxi')
	);
