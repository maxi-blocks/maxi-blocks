/**
 * @param {Object}           params           - The parameters object
 * @param {string}           params.target    - The target attribute to get the value of.
 * @param {Object}           params.SC        - The style card object.
 * @param {'light' | 'dark'} params.SCStyle   - The style card style to get the value from.
 * @param {string}           params.groupAttr - The group attribute to get the value from (e.g. 'h1', 'p', 'button').
 * @returns {string} The value from default style card.
 */
const getDefaultSCValue = ({ target, SC: rawSC, SCStyle, groupAttr }) => {
	const SC = rawSC[SCStyle]?.defaultStyleCard || rawSC.defaultStyleCard;

	if (groupAttr && SC[groupAttr]) return SC[groupAttr][target];

	return Object.values(SC).filter(group => {
		if (group[target]) return group[target];

		return false;
	})[0][target];
};

export default getDefaultSCValue;
