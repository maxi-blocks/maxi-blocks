export const receiveSelectedMaxiStyleCard = async page => {
	return page.evaluate(() => {
		return wp.data
			.select('maxiBlocks/style-cards')
			.receiveMaxiSelectedStyleCard();
	});
};

export const checkSCResult = async page => {
	const {
		value: {
			light: { styleCard: expectPresets },
		},
	} = await receiveSelectedMaxiStyleCard(page);

	return expectPresets;
};
