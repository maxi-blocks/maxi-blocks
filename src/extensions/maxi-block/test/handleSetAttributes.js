import handleSetAttributes from '@extensions/maxi-block/handleSetAttributes';

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => undefined)
);
jest.mock('src/extensions/attributes/handleOnReset.js', () =>
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
							return {
								prevSavedAttrsClientId: null,
								prevSavedAttrs: [],
							};
						case 2:
						case 3:
							return {
								prevSavedAttrsClientId: null,
								prevSavedAttrs: ['test-general'],
							};
						case 4:
							return {
								prevSavedAttrsClientId: null,
								prevSavedAttrs: ['test-general', 'test-xxl'],
							};
						case 5:
							return {
								prevSavedAttrsClientId: null,
								prevSavedAttrs: ['test-xl'],
							};
						case 6:
							return {
								prevSavedAttrsClientId: null,
								prevSavedAttrs: ['test-general', 'test-m'],
							};
						case 7:
						case 8:
						case 9:
							return {
								prevSavedAttrsClientId: null,
								prevSavedAttrs: ['test-general'],
							};
						case 10:
							return {
								prevSavedAttrsClientId: null,
								prevSavedAttrs: [],
							};
						case 11:
							return {
								prevSavedAttrsClientId: null,
								prevSavedAttrs: ['test-xl'],
							};
						case 12:
							return {
								prevSavedAttrsClientId: null,
								prevSavedAttrs: ['test-xl', 'test-m'],
							};
						default:
							return {
								prevSavedAttrsClientId: null,
								prevSavedAttrs: [],
							};
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
				'test-general': '1',
			},
			onChange,
		};
		const thirdRound = {
			obj: {
				'test-xxl': '123',
			},
			attributes: {
				'test-general': '12',
			},
			onChange,
		};

		const firstRoundResult = handleSetAttributes(firstRound);
		const secondRoundResult = handleSetAttributes(secondRound);
		const thirdRoundResult = handleSetAttributes(thirdRound);

		const firstRoundExpected = {
			'test-general': '1',
			'test-l': '1',
			'test-m': '1',
			'test-xl': '1',
			'test-xxl': '1',
		};
		const secondRoundExpected = {
			'test-xxl': '12',
			'test-general': '12',
			'test-l': '12',
			'test-m': '12',
			'test-xl': '12',
		};
		const thirdRoundExpected = {
			'test-xxl': '123',
			'test-general': '123',
			'test-l': '123',
			'test-m': '123',
			'test-xl': '123',
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
			'test-xxl': '123',
			'test-general': '123',
			'test-l': '123',
			'test-m': '123',
			'test-xl': '123',
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
				'test-general': 'solid',
				'test-l': 'solid',
				'test-m': 'solid',
				'test-xl': 'solid',
				'test-xxl': 'solid',
			},
			onChange,
		};
		const thirdRound = {
			obj: {
				'test-general': 'dotted',
			},
			attributes: {
				'test-xxl': undefined,
				'test-general': 'solid',
				'test-xl': 'dashed',
			},
			onChange,
		};

		const firstRoundResult = handleSetAttributes(firstRound);
		const secondRoundResult = handleSetAttributes(secondRound);
		const thirdRoundResult = handleSetAttributes(thirdRound);

		const firstRoundExpected = {
			'test-general': 'solid',
			'test-l': 'solid',
			'test-m': 'solid',
			'test-xl': 'solid',
			'test-xxl': 'solid',
		};
		const secondRoundExpected = {
			'test-xl': 'dashed',
			'test-m': 'dashed',
			'test-l': 'dashed',
			'test-general': 'dashed',
		};
		const thirdRoundExpected = {
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
			'test-l': 'dashed',
			'test-general': 'solid',
			'test-xl': 'dashed',
			'test-m': 'dotted',
		};

		expect(resultAttrs).toStrictEqual(expectedAttrs);
	});

	it('On change attributes from base responsive, then from XL, reset it and reset from base again, everything come to default', () => {
		const firstRound = {
			obj: {
				'test-general': 1,
			},
			attributes: {},
			onChange,
		};
		const secondRound = {
			obj: {
				'test-general': 10,
			},
			attributes: {
				'test-general': 1,
			},
			onChange,
		};
		const thirdRound = {
			obj: {
				'test-general': 100,
			},
			attributes: {
				'test-general': 10,
			},
			onChange,
		};

		const firstRoundResult = handleSetAttributes(firstRound);
		const secondRoundResult = handleSetAttributes(secondRound);
		const thirdRoundResult = handleSetAttributes(thirdRound);

		const firstRoundExpected = {
			'test-m': 1,
		};
		const secondRoundExpected = {
			'test-m': 10,
		};
		const thirdRoundExpected = {
			'test-m': 100,
		};

		expect(firstRoundResult).toStrictEqual(firstRoundExpected);
		expect(secondRoundResult).toStrictEqual(secondRoundExpected);
		expect(thirdRoundResult).toStrictEqual(thirdRoundExpected);

		const firstRoundXL = {
			obj: {
				'test-xl': 1,
			},
			attributes: {
				'test-general': 100,
			},
			onChange,
		};
		const secondRoundXL = {
			obj: {
				'test-xl': 15,
			},
			attributes: {
				'test-general': 100,
				'test-xl': 1,
			},
			onChange,
		};
		const thirdRoundXL = {
			obj: {
				'test-xl': 150,
			},
			attributes: {
				'test-general': 100,
				'test-xl': 15,
				'test-m': 100,
			},
			onChange,
		};

		const firstRoundResultXL = handleSetAttributes(firstRoundXL);
		const secondRoundResultXL = handleSetAttributes(secondRoundXL);
		const thirdRoundResultXL = handleSetAttributes(thirdRoundXL);

		const firstRoundExpectedXL = {
			'test-l': 1,
			'test-m': 1,
			'test-xl': 1,
		};
		const secondRoundExpectedXL = {
			'test-xl': 15,
			'test-m': 100,
		};
		const thirdRoundExpectedXL = {
			'test-m': 100,
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
			'test-general': 100,
			'test-l': 1,
			'test-xl': 150,
			'test-m': 100,
		};

		expect(resultAttrs).toStrictEqual(expectedAttrs);
	});

	it('Should not save isReset as an attribute', () => {
		const args = {
			obj: {
				isReset: true,
				'test-general': 1,
			},
			attributes: {
				'test-general': 0,
			},
			onChange,
		};

		const expectedAttrs = {
			'test-m': 1,
		};

		expect(handleSetAttributes(args)).toStrictEqual(expectedAttrs);
	});
});
