// Removes non-necessary entries of props object for comparison
const propsObjectCleaner = props => {
	const entriesToRemove = [
		'maxiSetAttributes',
		'insertInlineStyles',
		'cleanInlineStyles',
		'context',
		'getBounds',
		'onReplace',
		'onRemove',
		'hasSelectedChild',
		'insertBlocksAfter',
		'mergeBlocks',
	];

	const newProps = Object.entries(props).reduce((acc, [key, value]) => {
		if (!entriesToRemove.includes(key) && typeof value !== 'function') {
			if (typeof value === 'object') {
				acc[key] = JSON.stringify(value);
			} else {
				acc[key] = value;
			}
		}

		return acc;
	}, {});

	return newProps;
};

export default propsObjectCleaner;
