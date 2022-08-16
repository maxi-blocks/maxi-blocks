const getAspectRatio = ratio => {
	if (ratio === 'original') return null;

	return {
		ratio: {
			general: {
				'aspect-ratio': (() => {
					switch (ratio) {
						case 'ar11':
							return '1 / 1';
						case 'ar23':
							return '2 / 3';
						case 'ar32':
							return '3 / 2';
						case 'ar43':
							return '4 / 3';
						case 'ar169':
							return '16 / 9';
						default:
							return '';
					}
				})(),
			},
		},
	};
};

export default getAspectRatio;
