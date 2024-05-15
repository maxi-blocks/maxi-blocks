const replaceUndefinedWithNull = obj => {
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			if (typeof obj[key] === 'undefined') {
				obj[key] = null;
			} else if (typeof obj[key] === 'object' && obj[key] !== null) {
				replaceUndefinedWithNull(obj[key]);
			}
		}
	}
	return obj;
};

export default replaceUndefinedWithNull;
