jest.mock('@wordpress/blocks', () => {
	return {
		getBlockAttributes: jest.fn(),
	};
});
jest.mock('../../styles/transitions/getTransitionData.js', () => jest.fn());
jest.mock('../../attributes/getBlockData.js', () => jest.fn());

/**
 * Internal dependencies
 */
import { getSCVariablesObject } from '../updateSCOnEditor';
import '@wordpress/rich-text';

describe('getSCVariablesObject', () => {
	it('Return an object with variables ready to update on `document.documentElement`', () => {
		const styleCards = {
			name: 'Maxi (Default)',
			status: 'active',
			dark: {
				styleCard: {},
				defaultStyleCard: {
					color: {
						1: '8,18,25',
						2: '6,39,57',
						3: '155,155,155',
						4: '255,74,23',
						5: '255,255,255',
						6: '201,52,10',
						7: '245,245,245',
						8: '150, 176, 203',
					},
					p: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 16,
						'font-size-unit-general': 'px',
						'font-size-xxl': 18,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 16,
						'font-size-unit-xl': 'px',
						'line-height-general': 1.625,
						'line-height-xxl': 1.5,
						'line-height-xl': 1.625,
						'font-weight-general': '400',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h1: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 45,
						'font-size-unit-general': 'px',
						'font-size-xxl': 50,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 45,
						'font-size-unit-xl': 'px',
						'font-size-l': 40,
						'font-size-unit-l': 'px',
						'font-size-m': 36,
						'font-size-unit-m': 'px',
						'font-size-s': 34,
						'font-size-unit-s': 'px',
						'font-size-xs': 32,
						'font-size-unit-xs': 'px',
						'line-height-general': 1.1,
						'line-height-xxl': 1.18,
						'line-height-xl': 1.1,
						'line-height-l': 1.22,
						'line-height-m': 1.27,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h2: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 38,
						'font-size-unit-general': 'px',
						'font-size-xxl': 44,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 38,
						'font-size-unit-xl': 'px',
						'font-size-l': 36,
						'font-size-unit-l': 'px',
						'font-size-m': 32,
						'font-size-unit-m': 'px',
						'font-size-s': 30,
						'font-size-unit-s': 'px',
						'font-size-xs': 28,
						'font-size-unit-xs': 'px',
						'line-height-general': 1.05,
						'line-height-xxl': 1.21,
						'line-height-xl': 1.05,
						'line-height-l': 1.26,
						'line-height-m': 1.33,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h3: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 30,
						'font-size-unit-general': 'px',
						'font-size-xxl': 34,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 30,
						'font-size-unit-xl': 'px',
						'font-size-m': 26,
						'font-size-unit-m': 'px',
						'font-size-s': 24,
						'font-size-unit-s': 'px',
						'line-height-general': 1.3,
						'line-height-xxl': 1.25,
						'line-height-xl': 1.3,
						'line-height-l': 1.23,
						'line-height-m': 1.16,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h4: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 26,
						'font-size-unit-general': 'px',
						'font-size-xxl': 30,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 26,
						'font-size-unit-xl': 'px',
						'font-size-l': 24,
						'font-size-unit-l': 'px',
						'font-size-s': 22,
						'font-size-unit-s': 'px',
						'line-height-general': 1.24,
						'line-height-xxl': 1.33,
						'line-height-xl': 1.24,
						'line-height-l': 1.38,
						'line-height-m': 1.42,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h5: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 22,
						'font-size-unit-general': 'px',
						'font-size-xxl': 26,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 22,
						'font-size-unit-xl': 'px',
						'font-size-m': 20,
						'font-size-unit-m': 'px',
						'line-height-general': 1.26,
						'line-height-xxl': 1.36,
						'line-height-xl': 1.26,
						'line-height-l': 1.45,
						'line-height-m': 1.5,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h6: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 20,
						'font-size-unit-general': 'px',
						'font-size-xxl': 24,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 20,
						'font-size-unit-xl': 'px',
						'font-size-m': 18,
						'font-size-unit-m': 'px',
						'line-height-general': 1.29,
						'line-height-xxl': 1.39,
						'line-height-xl': 1.29,
						'line-height-l': 1.5,
						'line-height-m': 1.56,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					button: {
						'border-color-global': false,
						'border-color': '',
						'hover-border-color-global': false,
						'hover-border-color': '',
						'color-global': false,
						color: '',
						'hover-color-global': false,
						'hover-color': '',
						'font-family-general': 'Roboto',
						'font-size-general': 18,
						'font-size-unit-general': 'px',
						'font-size-xxl': 22,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 18,
						'font-size-unit-xl': 'px',
						'font-size-l': 16,
						'font-size-unit-l': 'px',
						'line-height-general': 1.625,
						'line-height-xxl': 1.5,
						'line-height-xl': 1.625,
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'font-weight-general': '400',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'text-decoration-general': 'unset',
						'background-color-global': false,
						'background-color': '',
						'hover-background-color-global': false,
						'hover-background-color': '',
					},
					link: {
						'link-color-global': false,
						'link-color': '',
						'hover-color-global': false,
						'hover-color': '',
						'active-color-global': false,
						'active-color': '',
						'visited-color-global': false,
						'visited-color': '',
					},
					icon: {
						'line-color-global': false,
						line: '',
						'fill-color-global': false,
						fill: '',
					},
					divider: {
						'color-global': false,
						color: '',
					},
				},
			},
			light: {
				styleCard: {},
				defaultStyleCard: {
					color: {
						1: '255,255,255',
						2: '242,249,253',
						3: '155,155,155',
						4: '255,74,23',
						5: '0,0,0',
						6: '201,52,10',
						7: '8,18,25',
						8: '150, 176, 203',
					},
					p: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 16,
						'font-size-unit-general': 'px',
						'font-size-xxl': 18,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 16,
						'font-size-unit-xl': 'px',
						'line-height-general': 1.625,
						'line-height-xxl': 1.5,
						'line-height-xl': 1.625,
						'font-weight-general': '400',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h1: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 45,
						'font-size-unit-general': 'px',
						'font-size-xxl': 50,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 45,
						'font-size-unit-xl': 'px',
						'font-size-l': 40,
						'font-size-unit-l': 'px',
						'font-size-m': 36,
						'font-size-unit-m': 'px',
						'font-size-s': 34,
						'font-size-unit-s': 'px',
						'font-size-xs': 32,
						'font-size-unit-xs': 'px',
						'line-height-general': 1.1,
						'line-height-xxl': 1.18,
						'line-height-xl': 1.1,
						'line-height-l': 1.22,
						'line-height-m': 1.27,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h2: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 38,
						'font-size-unit-general': 'px',
						'font-size-xxl': 44,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 38,
						'font-size-unit-xl': 'px',
						'font-size-l': 36,
						'font-size-unit-l': 'px',
						'font-size-m': 32,
						'font-size-unit-m': 'px',
						'font-size-s': 30,
						'font-size-unit-s': 'px',
						'font-size-xs': 28,
						'font-size-unit-xs': 'px',
						'line-height-general': 1.05,
						'line-height-xxl': 1.21,
						'line-height-xl': 1.05,
						'line-height-l': 1.26,
						'line-height-m': 1.33,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h3: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 30,
						'font-size-unit-general': 'px',
						'font-size-xxl': 34,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 30,
						'font-size-unit-xl': 'px',
						'font-size-l': 30,
						'font-size-unit-l': 'px',
						'font-size-m': 26,
						'font-size-unit-m': 'px',
						'font-size-s': 24,
						'font-size-unit-s': 'px',
						'line-height-general': 1.3,
						'line-height-xxl': 1.25,
						'line-height-xl': 1.3,
						'line-height-l': 1.23,
						'line-height-m': 1.16,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h4: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 26,
						'font-size-unit-general': 'px',
						'font-size-xxl': 30,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 26,
						'font-size-unit-xl': 'px',
						'font-size-l': 24,
						'font-size-unit-l': 'px',
						'font-size-s': 22,
						'font-size-unit-s': 'px',
						'line-height-general': 1.24,
						'line-height-xxl': 1.33,
						'line-height-xl': 1.24,
						'line-height-l': 1.38,
						'line-height-m': 1.42,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h5: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 22,
						'font-size-unit-general': 'px',
						'font-size-xxl': 28,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 22,
						'font-size-unit-xl': 'px',
						'font-size-m': 20,
						'font-size-unit-m': 'px',
						'line-height-general': 1.26,
						'line-height-xxl': 1.36,
						'line-height-xl': 1.26,
						'line-height-l': 1.45,
						'line-height-m': 1.5,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					h6: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 20,
						'font-size-unit-general': 'px',
						'font-size-xxl': 24,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 20,
						'font-size-unit-xl': 'px',
						'font-size-m': 18,
						'font-size-unit-m': 'px',
						'line-height-general': 1.29,
						'line-height-xxl': 1.39,
						'line-height-xl': 1.29,
						'line-height-l': 1.5,
						'line-height-m': 1.56,
						'font-weight-general': '500',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
					},
					button: {
						'border-color-global': false,
						'border-color': '',
						'hover-border-color-global': false,
						'hover-border-color': '',
						'color-global': false,
						color: '',
						'hover-color-global': false,
						'hover-color': '',
						'font-family-general': 'Roboto',
						'font-size-general': 18,
						'font-size-unit-general': 'px',
						'font-size-xxl': 22,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 18,
						'font-size-unit-xl': 'px',
						'font-size-l': 16,
						'font-size-unit-l': 'px',
						'line-height-general': 1.625,
						'line-height-xxl': 1.5,
						'line-height-xl': 1.625,
						'font-weight-general': '400',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'background-color-global': false,
						'background-color': '',
						'hover-background-color-global': false,
						'hover-background-color': '',
					},
					link: {
						'link-color-global': false,
						'link-color': '',
						'hover-color-global': false,
						'hover-color': '',
						'active-color-global': false,
						'active-color': '',
						'visited-color-global': false,
						'visited-color': '',
					},
					icon: {
						'line-color-global': false,
						line: '',
						'fill-color-global': false,
						fill: '',
					},
					divider: {
						'color-global': false,
						color: '',
					},
				},
			},
		};

		const result = getSCVariablesObject(styleCards);

		expect(result).toMatchSnapshot();
	});
});
