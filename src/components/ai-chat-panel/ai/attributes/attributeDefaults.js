export const getAttributeDefault = entry => {
	if (!entry) return null;
	if (entry.default !== undefined && entry.default !== null) {
		return entry.default;
	}
	return null;
};

export const getResetValue = entry => getAttributeDefault(entry);
