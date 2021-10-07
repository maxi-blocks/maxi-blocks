const validateOriginValue = val => {
	const isNumeric = val => {
		if (typeof val !== 'string') return false;
		return !Number.isNaN(val) && !Number.isNaN(parseFloat(val));
	};
	const words = ['top', 'bottom', 'left', 'right', 'centre', 'middle'];

	if (isNumeric(val)) return Number(val);
	if (words.includes(val)) return val;

	return false;
};

export default validateOriginValue;
