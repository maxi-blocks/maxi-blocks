import getClipPathStyles from '../getClipPathStyles';

describe('getClipPathStyles', () => {
	const object = {
		'cp-status-general': true,
		'cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'cp-status-l': true,
		'cp-l': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'cp-status-xl': true,
		'cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'cp-status-xxl': true,
		'cp-xxl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'cp-status-m': true,
		'cp-m': 'none',
		'cp-status-s': false,
		'cp-s': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'cp-status-xs': true,
		'cp-xs': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		// hover attributes
		'cp-status-hover': true,
		'cp-general-hover': 'none',
		'cp-l-hover': 'circle(50% at 50% 50%)',
		'cp-xl-hover': 'polygon(0% 75%, 100% 25%, 62.5% 75%)',
		'cp-xxl-hover':
			'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
		'cp-s-hover':
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
			obj: { ...object, 'cp-status-hover': false },
			isHover: true,
		});
		expect(result).toMatchSnapshot();
	});

	it('Get an empty clipPath styles, when clipPath - none', () => {
		const result = getClipPathStyles({
			obj: {
				'cp-general': 'none',
				'cp-status-general': true,
			},
		});
		expect(result).toMatchSnapshot();
	});

	it('Get a none hover clipPath styles, when clipPath - none', () => {
		const result = getClipPathStyles({
			obj: {
				'cp-general-hover': 'none',
				'cp-status-hover': true,
			},
			isHover: true,
		});
		expect(result).toMatchSnapshot();
	});
});
