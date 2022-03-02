const receiveSelectedMaxiStyle = async page => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};

const checkSCResults = async page => {
	const {
		value: {
			light: { styleCard: expectPresets },
		},
	} = await receiveSelectedMaxiStyle(page);

	return expectPresets;
};

export default checkSCResults;
