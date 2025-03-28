import getGroupAttributes from '@extensions/styles/getGroupAttributes';

const attributes = {
	extraClassName: '',
	anchorLink: '',
	customLabel: 'Button',
	fullWidth: 'normal',
	buttonContent: '',
	'alignment-general': 'center',
	'palette-status-general': true,
	'palette-color-general': 4,
	'font-size-unit-general': 'px',
	'line-height-unit-general': '%',
	'line-height-general': '100',
	'letter-spacing-unit-general': 'px',
	'typography-status-hover': false,
	'palette-status-general-hover': true,
	'palette-color-general-hover': 5,
	'background-active-media-general': '',
	'background-palette-status-general': true,
	'background-palette-color-general': 4,
	'background-gradient-opacity-general': 1,
	'background-palette-status-general-hover': true,
	'background-palette-color-general-hover': 6,
	'border-palette-status-general': true,
	'border-palette-color-general': 5,
	'border-sync-width-general': true,
	'border-unit-width-general': 'px',
	'border-top-left-radius-general': 10,
	'border-top-right-radius-general': 10,
	'border-bottom-right-radius-general': 10,
	'border-bottom-left-radius-general': 10,
	'border-sync-radius-general': true,
	'border-unit-radius-general': 'px',
	'icon-inherit': true,
	'icon-content':
		'<svg class="twitter-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24"><path d="M21.856 5.888c-.733.322-1.514.535-2.328.638a4.02 4.02 0 0 0 1.778-2.234c-.781.466-1.643.795-2.563.978a4.05 4.05 0 0 0-2.952-1.279 4.04 4.04 0 0 0-4.038 4.042c0 .32.027.628.094.922-3.36-.164-6.332-1.774-8.329-4.227-.349.605-.553 1.297-.553 2.043 0 1.399.721 2.64 1.795 3.358a3.99 3.99 0 0 1-1.826-.498v.044a4.06 4.06 0 0 0 3.238 3.971c-.329.09-.687.133-1.059.133-.259 0-.52-.015-.765-.069a4.08 4.08 0 0 0 3.776 2.815 8.12 8.12 0 0 1-5.01 1.724 7.58 7.58 0 0 1-.967-.055c1.79 1.154 3.912 1.814 6.199 1.814 7.436 0 11.502-6.16 11.502-11.499a10.34 10.34 0 0 0-.015-.522c.802-.569 1.476-1.28 2.026-2.098z" fill="none" data-stroke="" stroke="var(--maxi-light-color,rgba(var(--maxi-light-color-4), 1))" stroke-width="2" stroke-linejoin="round" stroke-miterlimit="10"></path></svg>',
	'icon-only': true,
	'icon-position': 'left',
	'icon-width-general': 23,
	'icon-width-unit-general': 'px',
	'icon-spacing-general': 0,
	'icon-stroke-general': 1.5,
	'icon-palette-status': true,
	'icon-palette-color': 4,
	'icon-padding-sync-general': true,
	'icon-padding-sync-horizontal-general': false,
	'icon-padding-sync-vertical-general': false,
	'icon-padding-unit-general': 'px',
	'icon-border-palette-status-general': true,
	'icon-border-palette-color-general': 4,
	'icon-border-unit-radius-general': '%',
	'icon-status-hover': true,
	'icon-inherit-hover': true,
	'icon-content-hover': '',
	'icon-only-hover': false,
	'icon-position-hover': 'right',
	'icon-width-general-hover': '',
	'icon-width-unit-general-hover': 'px',
	'icon-spacing-general-hover': 5,
	'icon-stroke-general-hover': '',
	'icon-palette-status-hover': true,
	'icon-palette-color-hover': 6,
	'icon-background-palette-status-hover': true,
	'icon-background-palette-color-hover': 4,
	'icon-background-gradient-opacity-hover': 1,
	'icon-border-palette-status-general-hover': true,
	'icon-border-palette-color-general-hover': 6,
	'icon-border-unit-radius-general-hover': 'px',
	'border-status-hover': true,
	'border-palette-status-general-hover': true,
	'border-palette-color-general-hover': 3,
	'border-unit-radius-general-hover': 'px',
	'size-advanced-options': false,
	'max-width-unit-general': 'px',
	'width-unit-general': 'px',
	'min-width-unit-general': 'px',
	'max-height-unit-general': 'px',
	'height-unit-general': 'px',
	'min-height-unit-general': 'px',
	'box-shadow-palette-status-general': false,
	'box-shadow-palette-color-general': 8,
	'box-shadow-status-hover': false,
	'box-shadow-palette-status-general-hover': true,
	'box-shadow-palette-color-general-hover': 6,
	'margin-sync-general': false,
	'margin-sync-horizontal-general': false,
	'margin-sync-vertical-general': false,
	'margin-unit-general': 'px',
	'padding-top-general': 0,
	'padding-right-general': 0,
	'padding-bottom-general': 0,
	'padding-left-general': 0,
	'padding-sync-general': true,
	'padding-sync-horizontal-general': false,
	'padding-sync-vertical-general': false,
	'padding-unit-general': 'px',
	'padding-top-xxl': 23,
	'padding-right-xxl': 55,
	'padding-bottom-xxl': 23,
	'padding-left-xxl': 55,
	'position-sync-general': false,
	'position-unit-general': 'px',
	'transform-translate-x-unit-general': '%',
	'transform-translate-y-unit-general': '%',
	'transform-origin-x-unit-general': '%',
	'transform-origin-y-unit-general': '%',
	'transition-duration-general': 0.3,
	'transition-delay-general': 0,
	'transition-timing-function': 'ease',
	uniqueID: 'button-maxi-1617',
	isFirstOnHierarchy: true,
	blockStyle: 'maxi-light',
	'border-style-general': 'solid',
	'icon-background-color-general': '',
	'icon-background-palette-color-general': 1,
	'icon-background-palette-status-general': true,
	'icon-border-bottom-left-radius-general': 100,
	'icon-border-bottom-right-radius-general': 100,
	'icon-border-bottom-width-general': 2,
	'icon-border-left-width-general': 2,
	'icon-border-right-width-general': 2,
	'icon-border-style-general': 'solid',
	'icon-border-sync-radius-general': true,
	'icon-border-sync-width-general': true,
	'icon-border-top-left-radius-general': 100,
	'icon-border-top-right-radius-general': 100,
	'icon-border-top-width-general': 2,
	'icon-border-unit-width-general': 'px',
	'icon-padding-bottom-general': 5,
	'icon-padding-left-general': 5,
	'icon-padding-right-general': 5,
	'icon-padding-top-general': 5,
	'icon-width-xxl': 35,
	'icon-border-bottom-left-radius-xxl': 100,
	'icon-border-bottom-right-radius-xxl': 100,
	'icon-border-top-left-radius-xxl': 100,
	'icon-border-top-right-radius-xxl': 100,
	'icon-border-unit-radius-xxl': '%',
	'icon-padding-bottom-xxl': 7,
	'icon-padding-left-xxl': 7,
	'icon-padding-right-xxl': 7,
	'icon-padding-top-xxl': 7,
	'icon-padding-sync-xxl': true,
	'icon-stroke-xxl': 1.3,
	'background-active-media-general-hover': 'none',
	'palette-status-hover': false,
	'icon-border-style-general-hover': 'solid',
	'icon-background-palette-status-general-hover': false,
	'border-top-width-general': 2,
	'border-right-width-general': 2,
	'border-bottom-width-general': 2,
	'border-left-width-general': 2,
	'border-style-general-hover': 'dashed',
	'border-top-width-general-hover': 20,
	'border-right-width-general-hover': 20,
	'border-bottom-width-general-hover': 20,
	'border-left-width-general-hover': 20,
	'border-sync-width-general-hover': true,
	'border-unit-width-general-hover': 'px',
	'border-top-left-radius-general-hover': 100,
	'border-top-right-radius-general-hover': 100,
	'border-bottom-right-radius-general-hover': 100,
	'border-bottom-left-radius-general-hover': 100,
	'border-sync-radius-general-hover': true,
	'border-palette-opacity-general-hover': 40,
};

describe('getGroupAttributes', () => {
	it('Return basic attributes from string', () => {
		expect(getGroupAttributes(attributes, 'border')).toMatchSnapshot();
	});

	it('Return basic attributes from array', () => {
		expect(
			getGroupAttributes(attributes, [
				'border',
				'borderWidth',
				'borderRadius',
			])
		).toMatchSnapshot();
	});

	it('Return basic attributes from string with hover', () => {
		expect(
			getGroupAttributes(attributes, 'border', true)
		).toMatchSnapshot();
	});

	it('Return basic attributes from array with hover', () => {
		expect(
			getGroupAttributes(
				attributes,
				['border', 'borderWidth', 'borderRadius'],
				true
			)
		).toMatchSnapshot();
	});

	it('Return basic attributes from string with prefix', () => {
		expect(
			getGroupAttributes(attributes, 'border', false, 'icon-')
		).toMatchSnapshot();
	});
});
