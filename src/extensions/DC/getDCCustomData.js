const getDCCustomData = (contextLoop, dcStatus, uniqueID) => {
	if (!dcStatus || !contextLoop?.['cl-status']) {
		return {};
	}

	// If DC and loop are active, we need to return loop values.
	return {
		dynamic_content: {
			[uniqueID]: contextLoop,
		},
	};
};

export default getDCCustomData;
