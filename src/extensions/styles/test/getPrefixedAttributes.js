import { getPrefixedAttributes } from '..';
import margin from '../defaults/margin';
import boxShadowHover from '../defaults/boxShadowHover';
import { borderWidth } from '../defaults/border';

describe('getPrefixedAttributes', () => {
	it('Returns prefixed object with default values', () => {
		const obj = {
			...margin,
			...boxShadowHover,
			...borderWidth,
		};

		expect(getPrefixedAttributes(obj, 'button-')).toMatchSnapshot();
	});

	it('Returns prefixed object with custom values', () => {
		const obj = {
			'padding-bottom-general': 15,
			'padding-bottom-xxl': 23,
			'padding-left-general': 36,
			'padding-left-xxl': 55,
			'padding-right-general': 36,
			'padding-right-xxl': 55,
			'padding-sync-general': false,
			'padding-sync-horizontal-general': false,
			'padding-sync-vertical-general': false,
			'padding-top-general': 15,
			'padding-top-xxl': 23,
			'padding-unit-general': 'px',
			'margin-bottom-general': '56',
			'margin-left-general': '36',
			'margin-right-general': '45',
			'margin-sync-general': false,
			'margin-sync-horizontal-general': false,
			'margin-sync-vertical-general': false,
			'margin-top-general': '30',
			'margin-unit-general': 'px',
			'border-bottom-width-general': 2,
			'border-color-general': '',
			'border-left-width-general': 2,
			'border-palette-color-general': 2,
			'border-palette-color-general-hover': 6,
			'border-palette-color-status-general': true,
			'border-palette-color-status-general-hover': true,
			'border-right-width-general': 2,
			'border-status-hover': false,
			'border-style-general': 'solid',
			'border-sync-radius-general': true,
			'border-sync-width-general': true,
			'border-top-width-general': 2,
			'border-unit-radius-general': 'px',
			'border-unit-radius-general-hover': 'px',
			'border-unit-width-general': 'px',
			'opacity-general': 0.82,
			'box-shadow-blur-general': 50,
			'box-shadow-horizontal-general': 0,
			'box-shadow-palette-color-general': 8,
			'box-shadow-palette-color-general-hover': 6,
			'box-shadow-palette-color-status-general': true,
			'box-shadow-palette-color-status-general-hover': true,
			'box-shadow-palette-opacity-general': 23,
			'box-shadow-spread-general': 0,
			'box-shadow-status-hover': false,
			'box-shadow-vertical-general': 30,
			'max-height-unit-general': 'px',
			'max-height-unit-xl': 'em',
			'max-height-xl': 30,
			'max-width-unit-general': 'px',
			'max-width-xl': 10,
			'min-height-unit-general': 'px',
			'min-height-xl': 90,
			'min-width-unit-general': 'px',
			'min-width-unit-xl': '%',
			'min-width-xl': 50,
		};

		expect(getPrefixedAttributes(obj, 'button-')).toMatchSnapshot();
	});
});
