import {
	applySCBlockDefaultsToAttributes,
	debugSCBlockDefaults,
	getBlockDefaultKey,
	getSCBlockDefaultsExcludedAttributesUpdate,
	getStyleCardBlockDefaultVariables,
	isSCBlockDefaultsDebugEnabled,
	SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES,
	setActiveStyleCardValueForBlockDefaults,
} from '@extensions/style-cards/blockDefaults';

const sizeDefaults = {
	'max-width-xl': {},
	'max-width-unit-xl': {
		default: 'px',
	},
	'full-width-xl': {
		default: false,
	},
	'width-fit-content-xl': {
		default: false,
	},
	'width-xl': {},
	'width-unit-xl': {
		default: 'px',
	},
};

const layoutDefaults = {
	...sizeDefaults,
	'padding-top-general': {},
	'padding-top-unit-general': {
		default: 'px',
	},
	'padding-top-xxl': {},
	'padding-top-unit-xxl': {
		default: 'px',
	},
	'padding-top-xl': {},
	'padding-top-unit-xl': {
		default: 'px',
	},
	'padding-top-s': {},
	'padding-top-unit-s': {
		default: 'px',
	},
	'padding-top-xs': {},
	'padding-top-unit-xs': {
		default: 'px',
	},
	'padding-bottom-general': {},
	'padding-bottom-unit-general': {
		default: 'px',
	},
	'padding-bottom-xxl': {},
	'padding-bottom-unit-xxl': {
		default: 'px',
	},
	'padding-bottom-xl': {},
	'padding-bottom-unit-xl': {
		default: 'px',
	},
	'padding-bottom-s': {},
	'padding-bottom-unit-s': {
		default: 'px',
	},
	'padding-bottom-xs': {},
	'padding-bottom-unit-xs': {
		default: 'px',
	},
	'column-gap-m': {},
	'column-gap-unit-m': {
		default: '%',
	},
	'row-gap-general': {},
	'row-gap-unit-general': {
		default: 'px',
	},
	'row-gap-xs': {},
	'row-gap-unit-xs': {
		default: 'px',
	},
	'column-gap-general': {},
	'column-gap-unit-general': {
		default: '%',
	},
	'column-gap-s': {},
	'column-gap-unit-s': {
		default: '%',
	},
	'column-gap-xs': {},
	'column-gap-unit-xs': {
		default: '%',
	},
	'flex-wrap-general': {},
};

const getStyleCard = blockDefaults => ({
	light: {
		defaultStyleCard: {
			blockDefaults: {},
		},
		styleCard: {
			blockDefaults,
		},
	},
	dark: {
		defaultStyleCard: {
			blockDefaults: {},
		},
		styleCard: {
			blockDefaults: {},
		},
	},
});

