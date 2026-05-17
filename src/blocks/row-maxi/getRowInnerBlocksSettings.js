const getRowInnerBlocksSettings = ({
	allowedBlocks,
	hasInnerBlocks,
	renderEmptyAppender,
}) => ({
	templateLock: false,
	allowedBlocks,
	orientation: 'horizontal',
	renderAppender: hasInnerBlocks ? false : renderEmptyAppender,
});

export default getRowInnerBlocksSettings;
