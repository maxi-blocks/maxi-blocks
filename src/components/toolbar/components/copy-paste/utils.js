export const MAX_SAVED_STYLES = 100;

export const hasReachedSavedStylesLimit = savedStyles =>
	Object.keys(savedStyles || {}).length >= MAX_SAVED_STYLES;

export const getNextSavedStyleName = (savedStyles = {}, now = new Date()) => {
	const dateStr = now.toLocaleDateString();
	const timeStr = now.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

	const styleNumbers = Object.keys(savedStyles)
		.map(key => {
			const match = key.match(/Style (\d+)/);
			return match ? parseInt(match[1], 10) : 0;
		})
		.filter(num => !Number.isNaN(num));

	const nextStyleNumber =
		styleNumbers.length > 0 ? Math.max(...styleNumbers) + 1 : 1;

	return `Style ${nextStyleNumber} - ${dateStr} ${timeStr}`;
};

export const getUpdatedSavedStyles = ({
	savedStyles,
	blockName,
	blockAttributes,
	now = new Date(),
}) => {
	const currentStyles = savedStyles || {};
	const newStyleName = getNextSavedStyleName(currentStyles, now);

	return {
		newStyleName,
		updatedStyles: {
			...currentStyles,
			[newStyleName]: {
				blockType: blockName,
				styles: blockAttributes,
			},
		},
	};
};