describe('Style Card block defaults', () => {
	afterEach(() => {
		setActiveStyleCardValueForBlockDefaults(null);
		delete window.maxiDebugSCBlockDefaults;
		delete window.maxiDebugSCBlockDefaultsVerbose;
		delete window.maxiSCBlockDefaultsDebugLog;
		delete window.getMaxiSCBlockDefaultsDebugLog;
		window.localStorage?.removeItem('maxiDebugSCBlockDefaults');
		window.localStorage?.removeItem('maxiDebugSCBlockDefaultsVerbose');
		window.history.pushState({}, '', '/');
	});

	it('keeps debug logging opt-in', () => {
		expect(isSCBlockDefaultsDebugEnabled()).toBe(false);
		debugSCBlockDefaults('test', { value: 1 });
		expect(console).not.toHaveInformed();

		window.maxiDebugSCBlockDefaults = true;

		expect(isSCBlockDefaultsDebugEnabled()).toBe(true);
		debugSCBlockDefaults('test', { value: 1 });
		expect(console).toHaveInformedWith('[SC block defaults] test', {
			value: 1,
		});
		expect(window.maxiSCBlockDefaultsDebugLog).toEqual([
			expect.objectContaining({
				label: 'test',
				payload: {
					value: 1,
				},
			}),
		]);
		expect(window.getMaxiSCBlockDefaultsDebugLog()).toBe(
			window.maxiSCBlockDefaultsDebugLog
		);
	});

	it('enables debug logging automatically for the local WAMP site', () => {
		window.history.pushState(
			{},
			'',
			'/maxi-blocks-local/wp-admin/post.php'
		);

		expect(isSCBlockDefaultsDebugEnabled()).toBe(true);
	});

	it('keeps automatic local debug focused on layout defaults', () => {
		window.history.pushState(
			{},
			'',
			'/maxi-blocks-local/wp-admin/post.php'
		);

		debugSCBlockDefaults('apply value', {
			blockName: 'text-maxi',
			attr: 'font-weight-general',
		});

		expect(console).not.toHaveInformed();
		expect(window.maxiSCBlockDefaultsDebugLog).toBeUndefined();

		debugSCBlockDefaults('style card values', {
			blockName: 'text-maxi',
			blockStyle: 'dark',
			blockDefaultKeys: [
				'container-maxi|padding-top-general',
				'container-maxi|padding-top-unit-general',
			],
		});

		expect(console).not.toHaveInformed();
		expect(window.maxiSCBlockDefaultsDebugLog).toBeUndefined();

		debugSCBlockDefaults('apply value', {
			blockName: 'container-maxi',
			attr: 'border-width-general',
		});

		expect(console).not.toHaveInformed();
		expect(window.maxiSCBlockDefaultsDebugLog).toBeUndefined();

		debugSCBlockDefaults('apply value', {
			blockName: 'container-maxi',
			attr: 'padding-top-xl',
		});

		expect(console).toHaveInformedWith('[SC block defaults] apply value', {
			blockName: 'container-maxi',
			attr: 'padding-top-xl',
		});
		expect(window.maxiSCBlockDefaultsDebugLog).toEqual([
			expect.objectContaining({
				label: 'apply value',
				payload: {
					blockName: 'container-maxi',
					attr: 'padding-top-xl',
				},
			}),
		]);
	});

	it('tracks explicit block default opt-outs without duplicating entries', () => {
		const added = getSCBlockDefaultsExcludedAttributesUpdate({
			attributes: {
				[SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES]: ['full-width-xl'],
			},
			attr: 'full-width-xl',
			exclude: true,
		});

		expect(added).toEqual({
			[SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES]: ['full-width-xl'],
		});

		const removed = getSCBlockDefaultsExcludedAttributesUpdate({
			attributes: added,
			attr: 'full-width-xl',
			exclude: false,
		});

		expect(removed).toEqual({
			[SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES]: undefined,
		});
	});

	it('applies Style Card row max-width when the block still has shipped defaults', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('row-maxi', 'max-width-xl')]: '1280',
				[getBlockDefaultKey('row-maxi', 'max-width-unit-xl')]: 'px',
			}),
		});

		expect(result['max-width-xl']).toBe('1280');
		expect(result['max-width-unit-xl']).toBe('px');
		expect(result.__scBlockDefaults['max-width-xl']).toEqual({
			blockName: 'row-maxi',
			blockStyle: 'light',
			cssVar: '--maxi-light-block-default-row-maxi-max-width-xl',
			fallback: '1280px',
		});
	});

	it('keeps custom row max-width values', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'max-width-xl': '900',
				'max-width-unit-xl': 'px',
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'max-width-xl': '900',
				'max-width-unit-xl': 'px',
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('row-maxi', 'max-width-xl')]: '1280',
				[getBlockDefaultKey('row-maxi', 'max-width-unit-xl')]: 'px',
			}),
		});

		expect(result['max-width-xl']).toBe('900');
		expect(result.__scBlockDefaults).toBeUndefined();
	});

	it('marks shipped defaults with CSS variable metadata before an override exists', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({}),
		});

		expect(result['max-width-xl']).toBe('1170');
		expect(result.__scBlockDefaults['max-width-xl']).toEqual({
			blockName: 'row-maxi',
			blockStyle: 'light',
			cssVar: '--maxi-light-block-default-row-maxi-max-width-xl',
			fallback: '1170px',
		});
	});

	it('does not override full-width rows', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
				'full-width-xl': true,
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
				'full-width-xl': true,
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('row-maxi', 'max-width-xl')]: '1280',
				[getBlockDefaultKey('row-maxi', 'max-width-unit-xl')]: 'px',
			}),
		});

		expect(result['max-width-xl']).toBe('1170');
		expect(result.__scBlockDefaults).toBeUndefined();
	});

	it('applies Style Card full-width defaults when the block has not opted out', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'full-width-xl': false,
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'full-width-xl': false,
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('row-maxi', 'full-width-xl')]: true,
			}),
		});

		expect(result['full-width-xl']).toBe(true);
	});

	it('keeps a block-level full-width opt-out when Style Card default is true', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'full-width-xl': false,
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'full-width-xl': false,
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
				[SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES]: ['full-width-xl'],
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('row-maxi', 'full-width-xl')]: true,
				[getBlockDefaultKey('row-maxi', 'max-width-xl')]: '1280',
				[getBlockDefaultKey('row-maxi', 'max-width-unit-xl')]: 'px',
			}),
		});

		expect(result['full-width-xl']).toBe(false);
		expect(result['max-width-xl']).toBe('1280');
		expect(result.__scBlockDefaults['max-width-xl'].cssVar).toBe(
			'--maxi-light-block-default-row-maxi-max-width-xl'
		);
	});

	it('does not override fit-content width settings', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'width-xl': '500',
				'width-unit-xl': 'px',
				'width-fit-content-xl': true,
			},
			attributes: {
				uniqueID: 'button-maxi-test-u',
				blockStyle: 'light',
				'width-xl': '500',
				'width-unit-xl': 'px',
				'width-fit-content-xl': true,
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('button-maxi', 'width-xl')]: '620',
				[getBlockDefaultKey('button-maxi', 'width-unit-xl')]: 'px',
			}),
		});

		expect(result['width-xl']).toBe('500');
		expect(result.__scBlockDefaults).toBeUndefined();
	});

	it('applies Style Card container padding to recognized library spacing sequences', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'padding-top-general': '100',
				'padding-top-unit-general': 'px',
				'padding-top-xxl': '150',
				'padding-top-unit-xxl': 'px',
				'padding-top-xl': '100',
				'padding-top-unit-xl': 'px',
			},
			attributes: {
				uniqueID: 'container-maxi-test-u',
				blockStyle: 'light',
				'padding-top-general': '100',
				'padding-top-unit-general': 'px',
				'padding-top-xxl': '150',
				'padding-top-unit-xxl': 'px',
				'padding-top-xl': '100',
				'padding-top-unit-xl': 'px',
			},
			defaultAttributes: layoutDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('container-maxi', 'padding-top-general')]:
					'80',
				[getBlockDefaultKey(
					'container-maxi',
					'padding-top-unit-general'
				)]: 'px',
			}),
		});

		expect(result['padding-top-general']).toBe('80');
		expect(result.__scBlockDefaults['padding-top-general']).toEqual({
			blockName: 'container-maxi',
			blockStyle: 'light',
			cssVar:
				'--maxi-light-block-default-container-maxi-padding-top-general',
			fallback: '80px',
		});
		expect(result.__scBlockDefaults['padding-top-xxl']).toEqual({
			blockName: 'container-maxi',
			blockStyle: 'light',
			cssVar:
				'--maxi-light-block-default-container-maxi-padding-top-xxl',
			fallback: '150px',
		});
	});

	it('uses the latest editor Style Card snapshot when the store has not refreshed yet', () => {
		setActiveStyleCardValueForBlockDefaults(
			getStyleCard({
				[getBlockDefaultKey('container-maxi', 'padding-top-xl')]:
					'120',
				[getBlockDefaultKey(
					'container-maxi',
					'padding-top-unit-xl'
				)]: 'px',
			})
		);

		const result = applySCBlockDefaultsToAttributes({
			response: {},
			attributes: {
				uniqueID: 'container-maxi-test-u',
				blockStyle: 'light',
			},
			defaultAttributes: layoutDefaults,
		});

		expect(result['padding-top-xl']).toBe('120');
		expect(result['padding-top-unit-xl']).toBe('px');
		expect(result.__scBlockDefaults['padding-top-xl']).toEqual({
			blockName: 'container-maxi',
			blockStyle: 'light',
			cssVar: '--maxi-light-block-default-container-maxi-padding-top-xl',
			fallback: '120px',
		});
	});

	it('applies Style Card container padding to the compact 150/200/150/60/40 library sequence', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'padding-top-general': '150',
				'padding-top-unit-general': 'px',
				'padding-top-xxl': '200',
				'padding-top-xl': '150',
				'padding-top-s': '60',
				'padding-top-xs': '40',
				'padding-bottom-general': '150',
				'padding-bottom-unit-general': 'px',
				'padding-bottom-xxl': '200',
				'padding-bottom-xl': '150',
				'padding-bottom-s': '60',
				'padding-bottom-xs': '40',
			},
			attributes: {
				uniqueID: 'container-maxi-test-u',
				blockStyle: 'dark',
				'padding-top-general': '150',
				'padding-top-unit-general': 'px',
				'padding-top-xxl': '200',
				'padding-top-xl': '150',
				'padding-top-s': '60',
				'padding-top-xs': '40',
				'padding-bottom-general': '150',
				'padding-bottom-unit-general': 'px',
				'padding-bottom-xxl': '200',
				'padding-bottom-xl': '150',
				'padding-bottom-s': '60',
				'padding-bottom-xs': '40',
			},
			defaultAttributes: layoutDefaults,
			styleCard: {
				...getStyleCard({}),
				dark: {
					defaultStyleCard: {
						blockDefaults: {},
					},
					styleCard: {
						blockDefaults: {
							[getBlockDefaultKey(
								'container-maxi',
								'padding-top-general'
							)]: '100',
							[getBlockDefaultKey(
								'container-maxi',
								'padding-top-unit-general'
							)]: 'px',
							[getBlockDefaultKey(
								'container-maxi',
								'padding-bottom-general'
							)]: '100',
							[getBlockDefaultKey(
								'container-maxi',
								'padding-bottom-unit-general'
							)]: 'px',
						},
					},
				},
			},
		});

		expect(result['padding-top-general']).toBe('100');
		expect(result['padding-bottom-general']).toBe('100');
		expect(result.__scBlockDefaults['padding-top-general']).toEqual({
			blockName: 'container-maxi',
			blockStyle: 'dark',
			cssVar:
				'--maxi-dark-block-default-container-maxi-padding-top-general',
			fallback: '100px',
		});
	});

	it('keeps custom container padding sequences explicit', () => {
		window.maxiDebugSCBlockDefaults = true;

		const result = applySCBlockDefaultsToAttributes({
			response: {
				'padding-top-general': '110',
				'padding-top-unit-general': 'px',
				'padding-top-xxl': '150',
				'padding-top-unit-xxl': 'px',
				'padding-top-xl': '100',
				'padding-top-unit-xl': 'px',
			},
			attributes: {
				uniqueID: 'container-maxi-test-u',
				blockStyle: 'light',
				'padding-top-general': '110',
				'padding-top-unit-general': 'px',
				'padding-top-xxl': '150',
				'padding-top-unit-xxl': 'px',
				'padding-top-xl': '100',
				'padding-top-unit-xl': 'px',
			},
			defaultAttributes: layoutDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('container-maxi', 'padding-top-general')]:
					'80',
				[getBlockDefaultKey(
					'container-maxi',
					'padding-top-unit-general'
				)]: 'px',
			}),
		});

		expect(result['padding-top-general']).toBe('110');
		expect(result.__scBlockDefaults).toBeUndefined();

		const mismatchLog = window.maxiSCBlockDefaultsDebugLog.find(
			({ label, payload }) =>
				label === 'library layout sequence not matched' &&
				payload.attr === 'padding-top-general'
		);

		expect(mismatchLog.payload).toEqual(
			expect.objectContaining({
				blockName: 'container-maxi',
				currentValue: '110',
				target: 'padding-top',
				reason: 'no library layout sequence matched',
				mismatches: expect.arrayContaining([
					expect.objectContaining({
						breakpoint: 'general',
						actual: '110',
						expected: '100',
						reason: 'value mismatch',
					}),
				]),
			})
		);
		expect(console).toHaveInformed();
	});

	it('applies responsive row column gap defaults only for recognized library mobile sequences', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'column-gap-m': '2.5',
				'column-gap-unit-m': '%',
				'column-gap-s': '2.5',
				'column-gap-unit-s': '%',
				'column-gap-xs': '2.5',
				'column-gap-unit-xs': '%',
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'column-gap-m': '2.5',
				'column-gap-unit-m': '%',
				'column-gap-s': '2.5',
				'column-gap-unit-s': '%',
				'column-gap-xs': '2.5',
				'column-gap-unit-xs': '%',
			},
			defaultAttributes: layoutDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('row-maxi', 'column-gap-m')]: '4',
				[getBlockDefaultKey('row-maxi', 'column-gap-unit-m')]: '%',
			}),
		});

		expect(result['column-gap-m']).toBe('4');
		expect(result['column-gap-s']).toBe('2.5');
		expect(result.__scBlockDefaults['column-gap-m']).toEqual({
			blockName: 'row-maxi',
			blockStyle: 'light',
			cssVar: '--maxi-light-block-default-row-maxi-column-gap-m',
			fallback: '4%',
		});
		expect(result.__scBlockDefaults['column-gap-xs']).toEqual({
			blockName: 'row-maxi',
			blockStyle: 'light',
			cssVar: '--maxi-light-block-default-row-maxi-column-gap-xs',
			fallback: '2.5%',
		});
	});

	it('applies Style Card row spacing to recognized library row spacing defaults', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'row-gap-general': 20,
				'row-gap-unit-general': 'px',
				'row-gap-xs': 10,
				'column-gap-general': 0,
				'column-gap-unit-general': '%',
				'flex-wrap-general': 'nowrap',
				'flex-wrap-xs': 'wrap',
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'dark',
				'row-gap-general': 20,
				'row-gap-unit-general': 'px',
				'row-gap-xs': 10,
				'column-gap-general': 0,
				'column-gap-unit-general': '%',
				'flex-wrap-general': 'nowrap',
				'flex-wrap-xs': 'wrap',
			},
			defaultAttributes: layoutDefaults,
			styleCard: {
				...getStyleCard({}),
				dark: {
					defaultStyleCard: {
						blockDefaults: {},
					},
					styleCard: {
						blockDefaults: {
							[getBlockDefaultKey(
								'row-maxi',
								'row-gap-general'
							)]: 30,
							[getBlockDefaultKey(
								'row-maxi',
								'row-gap-unit-general'
							)]: 'px',
							[getBlockDefaultKey(
								'row-maxi',
								'column-gap-general'
							)]: 4,
							[getBlockDefaultKey(
								'row-maxi',
								'column-gap-unit-general'
							)]: '%',
							[getBlockDefaultKey(
								'row-maxi',
								'flex-wrap-general'
							)]: 'wrap',
						},
					},
				},
			},
		});

		expect(result['row-gap-general']).toBe(30);
		expect(result['column-gap-general']).toBe(4);
		expect(result['flex-wrap-general']).toBe('wrap');
		expect(result.__scBlockDefaults['row-gap-general']).toEqual({
			blockName: 'row-maxi',
			blockStyle: 'dark',
			cssVar: '--maxi-dark-block-default-row-maxi-row-gap-general',
			fallback: '30px',
		});
	});

	it('keeps a block-level fit-content opt-out when Style Card default is true', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'width-fit-content-xl': false,
				'width-xl': '500',
				'width-unit-xl': 'px',
			},
			attributes: {
				uniqueID: 'button-maxi-test-u',
				blockStyle: 'light',
				'width-fit-content-xl': false,
				'width-xl': '500',
				'width-unit-xl': 'px',
				[SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES]: [
					'width-fit-content-xl',
				],
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey(
					'button-maxi',
					'width-fit-content-xl'
				)]: true,
				[getBlockDefaultKey('button-maxi', 'width-xl')]: '620',
				[getBlockDefaultKey('button-maxi', 'width-unit-xl')]: 'px',
			}),
		});

		expect(result['width-fit-content-xl']).toBe(false);
		expect(result['width-xl']).toBe('620');
		expect(result.__scBlockDefaults['width-xl'].cssVar).toBe(
			'--maxi-light-block-default-button-maxi-width-xl'
		);
	});

	it('generates CSS variables for stored block defaults', () => {
		const result = getStyleCardBlockDefaultVariables(
			getStyleCard({
				[getBlockDefaultKey('row-maxi', 'max-width-xl')]: '1280',
				[getBlockDefaultKey('row-maxi', 'max-width-unit-xl')]: 'px',
			})
		);

		expect(result['--maxi-light-block-default-row-maxi-max-width-xl']).toBe(
			'1280px'
		);
		expect(
			result['--maxi-light-block-default-row-maxi-max-width-unit-xl']
		).toBeUndefined();
	});
});
