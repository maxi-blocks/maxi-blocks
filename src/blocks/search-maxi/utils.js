export const getIconRevealPositionSettings = position => {
	const positionSettings = {
		left: {
			'input-border-left-width-general': 0,
			'input-border-right-width-general': 4,
			'input-padding-left-general': 35,
			'input-padding-right-general': 10,
		},
		center: {
			'input-border-left-width-general': 4,
			'input-border-right-width-general': 4,
			'input-padding-left-general': 10,
			'input-padding-right-general': 10,
		},
		right: {
			'input-border-left-width-general': 4,
			'input-border-right-width-general': 0,
			'input-padding-left-general': 10,
			'input-padding-right-general': 35,
		},
	};

	return positionSettings[position];
};
