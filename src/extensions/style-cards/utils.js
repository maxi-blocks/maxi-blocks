const replaceUndefinedWithNull = obj => {
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
