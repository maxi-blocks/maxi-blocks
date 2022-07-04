const getIconPositionClass = (position, className) => {
	switch (position) {
		case 'top':
			return `${className}--icon-top`;
		case 'bottom':
			return `${className}--icon-bottom`;
		case 'left':
			return `${className}--icon-left`;
		case 'right':
			return `${className}--icon-right`;
		default:
			return '';
	}
};

export default getIconPositionClass;
