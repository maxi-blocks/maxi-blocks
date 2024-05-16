const replaceUndefinedWithNull = obj => {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	Object.entries(obj).forEach(([key, value]) => {
		if (value === undefined) {
			obj[key] = null;
		} else if (typeof value === 'object' && value !== null) {
			replaceUndefinedWithNull(value);
		}
	});
	return obj;
};

export default replaceUndefinedWithNull;
