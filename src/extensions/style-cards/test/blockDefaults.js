import {
	applySCBlockDefaultsToAttributes,
	debugSCBlockDefaults,
	getBlockDefaultKey,
	getSCBlockDefaultsExcludedAttributesUpdate,
	getStyleCardBlockDefaultVariables,
	isSCBlockDefaultsDebugEnabled,
	SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES,
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
		delete window.maxiDebugSCBlockDefaults;
		window.localStorage?.removeItem('maxiDebugSCBlockDefaults');
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
	});

	it('enables debug logging automatically for the local WAMP site', () => {
		window.history.pushState(
			{},
			'',
			'/maxi-blocks-local/wp-admin/post.php'
		);

		expect(isSCBlockDefaultsDebugEnabled()).toBe(true);
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
			fallback: '1170px',
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
