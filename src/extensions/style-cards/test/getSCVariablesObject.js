import standardSC from '../../../../core/defaults/defaultSC.json';
import getSCVariablesObject from '../getSCVariablesObject';

describe('getSCVariablesObject', () => {
	it('Returns the correct object from default SC', () => {
		const cleanVarSC = getSCVariablesObject(standardSC.sc_maxi, null, true);

		expect(cleanVarSC).toMatchSnapshot();
	});

	it('Returns the correct object', () => {
		const styleCard = {
			name: 'Maxi (Default) - test',
			status: 'active',
			dark: {
				styleCard: {},
				defaultStyleCard: {
					color: {
						1: '0,0,0',
						2: '5,23,33',
						3: '155,155,155',
						4: '255,74,23',
						5: '255,255,255',
						6: '201,52,10',
						7: '245,245,245',
						8: '9,60,88',
					},
					p: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 3,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 16,
						'font-size-unit-general': 'px',
						'font-size-xxl': 20,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 16,
						'font-size-unit-xl': 'px',
						'line-height-general': 26,
						'line-height-unit-general': 'px',
						'line-height-xxl': 30,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 26,
						'line-height-unit-xl': 'px',
						'font-weight-general': 400,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',

						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h1: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 45,
						'font-size-unit-general': 'px',
						'font-size-xxl': 60,
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
						'line-height-general': 55,
						'line-height-unit-general': 'px',
						'line-height-xxl': 70,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 55,
						'line-height-unit-xl': 'px',
						'line-height-l': 50,
						'line-height-unit-l': 'px',
						'line-height-m': 46,
						'line-height-unit-m': 'px',
						'line-height-s': 44,
						'line-height-unit-s': 'px',
						'line-height-xs': 42,
						'line-height-unit-xs': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',

						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h2: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 38,
						'font-size-unit-general': 'px',
						'font-size-xxl': 50,
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
						'line-height-general': 48,
						'line-height-unit-general': 'px',
						'line-height-xxl': 60,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 48,
						'line-height-unit-xl': 'px',
						'line-height-l': 46,
						'line-height-unit-l': 'px',
						'line-height-m': 42,
						'line-height-unit-m': 'px',
						'line-height-s': 40,
						'line-height-unit-s': 'px',
						'line-height-xs': 38,
						'line-height-unit-xs': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',

						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h3: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 30,
						'font-size-unit-general': 'px',
						'font-size-xxl': 40,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 30,
						'font-size-unit-xl': 'px',
						'font-size-m': 26,
						'font-size-unit-m': 'px',
						'font-size-s': 24,
						'font-size-unit-s': 'px',
						'line-height-general': 40,
						'line-height-unit-general': 'px',
						'line-height-xxl': 50,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 40,
						'line-height-unit-xl': 'px',
						'line-height-m': 36,
						'line-height-unit-m': 'px',
						'line-height-s': 34,
						'line-height-unit-s': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',

						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h4: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 26,
						'font-size-unit-general': 'px',
						'font-size-xxl': 38,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 26,
						'font-size-unit-xl': 'px',
						'font-size-l': 24,
						'font-size-unit-l': 'px',
						'font-size-s': 22,
						'font-size-unit-s': 'px',
						'line-height-general': 36,
						'line-height-unit-general': 'px',
						'line-height-xxl': 48,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 36,
						'line-height-unit-xl': 'px',
						'line-height-l': 34,
						'line-height-unit-l': 'px',
						'line-height-s': 32,
						'line-height-unit-s': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',

						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h5: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 22,
						'font-size-unit-general': 'px',
						'font-size-xxl': 30,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 22,
						'font-size-unit-xl': 'px',
						'font-size-m': 20,
						'font-size-unit-m': 'px',
						'line-height-general': 32,
						'line-height-unit-general': 'px',
						'line-height-xxl': 40,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 32,
						'line-height-unit-xl': 'px',
						'line-height-m': 30,
						'line-height-unit-m': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',

						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h6: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 20,
						'font-size-unit-general': 'px',
						'font-size-xxl': 26,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 20,
						'font-size-unit-xl': 'px',
						'font-size-m': 18,
						'font-size-unit-m': 'px',
						'line-height-general': 30,
						'line-height-unit-general': 'px',
						'line-height-xxl': 36,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 30,
						'line-height-unit-xl': 'px',
						'line-height-unit-l': 'px',
						'line-height-m': 28,
						'line-height-unit-m': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',

						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					button: {
						'border-color-global': false,
						'border-palette-status': true,
						'border-palette-color': 5,
						'border-palette-opacity': 1,
						'border-color': '',
						'hover-border-color-global': false,
						'hover-border-color-all': false,
						'hover-border-palette-status': true,
						'hover-border-palette-color': 6,
						'hover-border-palette-opacity': 1,
						'hover-border-color': '',
						'color-global': false,
						'palette-status': true,
						'palette-color': 1,
						'palette-opacity': 1,
						color: '',
						'hover-color-global': false,
						'hover-color-all': false,
						'hover-palette-status': true,
						'hover-palette-color': 5,
						'hover-palette-opacity': 1,
						'hover-color': '',
						'font-family-general': '',
						'font-size-general': 16,
						'font-size-unit-general': 'px',
						'font-size-xxl': 20,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 16,
						'font-size-unit-xl': 'px',
						'line-height-general': 100,
						'line-height-unit-general': '%',
						'line-height-xl': 100,
						'line-height-unit-xl': '%',
						'font-weight-general': 400,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',
						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'background-color-global': false,
						'background-palette-status': true,
						'background-palette-color': 4,
						'background-palette-opacity': 1,
						'background-color': '',
						'hover-background-color-global': false,
						'hover-background-color-all': false,
						'hover-background-palette-status': true,
						'hover-background-palette-color': 6,
						'hover-background-palette-opacity': 1,
						'hover-background-color': '',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					link: {
						'link-color-global': false,
						'link-palette-status': true,
						'link-palette-color': 4,
						'link-palette-opacity': 1,
						'link-color': '',
						'hover-color-global': false,
						'hover-palette-status': true,
						'hover-palette-color': 6,
						'hover-palette-opacity': 1,
						'hover-color': '',
						'active-color-global': false,
						'active-palette-status': true,
						'active-palette-color': 6,
						'active-palette-opacity': 1,
						'active-color': '',
						'visited-color-global': false,
						'visited-palette-status': true,
						'visited-palette-color': 6,
						'visited-palette-opacity': 1,
						'visited-color': '',
					},
					icon: {
						'line-color-global': false,
						'line-palette-status': true,
						'line-palette-color': 7,
						'line-palette-opacity': 1,
						'line-color': '',
						'fill-color-global': false,
						'fill-palette-status': true,
						'fill-palette-color': 4,
						'fill-palette-opacity': 1,
						'fill-color': '',
						'hover-line-color-global': false,
						'hover-line-color-all': false,
						'hover-line-palette-status': true,
						'hover-line-palette-color': 5,
						'hover-line-palette-opacity': 1,
						'hover-line-color': '',
						'hover-fill-color-global': false,
						'hover-fill-color-all': false,
						'hover-fill-palette-status': true,
						'hover-fill-palette-color': 6,
						'hover-fill-palette-opacity': 1,
						'hover-fill-color': '',
					},
					divider: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 1,
						'palette-opacity': 1,
						color: '',
					},
				},
			},
			light: {
				styleCard: {
					color: {
						1: '156,147,147',
						2: '163,196,216',
						3: '98,133,153',
						4: '151,88,70',
						5: '67,52,48',
						6: '202,167,157',
						7: '17,67,103',
						8: '91,97,103',
					},
					p: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 3,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Montserrat',
						'font-size-general': 16,
						'font-size-unit-general': 'px',
						'font-size-xxl': 20,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 16,
						'font-size-unit-xl': 'px',
						'line-height-general': 26,
						'line-height-unit-general': 'px',
						'line-height-xxl': 30,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 26,
						'line-height-unit-xl': 'px',
						'font-weight-general': 400,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',

						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
						'font-size-l': 48,
					},
					icon: {
						'line-color-global': true,
						'line-palette-status': true,
						'line-palette-color': 4,
						'line-palette-opacity': 1,
						'line-color': '',
					},
				},
				defaultStyleCard: {
					color: {
						1: '255,255,255',
						2: '242,249,253',
						3: '155,155,155',
						4: '255,74,23',
						5: '0,0,0',
						6: '201,52,10',
						7: '8,18,25',
						8: '150,176,203',
					},
					p: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 3,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 16,
						'font-size-unit-general': 'px',
						'font-size-xxl': 20,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 16,
						'font-size-unit-xl': 'px',
						'line-height-general': 26,
						'line-height-unit-general': 'px',
						'line-height-xxl': 30,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 26,
						'line-height-unit-xl': 'px',
						'font-weight-general': 400,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',
						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h1: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 45,
						'font-size-unit-general': 'px',
						'font-size-xxl': 60,
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
						'line-height-general': 55,
						'line-height-unit-general': 'px',
						'line-height-xxl': 70,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 55,
						'line-height-unit-xl': 'px',
						'line-height-l': 50,
						'line-height-unit-l': 'px',
						'line-height-m': 46,
						'line-height-unit-m': 'px',
						'line-height-s': 44,
						'line-height-unit-s': 'px',
						'line-height-xs': 42,
						'line-height-unit-xs': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',
						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h2: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 38,
						'font-size-unit-general': 'px',
						'font-size-xxl': 50,
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
						'line-height-general': 48,
						'line-height-unit-general': 'px',
						'line-height-xxl': 60,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 48,
						'line-height-unit-xl': 'px',
						'line-height-l': 46,
						'line-height-unit-l': 'px',
						'line-height-m': 42,
						'line-height-unit-m': 'px',
						'line-height-s': 40,
						'line-height-unit-s': 'px',
						'line-height-xs': 38,
						'line-height-unit-xs': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',
						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h3: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 30,
						'font-size-unit-general': 'px',
						'font-size-xxl': 40,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 30,
						'font-size-unit-xl': 'px',
						'font-size-m': 26,
						'font-size-unit-m': 'px',
						'font-size-s': 24,
						'font-size-unit-s': 'px',
						'line-height-general': 40,
						'line-height-unit-general': 'px',
						'line-height-xxl': 50,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 40,
						'line-height-unit-xl': 'px',
						'line-height-m': 36,
						'line-height-unit-m': 'px',
						'line-height-s': 34,
						'line-height-unit-s': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',
						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h4: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 26,
						'font-size-unit-general': 'px',
						'font-size-xxl': 38,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 26,
						'font-size-unit-xl': 'px',
						'font-size-l': 24,
						'font-size-unit-l': 'px',
						'font-size-s': 22,
						'font-size-unit-s': 'px',
						'line-height-general': 36,
						'line-height-unit-general': 'px',
						'line-height-xxl': 48,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 36,
						'line-height-unit-xl': 'px',
						'line-height-l': 34,
						'line-height-unit-l': 'px',
						'line-height-s': 32,
						'line-height-unit-s': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',
						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h5: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 22,
						'font-size-unit-general': 'px',
						'font-size-xxl': 30,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 22,
						'font-size-unit-xl': 'px',
						'font-size-m': 20,
						'font-size-unit-m': 'px',
						'line-height-general': 32,
						'line-height-unit-general': 'px',
						'line-height-xxl': 40,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 32,
						'line-height-unit-xl': 'px',
						'line-height-m': 30,
						'line-height-unit-m': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',
						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					h6: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 5,
						'palette-opacity': 1,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-general': 20,
						'font-size-unit-general': 'px',
						'font-size-xxl': 26,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 20,
						'font-size-unit-xl': 'px',
						'font-size-m': 18,
						'font-size-unit-m': 'px',
						'line-height-general': 30,
						'line-height-unit-general': 'px',
						'line-height-xxl': 36,
						'line-height-unit-xxl': 'px',
						'line-height-xl': 30,
						'line-height-unit-xl': 'px',
						'line-height-unit-l': 'px',
						'line-height-m': 28,
						'line-height-unit-m': 'px',
						'font-weight-general': 500,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',
						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'bottom-gap-general': 20,
						'bottom-gap-unit-general': 'px',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					button: {
						'border-color-global': false,
						'border-palette-status': true,
						'border-palette-color': 5,
						'border-palette-opacity': 1,
						'border-color': '',
						'hover-border-color-global': false,
						'hover-border-color-all': false,
						'hover-border-palette-status': true,
						'hover-border-palette-color': 6,
						'hover-border-palette-opacity': 1,
						'hover-border-color': '',
						'color-global': false,
						'palette-status': true,
						'palette-color': 1,
						'palette-opacity': 1,
						color: '',
						'hover-color-global': false,
						'hover-color-all': false,
						'hover-palette-status': true,
						'hover-palette-color': 5,
						'hover-palette-opacity': 1,
						'hover-color': '',
						'font-family-general': '',
						'font-size-general': 16,
						'font-size-unit-general': 'px',
						'font-size-xxl': 20,
						'font-size-unit-xxl': 'px',
						'font-size-xl': 16,
						'font-size-unit-xl': 'px',
						'line-height-general': 100,
						'line-height-unit-general': '%',
						'line-height-xl': 100,
						'line-height-unit-xl': '%',
						'font-weight-general': 400,
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-general': 0,
						'letter-spacing-unit-general': 'px',
						'letter-spacing-xxl': 0,
						'letter-spacing-unit-xxl': 'px',
						'letter-spacing-xl': 0,
						'letter-spacing-unit-xl': 'px',
						'text-decoration-general': 'unset',
						'text-orientation-general': 'unset',
						'text-direction-general': 'ltr',
						'white-space-general': 'normal',
						'word-spacing-general': 0,
						'word-spacing-unit-general': 'px',
						'background-color-global': false,
						'background-palette-status': true,
						'background-palette-color': 4,
						'background-palette-opacity': 1,
						'background-color': '',
						'hover-background-color-global': false,
						'hover-background-color-all': false,
						'hover-background-palette-status': true,
						'hover-background-palette-color': 6,
						'hover-background-palette-opacity': 1,
						'hover-background-color': '',
						'text-indent-general': 0,
						'text-indent-unit-general': 'px',
					},
					link: {
						'link-color-global': false,
						'link-palette-status': true,
						'link-palette-color': 4,
						'link-palette-opacity': 1,
						'link-color': '',
						'hover-color-global': false,
						'hover-palette-status': true,
						'hover-palette-color': 6,
						'hover-palette-opacity': 1,
						'hover-color': '',
						'active-color-global': false,
						'active-palette-status': true,
						'active-palette-color': 6,
						'active-palette-opacity': 1,
						'active-color': '',
						'visited-color-global': false,
						'visited-palette-status': true,
						'visited-palette-color': 6,
						'visited-palette-opacity': 1,
						'visited-color': '',
					},
					icon: {
						'line-color-global': false,
						'line-palette-status': true,
						'line-palette-color': 7,
						'line-palette-opacity': 1,
						'line-color': '',
						'fill-color-global': false,
						'fill-palette-status': true,
						'fill-palette-color': 4,
						'fill-palette-opacity': 1,
						'fill-color': '',
						'hover-line-color-global': false,
						'hover-line-color-all': false,
						'hover-line-palette-status': true,
						'hover-line-palette-color': 5,
						'hover-line-palette-opacity': 1,
						'hover-line-color': '',
						'hover-fill-color-global': false,
						'hover-fill-color-all': false,
						'hover-fill-palette-status': true,
						'hover-fill-palette-color': 6,
						'hover-fill-palette-opacity': 1,
						'hover-fill-color': '',
					},
					divider: {
						'color-global': false,
						'palette-status': true,
						'palette-color': 1,
						'palette-opacity': 1,
						color: '',
					},
				},
			},
			type: 'user',
			updated: 'April 19, 2023',
			selected: true,
		};

		const cleanVarSC = getSCVariablesObject(styleCard, null, true);

		expect(cleanVarSC).toMatchSnapshot();
	});
});
