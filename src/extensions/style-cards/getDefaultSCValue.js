const getDefaultSCValue = ({ target, SC: rawSC, SCStyle, groupAttr }) => {
	const SC = rawSC[SCStyle]?.defaultStyleCard || rawSC.defaultStyleCard;

	if (groupAttr && SC[groupAttr]) return SC[groupAttr][target];

	return Object.values(SC).filter(group => {
		if (group[target]) return group[target];

		return false;
	})[0];
};

export default getDefaultSCValue;
