import handleSetAttributes from '../handleSetAttributes';

jest.mock('src/extensions/attributes/getDefaultAttribute.js', () =>
	jest.fn(() => undefined)
);
jest.mock('src/extensions/maxi-block/handleOnReset.js', () =>
	jest.fn(obj => obj)
);
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
							return ['test-g'];
						case 4:
							return ['test-g', 'test-xxl'];
						case 5:
							return ['test-xl'];
						case 6:
							return ['test-g', 'test-m'];
						case 7:
						case 8:
						case 9:
							return ['test-g'];
						case 10:
							return [];
						case 11:
							return ['test-xl'];
						case 12:
							return ['test-xl', 'test-m'];
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
				'test-xxl': '1',
			},
			attributes: {},
			onChange,
		};
		const secondRound = {
			obj: {
				'test-xxl': '12',
			},
			attributes: {
				'test-g': '1',
			},
			onChange,
		};
		const thirdRound = {
			obj: {
				'test-xxl': '123',
			},
			attributes: {
				'test-g': '12',
			},
			onChange,
		};

		const firstRoundResult = handleSetAttributes(firstRound);
		const secondRoundResult = handleSetAttributes(secondRound);
		const thirdRoundResult = handleSetAttributes(thirdRound);

		const firstRoundExpected = {
			'test-xxl': undefined,
			'test-g': '1',
		};
		const secondRoundExpected = {
			'test-xxl': undefined,
			'test-g': '12',
		};
		const thirdRoundExpected = {
			'test-xxl': undefined,
			'test-g': '123',
		};

		expect(firstRoundResult).toStrictEqual(firstRoundExpected);
		expect(secondRoundResult).toStrictEqual(secondRoundExpected);
		expect(thirdRoundResult).toStrictEqual(thirdRoundExpected);

		const resultAttrs = {
			...firstRound.attributes,
			...firstRoundResult,
			...secondRound.attributes,
			...secondRoundResult,
			...thirdRound.attributes,
			...thirdRoundResult,
		};

		const expectedAttrs = {
			'test-xxl': undefined,
			'test-g': '123',
		};

		expect(resultAttrs).toStrictEqual(expectedAttrs);
	});

	it('On first change attributes from XXL responsive and some of them have default general attribute value, and then changing from XL and from "M", all values correspond', () => {
		const firstRound = {
			obj: {
				'test-xxl': 'solid',
			},
			attributes: {},
			onChange,
		};
		const secondRound = {
			obj: {
				'test-xl': 'dashed',
			},
			attributes: {
				'test-g': 'solid',
				'test-xxl': undefined,
			},
			onChange,
		};
		const thirdRound = {
			obj: {
				'test-g': 'dotted',
			},
			attributes: {
				'test-xxl': undefined,
				'test-g': 'solid',
				'test-xl': 'dashed',
			},
			onChange,
		};

		const firstRoundResult = handleSetAttributes(firstRound);
		const secondRoundResult = handleSetAttributes(secondRound);
		const thirdRoundResult = handleSetAttributes(thirdRound);

		const firstRoundExpected = {
			'test-g': 'solid',
			'test-xxl': undefined,
		};
		const secondRoundExpected = {
			'test-xl': 'dashed',
			'test-m': 'solid',
		};
		const thirdRoundExpected = {
			'test-g': 'dotted',
			'test-m': 'dotted',
		};

		expect(firstRoundResult).toStrictEqual(firstRoundExpected);
		expect(secondRoundResult).toStrictEqual(secondRoundExpected);
		expect(thirdRoundResult).toStrictEqual(thirdRoundExpected);

		const resultAttrs = {
			...firstRound.attributes,
			...firstRoundResult,
			...secondRound.attributes,
			...secondRoundResult,
			...thirdRound.attributes,
			...thirdRoundResult,
		};

		const expectedAttrs = {
			'test-xxl': undefined,
			'test-g': 'dotted',
			'test-xl': 'dashed',
			'test-m': 'dotted',
		};

		expect(resultAttrs).toStrictEqual(expectedAttrs);
	});

	it('On change attributes from base responsive, then from XL, reset it and reset from base again, everything come to default', () => {
		const firstRound = {
			obj: {
				'test-g': 1,
			},
			attributes: {},
			onChange,
		};
		const secondRound = {
			obj: {
				'test-g': 10,
			},
			attributes: {
				'test-g': 1,
			},
			onChange,
		};
		const thirdRound = {
			obj: {
				'test-g': 100,
			},
			attributes: {
				'test-g': 10,
			},
			onChange,
		};

		const firstRoundResult = handleSetAttributes(firstRound);
		const secondRoundResult = handleSetAttributes(secondRound);
		const thirdRoundResult = handleSetAttributes(thirdRound);

		const firstRoundExpected = {
			'test-g': 1,
		};
		const secondRoundExpected = {
			'test-g': 10,
		};
		const thirdRoundExpected = {
			'test-g': 100,
		};

		expect(firstRoundResult).toStrictEqual(firstRoundExpected);
		expect(secondRoundResult).toStrictEqual(secondRoundExpected);
		expect(thirdRoundResult).toStrictEqual(thirdRoundExpected);

		const firstRoundXL = {
			obj: {
				'test-xl': 1,
			},
			attributes: {
				'test-g': 100,
			},
			onChange,
		};
		const secondRoundXL = {
			obj: {
				'test-xl': 15,
			},
			attributes: {
				'test-g': 100,
				'test-xl': 1,
			},
			onChange,
		};
		const thirdRoundXL = {
			obj: {
				'test-xl': 150,
			},
			attributes: {
				'test-g': 100,
				'test-xl': 15,
				'test-m': 100,
			},
			onChange,
		};

		const firstRoundResultXL = handleSetAttributes(firstRoundXL);
		const secondRoundResultXL = handleSetAttributes(secondRoundXL);
		const thirdRoundResultXL = handleSetAttributes(thirdRoundXL);

		const firstRoundExpectedXL = {
			'test-xl': 1,
			'test-m': 100,
		};
		const secondRoundExpectedXL = {
			'test-xl': 15,
			'test-m': 100,
		};
		const thirdRoundExpectedXL = {
			'test-xl': 150,
		};

		expect(firstRoundResultXL).toStrictEqual(firstRoundExpectedXL);
		expect(secondRoundResultXL).toStrictEqual(secondRoundExpectedXL);
		expect(thirdRoundResultXL).toStrictEqual(thirdRoundExpectedXL);

		const resultAttrs = {
			...firstRound.attributes,
			...firstRoundResult,
			...secondRound.attributes,
			...secondRoundResult,
			...thirdRound.attributes,
			...thirdRoundResult,
			...firstRoundXL.attributes,
			...firstRoundResultXL,
			...secondRoundXL.attributes,
			...secondRoundResultXL,
			...thirdRoundXL.attributes,
			...thirdRoundResultXL,
		};

		const expectedAttrs = {
			'test-g': 100,
			'test-xl': 150,
			'test-m': 100,
		};

		expect(resultAttrs).toStrictEqual(expectedAttrs);
	});

	it('Should not save isReset as an attribute', () => {
		const args = {
			obj: {
				isReset: true,
				'test-g': 1,
			},
			attributes: {
				'test-g': 0,
			},
			onChange,
		};

		const expectedAttrs = {
			'test-g': 1,
		};

		expect(handleSetAttributes(args)).toStrictEqual(expectedAttrs);
	});
});
