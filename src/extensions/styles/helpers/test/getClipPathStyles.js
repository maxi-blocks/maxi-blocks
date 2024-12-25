import getClipPathStyles from '@extensions/styles/helpers/getClipPathStyles';

describe('getClipPathStyles', () => {
	const object = {
		'clip-path-status-general': true,
		'clip-path-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'clip-path-status-l': true,
		'clip-path-l': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'clip-path-status-xl': true,
		'clip-path-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'clip-path-status-xxl': true,
		'clip-path-xxl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'clip-path-status-m': true,
		'clip-path-m': 'none',
		'clip-path-status-s': false,
		'clip-path-s': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'clip-path-status-xs': true,
		'clip-path-xs': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		// hover attributes
		'clip-path-status-hover': true,
		'clip-path-general-hover': 'none',
		'clip-path-l-hover': 'circle(50% at 50% 50%)',
		'clip-path-xl-hover': 'polygon(0% 75%, 100% 25%, 62.5% 75%)',
		'clip-path-xxl-hover':
			'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
		'clip-path-s-hover':
			'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
	};

	it('Get a correct clipPath styles', () => {
		const result = getClipPathStyles({ obj: object });
		expect(result).toMatchSnapshot();
	});

	it('Get a correct hover clipPath styles', () => {
		const result = getClipPathStyles({ obj: object, isHover: true });
		expect(result).toMatchSnapshot();
	});

	it('Get an empty hover clipPath styles, when hover-status is false', () => {
		const result = getClipPathStyles({
			obj: { ...object, 'clip-path-status-hover': false },
			isHover: true,
		});
		expect(result).toMatchSnapshot();
	});

	it('Get an empty clipPath styles, when clipPath - none', () => {
		const result = getClipPathStyles({
			obj: {
				'clip-path-general': 'none',
				'clip-path-status-general': true,
			},
		});
		expect(result).toMatchSnapshot();
	});

	it('Get a none hover clipPath styles, when clipPath - none', () => {
		const result = getClipPathStyles({
			obj: {
				'clip-path-general-hover': 'none',
				'clip-path-status-hover': true,
			},
			isHover: true,
		});
		expect(result).toMatchSnapshot();
	});
});
