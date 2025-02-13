const getIconPositionClass = (position, className) => {
	if (!position) return '';
	const validPositions = ['top', 'bottom', 'center', 'left', 'right'];
	return validPositions.includes(position)
		? `${className}--icon-${position}`
		: '';
};

export default getIconPositionClass;
