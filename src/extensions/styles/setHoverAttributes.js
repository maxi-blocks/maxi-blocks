/**
 * Save hover attributes getting the normal ones as the defaults
 *
 * @param {*} attributes
 * @param {*} hoverAttributes
 * @returns
 */

const setHoverAttributes = (attributes, hoverAttributes) => {
	Object.entries(attributes).forEach(([key, val]) => {
		if (!hoverAttributes[`${key}-hover`])
			hoverAttributes[`${key}-hover`] = val;
	});

	return { ...hoverAttributes };
};

export default setHoverAttributes;
