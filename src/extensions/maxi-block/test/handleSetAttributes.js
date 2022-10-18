import handleSetAttributes from '../handleSetAttributes';

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => undefined)
);
jest.mock('@wordpress/blocks', () => {
	return {
		getBlockAttributes: jest.fn(),
	};
});
jest.mock('@wordpress/data', () => {
	let i = 0;

	return {
		select: jest.fn(() => {
			return {
				receiveMaxiDeviceType: jest.fn(() => 'xxl'),
				receiveBaseBreakpoint: jest.fn(() => 'm'),
				getSelectedBlockCount: jest.fn(() => 1),
				getPrevSavedAttrs: jest.fn(() => {
					i += 1;
					switch (i) {
						case 1:
							return [];
						case 2:
						case 3:
							return [
								'margin-top-general',
								'margin-right-general',
								'margin-bottom-general',
								'margin-left-general',
							];
						case 4:
							return ['border-style-general', 'border-style-xxl'];
						case 5:
							return ['border-style-xl'];
						case 6:
							return ['border-style-general', 'border-style-m'];
						case 7:
						case 8:
						case 9:
							return ['border-top-left-radius-general'];
						case 10:
							return [];
						case 11:
							return ['border-top-left-radius-xl'];
						case 12:
							return [
								'border-top-left-radius-xl',
								'border-top-left-radius-m',
							];
						default:
							return [];
					}
				}),
			};
		}),
		createReduxStore: jest.fn(),
		register: jest.fn(),
		dispatch: jest.fn(() => {
			return {
				savePrevSavedAttrs: jest.fn(),
			};
		}),
	};
});

