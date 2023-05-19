import getClipPathStyles from '../getClipPathStyles';

describe('getClipPathStyles', () => {
	const object = {
		'_cp.s-general': true,
		'_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'_cp.s-l': true,
		'_cp-l': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'_cp.s-xl': true,
		'_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'_cp.s-xxl': true,
		'_cp-xxl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'_cp.s-m': true,
		'_cp-m': 'none',
		'_cp.s-s': false,
		'_cp-s': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		'_cp.s-xs': true,
		'_cp-xs': 'polygon(50% 0%, 0% 100%, 100% 100%)',
		// hover attributes
		'_cp.sh': true,
		'_cp-general.h': 'none',
		'_cp-l.h': 'circle(50% at 50% 50%)',
		'_cp-xl.h': 'polygon(0% 75%, 100% 25%, 62.5% 75%)',
		'_cp-xxl.h':
			'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
		'_cp-s.h':
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
			obj: { ...object, '_cp.sh': false },
			isHover: true,
		});
		expect(result).toMatchSnapshot();
	});

	it('Get an empty clipPath styles, when clipPath - none', () => {
		const result = getClipPathStyles({
			obj: {
				'_cp-general': 'none',
				'_cp.s-general': true,
			},
		});
		expect(result).toMatchSnapshot();
	});

	it('Get a none hover clipPath styles, when clipPath - none', () => {
		const result = getClipPathStyles({
			obj: {
				'_cp-general.h': 'none',
				'_cp.sh': true,
			},
			isHover: true,
		});
		expect(result).toMatchSnapshot();
	});
});
