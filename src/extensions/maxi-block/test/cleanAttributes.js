import cleanAttributes from '../cleanAttributes';

jest.mock('src/extensions/attributes/getDefaultAttribute.js', () =>
	jest.fn(attr =>
		attr === 'attribute-with-default-value-hover' ? true : undefined
	)
);
jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				receiveBaseBreakpoint: jest.fn(() => 'm'),
				receiveMaxiDeviceType: jest.fn(() => 'g'),
				getPrevSavedAttrs: jest.fn(() => []),
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
		createReduxStore: jest.fn(),
		register: jest.fn(),
		dispatch: jest.fn(() => {
			return { savePrevSavedAttrs: jest.fn() };
		}),
	};
});
import { select } from '@wordpress/data';

describe('cleanAttributes', () => {
	it('Should flat the entry object with same value for same attribute with different breakpoints, and just return general one', () => {
		const obj = {
			newAttributes: {
				'test-g': 10,
				'test-xl': 10,
			},
			attributes: {
				'test-g': 11,
				'test-xl': 11,
			},
			defaultAttributes: {},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': 10,
			'test-xl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return M value as default, as is equal as its closest valid attribute (general)', () => {
		const obj = {
			newAttributes: {
				'test-m': 100,
			},

			attributes: {
				'test-g': 100,
				'test-m': 99,
			},
			defaultAttributes: {},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return M value as default, as is equal as its closest valid attribute (l)', () => {
		const newAttributes = {
			'test-m': 99,
		};

		const attributes = {
			'test-g': 100,
			'test-l': 99,
			'test-m': 98,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes: {},
		});
		const expectedResult = {
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return XXL value as default, as is equal as its closest valid attribute (general)', () => {
		const newAttributes = {
			'test-xxl': 100,
		};

		const attributes = {
			'test-g': 100,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes: {},
		});

		const expectedResult = {
			'test-xxl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return L value as default, as is equal as its general saving attribute (general)', () => {
		const newAttributes = {
			'test-g': 100,
		};

		const attributes = {
			'test-g': 99,
			'test-l': 100,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes: {},
		});
		const expectedResult = {
			'test-g': 100,
			'test-l': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should return XXL value as default, as is equal as its general saving attribute (general)', () => {
		const newAttributes = {
			'test-g': 100,
		};

		const attributes = {
			'test-g': 99,
			'test-xxl': 100,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes: {},
		});
		const expectedResult = {
			'test-g': 100,
			'test-xxl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Color layer object with defaultAttributes object', () => {
		const newAttributes = {
			'test-status-m': true,
			'test-m': 4,
		};
		const attributes = {
			'test-status-g': true,
			'test-g': 4,

			'test-m': 7,
			'test-status-m': true,
		};
		const defaultAttributes = {
			'test-status-g': true,
			'test-g': 4,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes,
		});
		const expectedResult = {
			'test-status-m': undefined,
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing general attribute, if coincide with winBreakpoint, it should overwrite it', () => {
		const obj = {
			newAttributes: {
				'test-status-g': true,
				'test-g': 4,
				'test-opacity-g': 1,
			},
			attributes: {
				'test-status-g': true,
				'test-g': 4,
				'test-status-m': true,
				'test-opacity-m': 1,
				'test-m': 8,
				'test-opacity-g': 1,
			},
			defaultAttributes: {},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-status-g': true,
			'test-g': 4,
			'test-m': undefined,
			'test-opacity-g': 1,
			'test-status-m': undefined,
			'test-opacity-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing general attribute, if there is a smaller breakpoint with same value, it should be returned to its default', () => {
		const obj = {
			'test-g': 8,
		};
		const attributes = {
			'test-status-g': true,
			'test-g': 5,

			'test-m': 8,
		};
		const defaultAttributes = {
			'test-status-g': true,
			'test-g': 5,
		};

		const result = cleanAttributes({
			newAttributes: obj,
			attributes,
			defaultAttributes,
		});

		const expectedResult = {
			'test-g': 8,
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing general attribute, if there is a smaller breakpoint with same value, it should be returned to its default - 2', () => {
		const obj = {
			newAttributes: {
				'test-g': 7,
				'test-m': 7,
			},
			attributes: {
				'test-g': 4,
				'test-m': 8,
			},
			defaultAttributes: {
				'test-g': 4,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': 7,
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On changing S attribute to the same than XS, having different attributes for general and XS, XS should disappear', () => {
		const newAttributes = {
			'test-status-s': true,
			'test-s': 8,
		};
		const attributes = {
			'test-status-g': true,
			'test-g': 4,
			'test-status-xs': true,
			'test-xs': 8,
		};
		const defaultAttributes = {
			'test-status-g': true,
			'test-g': 4,
		};

		const result = cleanAttributes({
			newAttributes,
			attributes,
			defaultAttributes,
		});

		const expectedResult = {
			'test-s': 8,
			'test-xs': undefined,
			'test-status-s': undefined,
			'test-status-xs': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('With a General value equal to M value, and a different value on XL, when resetting XL, M should be replaced with default', () => {
		const obj = {
			newAttributes: {
				'test-l': undefined,
			},
			attributes: {
				'test-g': 2,
				'test-l': 4,
				'test-m': 2,
			},
			defaultAttributes: {
				'test-g': 2,
			},
		};

		const expectedResult = {
			'test-l': undefined,
			'test-m': undefined,
		};

		const result = cleanAttributes(obj);

		expect(expectedResult).toStrictEqual(result);
	});

	it('On changing general value by one and on crossing the same values on smaller breakpoints, if general value change stopped not on the same values as smaller breakpoints, smaller breakpoints should be returned to previous value', () => {
		let i = 0;
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'xl'),
					getSelectedBlockCount: jest.fn(() => 1),
					getPrevSavedAttrs: jest.fn(() => {
						i += 1;
						switch (i) {
							case 2:
								return ['test-g'];
							case 3:
								return ['test-g', 'test-l'];
							case 1:
							default:
								return [];
						}
					}),
				};
			})
		);

		const firstRound = {
			newAttributes: {
				'test-g': 3,
			},
			attributes: {
				'test-g': undefined,
				'test-l': 4,
			},
		};
		const secondRound = {
			newAttributes: {
				'test-g': 4,
			},
			attributes: {
				'test-g': 3,
				'test-l': 4,
			},
		};
		const thirdRound = {
			newAttributes: {
				'test-g': 5,
			},
			attributes: {
				'test-g': 4,
				'test-l': undefined,
			},
		};

		const resultFirstRound = cleanAttributes(firstRound);
		const resultSecondRound = cleanAttributes(secondRound);
		const resultThirdRound = cleanAttributes(thirdRound);

		const expectedFirstRound = {
			'test-g': 3,
		};
		const expectedSecondRound = {
			'test-g': 4,
			'test-l': undefined,
		};
		const expectedThirdRound = {
			'test-g': 5,
			'test-l': 4,
		};

		expect(resultFirstRound).toStrictEqual(expectedFirstRound);
		expect(resultSecondRound).toStrictEqual(expectedSecondRound);
		expect(resultThirdRound).toStrictEqual(expectedThirdRound);
	});

	it('On changing general obj value by one and on crossing the same obj values on smaller breakpoints, if general obj value change stopped not on the same values as smaller breakpoints, smaller breakpoints should be returned to previous value', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const firstRound = {
			newAttributes: {
				'test-g': {
					normal: {
						numberWhichIsChanging: 3,
						keyOfUndefined: undefined,
					},
					hover: {
						numberWhichIsNotChanging: 1,
					},
				},
			},
			attributes: {
				'test-g': undefined,
				'test-l': {
					normal: {
						numberWhichIsChanging: 4,
						keyOfUndefined: undefined,
					},
					hover: {
						numberWhichIsNotChanging: 1,
					},
				},
			},
		};
		const secondRound = {
			newAttributes: {
				'test-g': {
					normal: {
						numberWhichIsChanging: 4,
						keyOfUndefined: undefined,
					},
					hover: {
						numberWhichIsNotChanging: 1,
					},
				},
			},
			attributes: {
				'test-g': {
					normal: {
						numberWhichIsChanging: 3,
						keyOfUndefined: undefined,
					},
					hover: {
						numberWhichIsNotChanging: 1,
					},
				},
				'test-l': {
					normal: {
						numberWhichIsChanging: 4,
						keyOfUndefined: undefined,
					},
					hover: {
						numberWhichIsNotChanging: 1,
					},
				},
			},
		};
		const thirdRound = {
			newAttributes: {
				'test-g': {
					normal: {
						numberWhichIsChanging: 5,
						keyOfUndefined: undefined,
					},
					hover: {
						numberWhichIsNotChanging: 1,
					},
				},
			},
			attributes: {
				'test-g': {
					normal: {
						numberWhichIsChanging: 4,
						keyOfUndefined: undefined,
					},
					hover: {
						numberWhichIsNotChanging: 1,
					},
				},
				'test-l': undefined,
			},
		};

		const resultFirstRound = cleanAttributes(firstRound);
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveMaxiDeviceType: jest.fn(() => 'xl'),
					getSelectedBlockCount: jest.fn(() => 1),
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					getPrevSavedAttrs: jest.fn(() => ['test-g', 'test-l']),
				};
			})
		);
		const resultSecondRound = cleanAttributes(secondRound);
		const resultThirdRound = cleanAttributes(thirdRound);

		const expectedFirstRound = {
			'test-g': {
				normal: {
					numberWhichIsChanging: 3,
					keyOfUndefined: undefined,
				},
				hover: {
					numberWhichIsNotChanging: 1,
				},
			},
		};
		const expectedSecondRound = {
			'test-g': {
				normal: {
					numberWhichIsChanging: 4,
					keyOfUndefined: undefined,
				},
				hover: {
					numberWhichIsNotChanging: 1,
				},
			},
			'test-l': undefined,
		};
		const expectedThirdRound = {
			'test-g': {
				normal: {
					numberWhichIsChanging: 5,
					keyOfUndefined: undefined,
				},
				hover: {
					numberWhichIsNotChanging: 1,
				},
			},
			'test-l': {
				normal: {
					numberWhichIsChanging: 4,
					keyOfUndefined: undefined,
				},
				hover: {
					numberWhichIsNotChanging: 1,
				},
			},
		};

		expect(resultFirstRound).toStrictEqual(expectedFirstRound);
		expect(resultSecondRound).toStrictEqual(expectedSecondRound);
		expect(resultThirdRound).toStrictEqual(expectedThirdRound);
	});

	it('On changing general value by one and on crossing the same values on smaller and higher breakpoints, if general value change stopped not on the same values as other breakpoints, they breakpoints should be returned to previous value', () => {
		let i = 0;
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveMaxiDeviceType: jest.fn(() => 'xl'),
					getSelectedBlockCount: jest.fn(() => 1),
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					getPrevSavedAttrs: jest.fn(() => {
						i += 1;
						switch (i) {
							case 2:
								return ['test-g'];
							case 3:
								return ['test-g', 'test-l', 'test-xxl'];
							case 1:
							default:
								return [];
						}
					}),
				};
			})
		);

		const firstRound = {
			newAttributes: {
				'test-g': 3,
			},
			attributes: {
				'test-g': undefined,
				'test-xxl': 4,
				'test-l': 4,
			},
		};
		const secondRound = {
			newAttributes: {
				'test-g': 4,
			},
			attributes: {
				'test-g': 3,
				'test-xxl': 4,
				'test-l': 4,
			},
		};
		const thirdRound = {
			newAttributes: {
				'test-g': 5,
			},
			attributes: {
				'test-g': 4,
				'test-xxl': undefined,
				'test-l': undefined,
			},
		};

		const resultFirstRound = cleanAttributes(firstRound);
		const resultSecondRound = cleanAttributes(secondRound);
		const resultThirdRound = cleanAttributes(thirdRound);

		const expectedFirstRound = {
			'test-g': 3,
		};
		const expectedSecondRound = {
			'test-g': 4,
			'test-xxl': undefined,
			'test-l': undefined,
		};
		const expectedThirdRound = {
			'test-g': 5,
			'test-xxl': 4,
			'test-l': 4,
		};

		expect(resultFirstRound).toStrictEqual(expectedFirstRound);
		expect(resultSecondRound).toStrictEqual(expectedSecondRound);
		expect(resultThirdRound).toStrictEqual(expectedThirdRound);
	});

	it('On changing XL value by one and on crossing the same values with general breakpoint, if XL value change stopped not on the same values as smaller breakpoints, general value should be returned to previous', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'm'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const firstRound = {
			newAttributes: {
				'test-xl': 3,
			},
			attributes: {
				'test-g': 4,
				'test-xl': undefined,
			},
		};
		const secondRound = {
			newAttributes: {
				'test-xl': 4,
			},
			attributes: {
				'test-g': 4,
				'test-m': 4,
				'test-xl': 3,
			},
		};
		const thirdRound = {
			newAttributes: {
				'test-xl': 5,
			},
			attributes: {
				'test-g': 4,
				'test-m': undefined,
				'test-xl': undefined,
			},
		};

		const resultFirstRound = cleanAttributes(firstRound);
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveMaxiDeviceType: jest.fn(() => 'xl'),
					getSelectedBlockCount: jest.fn(() => 1),
					receiveBaseBreakpoint: jest.fn(() => 'm'),
					getPrevSavedAttrs: jest.fn(() => ['test-xl', 'test-m']),
				};
			})
		);
		const resultSecondRound = cleanAttributes(secondRound);
		const resultThirdRound = cleanAttributes(thirdRound);

		const expectedFirstRound = {
			'test-m': 4,
			'test-xl': 3,
		};
		const expectedSecondRound = {
			'test-m': undefined,
			'test-xl': undefined,
		};
		const expectedThirdRound = {
			'test-m': 4,
			'test-xl': 5,
		};

		expect(resultFirstRound).toStrictEqual(expectedFirstRound);
		expect(resultSecondRound).toStrictEqual(expectedSecondRound);
		expect(resultThirdRound).toStrictEqual(expectedThirdRound);
	});

	it('On changing M value by one and on crossing the same values with S breakpoint and also when we have values on other bps, if M value change stopped not on the same values as smaller breakpoints, S value should be returned to previous', () => {
		let i = 0;
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveMaxiDeviceType: jest.fn(() => 'xl'),
					getSelectedBlockCount: jest.fn(() => 1),
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					getPrevSavedAttrs: jest.fn(() => {
						i += 1;
						switch (i) {
							case 2:
								return ['test-m'];
							case 3:
								return ['test-m', 'test-s'];
							case 1:
							default:
								return [];
						}
					}),
				};
			})
		);

		const firstRound = {
			newAttributes: {
				'test-m': 3,
			},
			attributes: {
				'test-xl': 10,
				'test-s': 4,
				'test-xs': 1,
			},
		};
		const secondRound = {
			newAttributes: {
				'test-m': 4,
			},
			attributes: {
				'test-xl': 10,
				'test-m': 3,
				'test-s': 4,
				'test-xs': 1,
			},
		};
		const thirdRound = {
			newAttributes: {
				'test-m': 5,
			},
			attributes: {
				'test-xl': 10,
				'test-m': 4,
				'test-s': undefined,
				'test-xs': 1,
			},
		};

		const resultFirstRound = cleanAttributes(firstRound);
		const resultSecondRound = cleanAttributes(secondRound);
		const resultThirdRound = cleanAttributes(thirdRound);

		const expectedFirstRound = {
			'test-m': 3,
		};
		const expectedSecondRound = {
			'test-m': 4,
			'test-s': undefined,
		};
		const expectedThirdRound = {
			'test-m': 5,
			'test-s': 4,
		};

		expect(resultFirstRound).toStrictEqual(expectedFirstRound);
		expect(resultSecondRound).toStrictEqual(expectedSecondRound);
		expect(resultThirdRound).toStrictEqual(expectedThirdRound);
	});

	it('On typing general value by one digit and on crossing the same values on smaller breakpoints, if general value change stopped not on the same values as smaller breakpoints, smaller breakpoints should be returned to previous value', () => {
		let i = 0;
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveMaxiDeviceType: jest.fn(() => 'xl'),
					getSelectedBlockCount: jest.fn(() => 1),
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					getPrevSavedAttrs: jest.fn(() => {
						i += 1;
						switch (i) {
							case 2:
								return ['test-g'];
							case 3:
								return ['test-g', 'test-l'];
							case 1:
							default:
								return [];
						}
					}),
				};
			})
		);

		const firstRound = {
			newAttributes: {
				'test-g': 4,
			},
			attributes: {
				'test-g': undefined,
				'test-l': 40,
			},
		};
		const secondRound = {
			newAttributes: {
				'test-g': 40,
			},
			attributes: {
				'test-g': 4,
				'test-l': 40,
			},
		};
		const thirdRound = {
			newAttributes: {
				'test-g': 400,
			},
			attributes: {
				'test-g': 40,
				'test-l': undefined,
			},
		};

		const resultFirstRound = cleanAttributes(firstRound);
		const resultSecondRound = cleanAttributes(secondRound);
		const resultThirdRound = cleanAttributes(thirdRound);

		const expectedFirstRound = {
			'test-g': 4,
		};
		const expectedSecondRound = {
			'test-g': 40,
			'test-l': undefined,
		};
		const expectedThirdRound = {
			'test-g': 400,
			'test-l': 40,
		};

		expect(resultFirstRound).toStrictEqual(expectedFirstRound);
		expect(resultSecondRound).toStrictEqual(expectedSecondRound);
		expect(resultThirdRound).toStrictEqual(expectedThirdRound);
	});

	it('Random test', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'l'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const firstRound = {
			newAttributes: {
				'test-xl': 3,
			},
			attributes: {
				'test-g': 1,
			},
			defaultAttributes: {
				'test-g': 1,
			},
		};
		const secondRound = {
			newAttributes: {
				'test-g': 4,
				'test-l': 4,
			},
			attributes: {
				'test-xl': 3,
				'test-g': 1,
			},
			defaultAttributes: {
				'test-g': 1,
			},
		};

		const resultFirstRound = cleanAttributes(firstRound);
		const resultSecondRound = cleanAttributes(secondRound);

		// Change winBreakpoint to M
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'm'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const thirdRound = {
			newAttributes: {
				'test-l': 4,
			},
			attributes: {
				'test-xl': 3,
				'test-g': 4,
			},
			defaultAttributes: {
				'test-g': 1,
			},
		};

		const resultThirdRound = cleanAttributes(thirdRound);

		const expectedFirstRound = {
			'test-xl': 3,
			'test-l': 1,
		};
		const expectedSecondRound = {
			'test-g': 4,
			'test-l': 4,
		};
		const expectedThirdRound = {
			'test-l': 4,
			// 'test-m': 4, //! !
		};

		expect(resultFirstRound).toStrictEqual(expectedFirstRound);
		expect(resultSecondRound).toStrictEqual(expectedSecondRound);
		expect(resultThirdRound).toStrictEqual(expectedThirdRound);

		const resultAttrs = {
			...firstRound.attributes,
			...resultFirstRound,
			...secondRound.attributes,
			...resultSecondRound,
			...thirdRound.attributes,
			...resultThirdRound,
		};

		const expectedResult = {
			'test-xl': 3,
			'test-g': 4,
			'test-l': 4,
			// 'test-m': 4,
		};

		expect(resultAttrs).toStrictEqual(expectedResult);
	});

	it('Random test 2', () => {
		// Change winBreakpoint to M
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'l'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'border-palette-color-g': 2,
			},
			attributes: {
				'border-palette-color-g': 2,
				'border-palette-color-l': 4,
				'border-palette-color-m': 5,
			},
			defaultAttributes: {},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'border-palette-color-g': 2,
			'border-palette-color-l': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 3', () => {
		const obj = {
			newAttributes: {
				'background-palette-color-g': 4,
			},
			attributes: {
				'background-palette-color-g': 1,
				'background-palette-color-l': 4,
			},

			defaultAttributes: {
				'background-palette-color-g': 1,
				// 'background-palette-color-l': 4,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'background-palette-color-g': 4,
			'background-palette-color-l': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Saving an attribute higher than winBase, when winBase attribute is default, return the new attribute value and sets g value to winBase attribute', () => {
		// Change winBreakpoint to M
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'm'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-l': 4,
			},
			attributes: {
				'test-g': 1,
			},
			defaultAttributes: {
				'test-g': 1,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-l': 4,
			'test-m': 1,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 4', () => {
		const obj = {
			newAttributes: {
				'border-palette-opacity-s': 0.45,
			},
			attributes: {
				'border-palette-opacity-g': 0.45,
			},
			defaultAttributes: {
				'border-palette-opacity-g': 100,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'border-palette-opacity-s': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('On change general attribute, if default base breakpoint attribute exist', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-g': 'em',
				'test-xl': 'em',
			},
			attributes: {
				'test-g': undefined,
				'test-xl': 'px',
			},
			defaultAttributes: {
				'test-g': undefined,
				'test-xl': 'px',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': 'em',
			'test-xl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 6', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'l'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-g': 'em',
				'test-l': 'em',
			},
			attributes: {
				'text-xxl': 'vw',
				'test-g': undefined,
				'test-xl': 'px',
				'test-l': '%',
			},
			defaultAttributes: {
				'test-g': undefined,
				'test-xl': 'px',
				'text-l': '%',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': 'em',
			'test-l': 'em',
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 7', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-g': 'em',
				'test-xl': 'em',
			},
			attributes: {
				'text-xxl': 'px',
				'test-g': undefined,
				'test-xl': 'px',
				'test-l': '%',
			},
			defaultAttributes: {
				'test-xxl': 'px',
				'test-g': undefined,
				'test-xl': 'px',
				'text-l': '%',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': 'em',
			'test-xl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 8', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-g': '15',
				'test-xxl': '23',
			},
			attributes: {
				'test-g': '15',
				'test-xxl': '23',
			},
			defaultAttributes: {
				'test-g': '15',
				'test-xxl': '23',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': '15',
			'test-xxl': '23',
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 9 (typical SC typography case)', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => [
						'test-g',
						'test-m',
						'test-xxl',
						'test-xl',
					]),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-g': 20,
				'test-m': 20,
				'test-xxl': 24,
				'test-xl': 16,
			},
			attributes: {
				'test-g': 20,
				'test-xxl': 24,
				'test-m': 2,
				'test-xl': undefined,
			},
			defaultAttributes: {
				'test-g': 16,
				'test-xxl': 24,
				'test-xl': 16,
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': 20,
			'test-xxl': 24,
			'test-xl': 16,
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 10', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-g': '%',
				'test-xl': '%',
			},
			attributes: {
				'test-g': undefined,
				'test-l': '%',
				'test-xl': 'px',
				'test-xxl': 'px',
			},
			defaultAttributes: {
				'test-g': undefined,
				'test-l': '%',
				'test-xl': 'px',
				'test-xxl': 'px',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': '%',
			'test-xl': undefined,
			'test-l': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 11', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-xxl': '%',
				'test-xl': '%',
			},
			attributes: {
				'test-g': '%',
				'test-xxl': 'px',
				'test-xl': undefined,
				'test-l': undefined,
			},
			defaultAttributes: {
				'test-g': undefined,
				'test-l': '%',
				'test-xl': 'px',
				'test-xxl': 'px',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-xxl': undefined,
			'test-xl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 12', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: { 'test-g': 'full' },
			attributes: {
				'test-g': 'normal',
				'test-xxl': 'full',
			},
			defaultAttributes: {
				'test-g': 'normal',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': 'full',
			'test-xxl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 13', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-g': undefined,
				'test-xl': '1170',
			},
			attributes: {
				'test-g': 100,
				'test-xl': undefined,
			},
			defaultAttributes: {
				'test-g': undefined,
				'test-xl': '1170',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': undefined,
			'test-xl': '1170',
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 14', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-g': undefined,
				'test-xl': '1170',
			},
			attributes: {
				'test-g': undefined,
				'test-xl': undefined,
			},
			defaultAttributes: {
				'test-g': undefined,
				'test-xl': '1170',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': undefined,
			'test-xl': '1170',
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 15', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-xxl': 'none',
				'test-xl': 'none',
			},
			attributes: {
				'test-g': 'none',
				'test-xxl': 'axis',
			},
			defaultAttributes: {
				'test-g': 'axis',
				'test-xxl': 'axis',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-xxl': undefined,
			'test-xl': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Random test 16', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveBaseBreakpoint: jest.fn(() => 'xl'),
					receiveMaxiDeviceType: jest.fn(() => 'g'),
					getPrevSavedAttrs: jest.fn(() => []),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);

		const obj = {
			newAttributes: {
				'test-m': undefined,
			},
			attributes: {
				'test-g': '5',
				'test-xl': undefined,
				'test-xxl': '23',
			},
			defaultAttributes: {
				'test-xl': '15',
				'test-xxl': '23',
			},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-m': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should save hover attribute same as normal one as undefined', () => {
		const obj = {
			newAttributes: {
				'test-g-hover': '5',
			},
			attributes: {
				'test-g': '5',
				'test-g-hover': '4',
			},
			defaultAttributes: {},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g-hover': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should delete hover attribute same as normal one', () => {
		const obj = {
			newAttributes: {
				'test-g': '4',
			},
			attributes: {
				'test-g': '5',
				'test-g-hover': '4',
			},
			defaultAttributes: {},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g': '4',
			'test-g-hover': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should save responsive hover attributes same as general as undefined', () => {
		const obj = {
			newAttributes: {
				'test-s-hover': '4',
			},
			attributes: {
				'test-g': '5',
				'test-g-hover': '4',
				'test-s-hover': '3',
			},
			defaultAttributes: {},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-s-hover': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should delete responsive hover attributes same as general', () => {
		const obj = {
			newAttributes: {
				'test-g-hover': '3',
			},
			attributes: {
				'test-g': '5',
				'test-g-hover': '4',
				'test-s-hover': '3',
			},
			defaultAttributes: {},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'test-g-hover': '3',
			'test-s-hover': undefined,
		};

		expect(result).toStrictEqual(expectedResult);
	});

	it('Should not delete hover attributes if they have default value', () => {
		const obj = {
			newAttributes: {
				'attribute-with-default-value-hover': 3,
			},
			attributes: {
				'attribute-with-default-value': 3,
			},
			defaultAttributes: {},
		};

		const result = cleanAttributes(obj);

		const expectedResult = {
			'attribute-with-default-value-hover': 3,
		};

		expect(result).toStrictEqual(expectedResult);
	});
});
