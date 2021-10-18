import getGroupAttributes from '../getGroupAttributes';

const attributes = {
	blockStyleBackground: 1,
	defaultBlockStyle: 'maxi-def-light',
	extraClassName: '',
	customLabel: 'Group',
	fullWidth: 'normal',
	'arrow-status': false,
	'arrow-side-general': 'bottom',
	'arrow-position-general': 50,
	'arrow-width-general': 80,
	'background-hover-status': false,
	'border-palette-color-status-general': true,
	'border-palette-color-general': 2,
	'border-status-hover': true,
	'border-palette-color-status-general-hover': true,
	'border-palette-color-general-hover': 3,
	'border-sync-radius-general': true,
	'border-unit-radius-general': 'px',
	'border-unit-radius-general-hover': 'px',
	'border-sync-width-general': true,
	'border-unit-width-general': 'px',
	'box-shadow-palette-color-status-general': true,
	'box-shadow-palette-color-general': 8,
	'box-shadow-status-hover': false,
	'box-shadow-palette-color-status-general-hover': true,
	'box-shadow-palette-color-general-hover': 6,
	'margin-sync-general': false,
	'margin-sync-horizontal-general': false,
	'margin-sync-vertical-general': false,
	'margin-unit-general': 'px',
	'motion-status': false,
	'motion-active-time-line-time': 0,
	'motion-active-time-line-index': 0,
	'motion-transform-origin-x': 'center',
	'motion-transform-origin-y': 'center',
	'motion-preset-status': false,
	'motion-preview-status': false,
	'motion-tablet-status': true,
	'motion-mobile-status': true,
	'padding-sync-general': false,
	'padding-sync-horizontal-general': false,
	'padding-sync-vertical-general': false,
	'padding-unit-general': 'px',
	'parallax-status': true,
	'parallax-speed': 4,
	'parallax-direction': 'up',
	'parallax-background-image-size-general': 'auto',
	'parallax-background-image-width-general': 600,
	'parallax-background-image-width-unit-general': '%',
	'parallax-background-image-height-general': 600,
	'parallax-background-image-height-unit-general': '%',
	'parallax-background-image-repeat-general': 'no-repeat',
	'parallax-background-image-position-general': 'center center',
	'parallax-background-image-position-width-unit-general': '%',
	'parallax-background-image-position-width-general': 0,
	'parallax-background-image-position-height-unit-general': '%',
	'parallax-background-image-position-height-general': 0,
	'parallax-background-image-origin-general': 'padding-box',
	'parallax-background-image-clip-general': 'border-box',
	'parallax-background-image-attachment-general': 'scroll',
	'parallax-background-image-opacity-general': 0.59,
	'position-sync-general': false,
	'position-unit-general': 'px',
	'size-advanced-options': false,
	'max-width-unit-general': 'px',
	'width-unit-general': 'px',
	'min-width-unit-general': 'px',
	'max-height-unit-general': 'px',
	'height-unit-general': 'px',
	'min-height-unit-general': 'px',
	'transform-translate-x-unit-general': '%',
	'transform-translate-y-unit-general': '%',
	'transform-origin-x-unit-general': '%',
	'transform-origin-y-unit-general': '%',
	uniqueID: 'group-maxi-189190',
	isFirstOnHierarchy: true,
	blockStyle: 'maxi-light',
	parentBlockStyle: 'light',
	'border-color-general': '',
	'border-style-general': 'solid',
	'border-top-width-general': 2,
	'border-right-width-general': 2,
	'border-bottom-width-general': 2,
	'border-left-width-general': 2,
	'border-top-left-radius-general': 40,
	'border-top-right-radius-general': 40,
	'border-bottom-right-radius-general': 40,
	'border-bottom-left-radius-general': 40,
	'border-style-general-hover': 'dashed',
	'border-top-width-general-hover': 10,
	'border-right-width-general-hover': 10,
	'border-bottom-width-general-hover': 10,
	'border-left-width-general-hover': 10,
	'border-sync-width-general-hover': true,
	'border-unit-width-general-hover': 'px',
	'border-top-left-radius-general-hover': 4,
	'border-top-right-radius-general-hover': 4,
	'border-bottom-right-radius-general-hover': 4,
	'border-bottom-left-radius-general-hover': 4,
	'border-sync-radius-general-hover': true,
	'border-palette-opacity-general-hover': 48,
	'background-image-size': 'cover',
	'parallax-background-image-mediaID-xl': 226,
	'parallax-background-image-mediaURL-xl':
		'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
	'parallax-background-image-width-xl': 600,
	'parallax-background-image-height-xl': 600,
	'parallax-background-image-mediaID-general': 226,
	'parallax-background-image-mediaURL-general':
		'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
	'parallax-background-image-opacity-xl': 0.59,
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
			getGroupAttributes(
				attributes,
				'backgroundImage',
				false,
				'parallax-'
			)
		).toMatchSnapshot();
	});
});