describe('handleSetAttributes', () => {
	const onChange = result => result;

	it('On change number attributes from XXL responsive without General attribute, it changes on XXL and General all time', () => {
		const firstRound = {
			obj: {
				'margin-top-xxl': '1',
				'margin-right-xxl': '1',
				'margin-bottom-xxl': '1',
				'margin-left-xxl': '1',
			},
			attributes: {
				blockStyle: 'light',
			},
			onChange,
		};
		const secondRound = {
			obj: {
				'margin-top-xxl': '12',
				'margin-right-xxl': '12',
				'margin-bottom-xxl': '12',
				'margin-left-xxl': '12',
			},
			attributes: {
				blockStyle: 'light',
				'margin-top-general': '1',
				'margin-right-general': '1',
				'margin-bottom-general': '1',
				'margin-left-general': '1',
			},
			onChange,
		};
		const thirdRound = {
			obj: {
				'margin-top-xxl': '123',
				'margin-right-xxl': '123',
				'margin-bottom-xxl': '123',
				'margin-left-xxl': '123',
			},
			attributes: {
				blockStyle: 'light',
				'margin-top-general': '12',
				'margin-right-general': '12',
				'margin-bottom-general': '12',
				'margin-left-general': '12',
			},
			onChange,
		};

		const firstRoundResult = handleSetAttributes(firstRound);
		const secondRoundResult = handleSetAttributes(secondRound);
		const thirdRoundResult = handleSetAttributes(thirdRound);

		const firstRoundExpected = {
			'margin-top-xxl': undefined,
			'margin-right-xxl': undefined,
			'margin-bottom-xxl': undefined,
			'margin-left-xxl': undefined,
			'margin-top-general': '1',
			'margin-right-general': '1',
			'margin-bottom-general': '1',
			'margin-left-general': '1',
		};
		const secondRoundExpected = {
			'margin-top-xxl': undefined,
			'margin-right-xxl': undefined,
			'margin-bottom-xxl': undefined,
			'margin-left-xxl': undefined,
			'margin-top-general': '12',
			'margin-right-general': '12',
			'margin-bottom-general': '12',
			'margin-left-general': '12',
		};
		const thirdRoundExpected = {
			'margin-top-xxl': undefined,
			'margin-right-xxl': undefined,
			'margin-bottom-xxl': undefined,
			'margin-left-xxl': undefined,
			'margin-top-general': '123',
			'margin-right-general': '123',
			'margin-bottom-general': '123',
			'margin-left-general': '123',
		};

		expect(firstRoundResult).toStrictEqual(firstRoundExpected);
		expect(secondRoundResult).toStrictEqual(secondRoundExpected);
		expect(thirdRoundResult).toStrictEqual(thirdRoundExpected);
	});

	it('On first change attributes from XXL responsive and some of them have default general attribute value, and then changing from XL and from "M", all values correspond', () => {
		const firstRound = {
			obj: {
				'border-style-xxl': 'solid',
			},
			attributes: {},
			onChange,
		};

		const secondRound = {
			obj: {
				'border-style-xl': 'dashed',
			},
			attributes: {
				'border-style-general': 'solid',
			},
			onChange,
		};

		const thirdRound = {
			obj: {
				'border-style-general': 'dotted',
			},
			attributes: {
				'border-style-xxl': 'solid',
				'border-style-general': 'solid',
				'border-style-xl': 'dashed',
			},
			onChange,
		};

		const firstRoundResult = handleSetAttributes(firstRound);
		const secondRoundResult = handleSetAttributes(secondRound);
		const thirdRoundResult = handleSetAttributes(thirdRound);

		const firstRoundExpected = {
			'border-style-general': 'solid',
			'border-style-xxl': undefined,
		};
		const secondRoundExpected = {
			'border-style-xl': 'dashed',
		};
		const thirdRoundExpected = {
			'border-style-general': 'dotted',
			'border-style-m': undefined,
		};

		expect(firstRoundResult).toStrictEqual(firstRoundExpected);
		expect(secondRoundResult).toStrictEqual(secondRoundExpected);
		expect(thirdRoundResult).toStrictEqual(thirdRoundExpected);
	});

	it('On change attributes from base responsive, then from XL, reset it and reset from base again, everything come to default', () => {
		const firstRound = {
			obj: {
				'border-top-left-radius-general': 1,
			},
			attributes: {},
			onChange,
		};
		const secondRound = {
			obj: {
				'border-top-left-radius-general': 10,
			},
			attributes: {
				'border-top-left-radius-general': 1,
			},
			onChange,
		};
		const thirdRound = {
			obj: {
				'border-top-left-radius-general': 100,
			},
			attributes: {
				'border-top-left-radius-general': 10,
			},
			onChange,
		};

		const firstRoundResult = handleSetAttributes(firstRound);
		const secondRoundResult = handleSetAttributes(secondRound);
		const thirdRoundResult = handleSetAttributes(thirdRound);

		const firstRoundExpected = {
			'border-top-left-radius-general': 1,
		};
		const secondRoundExpected = {
			'border-top-left-radius-general': 10,
		};
		const thirdRoundExpected = {
			'border-top-left-radius-general': 100,
		};

		expect(firstRoundResult).toStrictEqual(firstRoundExpected);
		expect(secondRoundResult).toStrictEqual(secondRoundExpected);
		expect(thirdRoundResult).toStrictEqual(thirdRoundExpected);

		const firstRoundXL = {
			obj: {
				'border-top-left-radius-xl': 1,
			},
			attributes: {
				'border-top-left-radius-general': 100,
			},
			onChange,
		};
		const secondRoundXL = {
			obj: {
				'border-top-left-radius-xl': 15,
			},
			attributes: {
				'border-top-left-radius-general': 100,
				'border-top-left-radius-xl': 1,
			},
			onChange,
		};
		const thirdRoundXL = {
			obj: {
				'border-top-left-radius-xl': 150,
			},
			attributes: {
				'border-top-left-radius-general': 100,
				'border-top-left-radius-xl': 15,
			},
			onChange,
		};

		const firstRoundResultXL = handleSetAttributes(firstRoundXL);
		const secondRoundResultXL = handleSetAttributes(secondRoundXL);
		const thirdRoundResultXL = handleSetAttributes(thirdRoundXL);

		const firstRoundExpectedXL = {
			'border-top-left-radius-xl': 1,
		};
		const secondRoundExpectedXL = {
			'border-top-left-radius-xl': 15,
			'border-top-left-radius-m': undefined,
		};
		const thirdRoundExpectedXL = {
			'border-top-left-radius-xl': 150,
			'border-top-left-radius-m': undefined,
		};

		expect(firstRoundResultXL).toStrictEqual(firstRoundExpectedXL);
		expect(secondRoundResultXL).toStrictEqual(secondRoundExpectedXL);
		expect(thirdRoundResultXL).toStrictEqual(thirdRoundExpectedXL);
	});
});
