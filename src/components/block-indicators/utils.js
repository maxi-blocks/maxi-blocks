const minSizeValue = 10;

export const minSize = `var(--maxi-block-indicators-min-size, ${minSizeValue}px)`;

export const isVerticalDirection = dir => dir === 'top' || dir === 'bottom';

export const getIndicatorDirection = (dir, type) => {
	if (type === 'margin') return dir;

	// Need to do inverse for padding to allow good UX on dragging
	switch (dir) {
		case 'top':
			return 'bottom';
		case 'bottom':
			return 'bottom';
		case 'left':
			return 'right';
		case 'right':
		default:
			return 'left';
	}
};

export const getIndicatorStyle = ({
	value,
	unit,
	dir,
	type,
	isOverflowHidden = false,
}) => {
	const isVertical = isVerticalDirection(dir);

	return {
		[isVertical ? 'height' : 'width']: `${value}${unit}`,
		[isVertical ? 'minHeight' : 'minWidth']: minSize,
		...(type === 'margin' &&
			value > 0 && {
				[dir]: isOverflowHidden ? 0 : `${-value}${unit}`,
			}),
		...(type === 'padding' &&
			!isVertical && {
				[dir]: 0,
				...(dir === 'right' && {
					right: '1px',
				}),
			}),
	};
};

export const getIndicatorSize = dir => {
	const isVertical = isVerticalDirection(dir);

	return {
		height: '100%',
		width: '100%',
		[isVertical ? 'minHeight' : 'minWidth']: minSize,
	};
};

export const getIndicatorHandleStyles = ({ dir, type, value, unit }) => {
	const indicatorDirection = getIndicatorDirection(dir, type);
	const isVertical = isVerticalDirection(dir);

	return {
		[indicatorDirection]: {
			[indicatorDirection]: 0,
			[isVertical ? 'height' : 'width']: `${value}${unit}`,
			[isVertical ? 'minHeight' : 'minWidth']: minSize,
		},
	};
};
