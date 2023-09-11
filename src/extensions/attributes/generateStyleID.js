const generateStyleID = () => {
	return `maxi-${new Date().getTime()}-${Math.random()
		.toString(36)
		.substr(2, 7)}`;
};

export default generateStyleID;
