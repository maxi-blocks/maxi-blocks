import getOrganizedAttributes from '@extensions/copy-paste/getOrganizedAttributes';
import { copyPasteMapping } from '@blocks/image-maxi/data';

jest.mock('@wordpress/blocks', () => jest.fn());
jest.mock('src/components/block-inserter/index.js', () => jest.fn());
jest.mock('src/components/index.js', () => jest.fn());
jest.mock('src/extensions/dom/dom.js', () => jest.fn());
// Add these mock statements at the top of your test file
jest.mock('src/extensions/styles/index.js', () => ({
	createIconTransitions: jest.fn(),
}));
jest.mock('src/blocks/search-maxi/data.js', () => ({}));
jest.mock('src/components/transform-control/utils.js', () => ({}));
jest.mock('src/extensions/relations/getAdvancedSettings.js', () => ({}));
jest.mock('src/extensions/relations/index.js', () => ({}));
jest.mock('src/blocks/accordion-maxi/data.js', () => ({}));
jest.mock('src/blocks/data.js', () => ({}));
jest.mock('src/extensions/attributes/getBlockData.js', () => ({}));
jest.mock('src/extensions/attributes/index.js', () => ({}));
jest.mock('src/extensions/styles/getDefaultAttribute.js', () => ({}));
jest.mock('src/extensions/maxi-block/handleSetAttributes.js', () => ({}));
jest.mock('src/extensions/maxi-block/index.js', () => ({}));
jest.mock('src/extensions/styles/store/selectors.js', () => ({}));
jest.mock('src/components/alignment-control/index.js', () => ({}));
jest.mock('src/extensions/styles/store/index.js', () => ({}));
jest.mock('src/components/advanced-number-control/index.js', () => ({}));
jest.mock('src/components/setting-tabs-control/index.js', () => ({}));
jest.mock('src/components/button/index.js', () => ({}));
jest.mock('src/components/icon/index.js', () => ({}));
jest.mock('src/editor/library/index.js', () => ({}));
jest.mock('src/extensions/inspector/inspectorPath.js', () => ({}));
jest.mock('src/components/clip-path-control/index.js', () => ({}));
jest.mock('src/blocks/image-maxi/data.js', () => ({}));

describe('getOrganizedAttributes', () => {
	it('Ensure it works with simple copy paste object', () => {
		const copyPasteMapping = {
			settings: {
				Content: 'content',
				Alt: 'alt',
			},
			advanced: {
				Class: 'class',
				Style: 'style',
			},
		};

		const attributes = {
			content: 'Test',
			alt: 'Alt text',
			class: 'class text',
			style: 'style text',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with groups', () => {
		const copyPasteMapping = {
			settings: {
				Content: {
					group: {
						Content: 'content',
						'Content on close': 'closeContent',
					},
				},
			},
		};

		const attributes = {
			content: 'Test',
			closeContent: 'Test on close',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with multiply nested groups', () => {
		const copyPasteMapping = {
			settings: {
				Content: {
					group: {
						Content: 'content',
						'Content settings': {
							group: {
								'Content font size': 'fontSize',
								'Content font weight': 'fontWeight',
							},
						},
					},
				},
			},
		};

		const attributes = {
			content: 'Test',
			fontSize: '12px',
			fontWeight: 'bold',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with responsive attributes', () => {
		const copyPasteMapping = {
			settings: {
				Width: {
					props: 'width',
					hasBreakpoints: true,
				},
			},
		};

		const attributes = {
			'width-general': '80%',
			'width-l': undefined,
			'width-m': '100%',
			'width-s': '50%',
			'width-xs': '60%',
			'width-xxl': '95%',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with prefixes', () => {
		const copyPasteMapping = {
			settings: {
				Width: {
					group: {
						'Column width': {
							props: 'width',
							prefix: 'column-',
						},
						'Row width': 'width',
					},
					// Checking if row will take this prefix and column prefix will be overridden by his own
					prefix: 'row-',
				},
			},
		};

		const attributes = {
			'row-width': '80%',
			'column-width': '100%',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with palette', () => {
		const copyPasteMapping = {
			settings: {
				Color: {
					props: 'text',
					isPalette: true,
				},
			},
		};

		const attributes = {
			'text-palette-status': true,
			'text-palette-color': 4,
			'text-palette-opacity': 0.5,
			'text-color': '#fff',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with group attributes', () => {
		const copyPasteMapping = {
			settings: {
				Overflow: {
					groupAttributes: 'overflow',
				},
			},
		};

		const attributes = {
			'overflow-x-general': 'visible',
			'overflow-y-general': 'hidden',
			'overflow-x-xxl': 'hidden',
			'overflow-y-xxl': 'visible',
			'overflow-x-xl': 'auto',
			'overflow-y-xl': 'clip',
			'overflow-x-l': 'clip',
			'overflow-y-l': 'auto',
			'overflow-x-m': 'scroll',
			'overflow-y-m': 'scroll',
			'overflow-x-s': 'auto',
			'overflow-y-s': 'auto',
			'overflow-x-xs': 'visible',
			'overflow-y-xs': 'visible',
			// add some random attributes to check if they are not copied
			'text-palette-status': true,
			'text-palette-color': 4,
			'text-palette-opacity': 0.5,
			'text-color': '#fff',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with group attributes with prefix', () => {
		const copyPasteMapping = {
			settings: {
				Overflow: {
					groupAttributes: 'overflow',
					prefix: 'row-',
				},
			},
		};

		const attributes = {
			'row-overflow-x-general': 'visible',
			'row-overflow-y-general': 'hidden',
			'overflow-x-xxl': 'hidden',
			'row-overflow-y-xxl': 'visible',
			'overflow-x-xl': 'auto',
			'row-overflow-y-xl': 'clip',
			'overflow-x-l': 'clip',
			'overflow-y-l': 'auto',
			'row-overflow-x-m': 'scroll',
			'overflow-y-m': 'scroll',
			'row-overflow-x-s': 'auto',
			'overflow-y-s': 'auto',
			'row-overflow-x-xs': 'visible',
			'overflow-y-xs': 'visible',
			// add some random attributes to check if they are not copied
			'text-palette-status': true,
			'row-text-palette-color': 4,
			'text-palette-opacity': 0.5,
			'row-text-color': '#fff',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Should ignore groups, which have names that start with underscore', () => {
		const copyPasteMapping = {
			settings: {
				Width: {
					props: 'width',
					hasBreakpoints: true,
				},
				_Height: {
					props: 'height',
					hasBreakpoints: true,
				},
			},
			_exclude: [
				'some attribute (they are excluded by another function, so dont care)',
			],
			_notSettings: {
				Height: {
					props: 'height',
					hasBreakpoints: true,
				},
			},
		};
		const attributes = {
			'width-general': '80%',
			'width-l': undefined,
			'width-m': '100%',
			'width-s': '50%',
			'width-xs': '60%',
			'width-xxl': '95%',
			'height-general': '80%',
			'height-l': undefined,
			'height-m': '100%',
			'height-s': '50%',
			'height-xs': '60%',
			'height-xxl': '95%',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with multiply conditions', () => {
		const copyPasteMapping = {
			settings: {
				Color: {
					group: {
						Color: ['fill', 'line'],
						'Color on hover': {
							props: ['fill', 'line'],
							isHover: true,
						},
					},
					hasBreakpoints: true,
					isPalette: true,
					prefix: 'row-',
				},
			},
		};

		const attributes = {
			// Fill
			'row-fill-color-general-hover': null,
			'color-general': null,
			'row-fill-color-l-hover': null,
			'color-fill-fill-l': null,
			'row-color-m-hover': 'rgba(43,108,153,0.85)',
			'color-fill-m': 'rgba(166,105,105,0.44)',
			'row-fill-color-s-hover': 'rgba(43,108,153,0.85)',
			'color-s': 'rgba(166,105,105,0.44)',
			'row-fill-color-xs-hover': 'rgba(43,108,153,0.85)',
			'color-xs': 'rgba(166,105,105,0.44)',
			'row-fill-palette-color-general-hover': 6,
			'palette-fill-color-general': 4,
			'row-palette-color-l-hover': 7,
			'palette-fill-color-l': 5,
			'row-palette-color-m-hover': 7,
			'palette-fill-color-m': 5,
			'row-fill-palette-color-s-hover': 6,
			'palette-fill-color-s': 3,
			'row-palette-color-xs-hover': 3,
			'palette-fill-color-xs': 8,
			'row-palette-opacity-general-hover': 1,
			'palette-fill-opacity-general': 1,
			'row-fill-palette-opacity-l-hover': 0.52,
			'palette-opacity-l': 0.44,
			'row-fill-palette-opacity-m-hover': 0.85,
			'palette-opacity-m': 0.44,
			'row-fill-palette-opacity-s-hover': 1,
			'palette-fill-opacity-s': 1,
			'row-fill-palette-opacity-xs-hover': 0.58,
			'palette-opacity-xs': 0.06,
			'row-fill-palette-status-general-hover': true,
			'palette-status-general': true,
			'row-fill-palette-status-l-hover': true,
			'palette-fill-status-l': true,
			'row-palette-status-m-hover': false,
			'palette-fill-status-m': false,
			'row-palette-status-s-hover': true,
			'palette-fill-status-s': true,
			'row-fill-palette-status-xs-hover': true,
			'palette-fill-status-xs': true,
			// Line
			'row-color-general-hover': null,
			'color-line-general': null,
			'row-line-color-l-hover': null,
			'color-l': null,
			'row-line-color-m-hover': 'rgba(43,108,153,0.85)',
			'color-m': 'rgba(166,105,105,0.44)',
			'row-color-s-hover': 'rgba(43,108,153,0.85)',
			'color-line-s': 'rgba(166,105,105,0.44)',
			'row-line-color-xs-hover': 'rgba(43,108,153,0.85)',
			'row-palette-color-general-hover': 6,
			'palette-color-general': 4,
			'row-line-palette-color-l-hover': 7,
			'palette-line-color-l': 5,
			'palette-color-m': 5,
			'row-palette-color-s-hover': 6,
			'palette-line-color-s': 3,
			'palette-color-xs': 8,
			'palette-line-opacity-general': 1,
			'row-line-palette-opacity-l-hover': 0.52,
			'palette-line-opacity-l': 0.44,
			'row-line-palette-opacity-m-hover': 0.85,
			'row-palette-opacity-s-hover': 1,
			'palette-line-opacity-s': 1,
			'row-palette-opacity-xs-hover': 0.58,
			'row-palette-status-general-hover': true,
			'row-line-palette-status-l-hover': true,
			'palette-status-l': true,
			'row-line-palette-status-m-hover': false,
			'palette-line-status-m': false,
			'palette-line-status-s': true,
			'row-palette-status-xs-hover': true,
			'palette-line-status-xs': true,
			// Other attributes to check if they are not copied
			blockStyle: 'light',
			'column-gap-unit-general': 'px',
			customLabel: 'Text_1',
			'flex-basis-unit-general': 'px',
			'font-size-unit-general': 'px',
			'full-width-general': 'normal',
			'height-unit-general': 'px',
			isFirstOnHierarchy: true,
			'letter-spacing-unit-general': 'px',
			'line-height-unit-general': 'px',
			'list-palette-color-general': 4,
			'list-palette-status-general': true,
			'max-height-unit-general': 'px',
			'max-width-unit-general': 'px',
			'min-height-unit-general': 'px',
			'min-width-unit-general': 'px',
			'overflow-x-general': 'visible',
			'overflow-y-general': 'visible',
			'position-bottom-unit-general': 'px',
			'position-general': 'inherit',
			'position-left-unit-general': 'px',
			'position-right-unit-general': 'px',
			'position-sync-general': 'all',
			'position-top-unit-general': 'px',
			'row-gap-unit-general': 'px',
			'size-advanced-options': false,
			'text-indent-unit-general': 'px',
			'typography-status-hover': true,
			uniqueID: 'text-maxi-1',
			'width-fit-content-general': false,
			'width-unit-general': 'px',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it.skip('Ensure getOrganizedAttributes work correctly with image copy-paste', () => {
		const object = {
			defaultBlockStyle: 'maxi-def-light',
			customLabel: 'Image',
			fullWidth: 'normal',
			'alignment-general': 'right',
			imageRatio: 'original',
			captionType: 'custom',
			captionContent: 'Basket Ball',
			captionPosition: 'bottom',
			'caption-gap-general': 2,
			'caption-gap-unit-general': 'em',
			imageSize: 'full',
			isImageUrl: false,
			altSelector: 'title',
			'img-width-general': 82,
			'clip-path-status-general': false,
			'link-palette-status-general': true,
			'link-palette-color-general': 4,
			'link-hover-palette-status-general': true,
			'link-hover-palette-color-general': 6,
			'link-active-palette-status-general': true,
			'link-active-palette-color-general': 6,
			'link-visited-palette-status-general': true,
			'link-visited-palette-color-general': 6,
			'palette-status-general': true,
			'palette-color-general': 3,
			'font-size-unit-general': 'px',
			'line-height-unit-general': 'px',
			'letter-spacing-unit-general': 'px',
			'text-indent-unit-general': 'px',
			'hover-type': 'none',
			'hover-preview': true,
			'hover-extension': false,
			'hover-basic-effect-type': 'zoom-in',
			'hover-text-effect-type': 'fade',
			'hover-text-preset': 'center-center',
			'hover-transition-easing': 'easing',
			'hover-transition-duration': 0.5,
			'hover-basic-zoom-in-value': 1.3,
			'hover-basic-zoom-out-value': 1.5,
			'hover-basic-slide-value': 30,
			'hover-basic-rotate-value': 15,
			'hover-basic-blur-value': 2,
			'hover-background-status': false,
			'hover-background-palette-status-general': true,
			'hover-background-palette-color-general': 1,
			'hover-background-color-clip-path-status-general': false,
			'hover-background-gradient-opacity-general': 1,
			'hover-background-gradient-clip-path-status-general': false,
			'hover-border-palette-status-general': true,
			'hover-border-palette-color-general': 2,
			'hover-border-status': false,
			'hover-border-sync-radius-general': 'all',
			'hover-border-unit-radius-general': 'px',
			'hover-border-top-width-general': 2,
			'hover-border-right-width-general': 2,
			'hover-border-bottom-width-general': 2,
			'hover-border-left-width-general': 2,
			'hover-border-sync-width-general': 'all',
			'hover-border-unit-width-general': 'px',
			'hover-content-palette-status-general': true,
			'hover-content-palette-color-general': 1,
			'hover-content-font-size-unit-general': 'px',
			'hover-content-font-size-general': 18,
			'hover-content-line-height-unit-general': 'px',
			'hover-content-letter-spacing-unit-general': 'px',
			'hover-content-text-indent-unit-general': 'px',
			'hover-content-typography-status': false,
			'hover-content-typography-content': 'Add your Hover Title here',
			'hover-margin-sync-general': 'all',
			'hover-margin-top-unit-general': 'px',
			'hover-margin-right-unit-general': 'px',
			'hover-margin-bottom-unit-general': 'px',
			'hover-margin-left-unit-general': 'px',
			'hover-margin-status': false,
			'hover-padding-top-unit-general': 'px',
			'hover-padding-right-unit-general': 'px',
			'hover-padding-bottom-unit-general': 'px',
			'hover-padding-left-unit-general': 'px',
			'hover-padding-sync-general': 'all',
			'hover-padding-status': false,
			'hover-title-palette-status-general': true,
			'hover-title-palette-color-general': 1,
			'hover-title-font-size-unit-general': 'px',
			'hover-title-font-size-general': 30,
			'hover-title-line-height-unit-general': 'px',
			'hover-title-letter-spacing-unit-general': 'px',
			'hover-title-text-indent-unit-general': 'px',
			'hover-title-typography-status': false,
			'hover-title-typography-content': 'Add your Hover Title here',
			'image-border-palette-status-general': true,
			'image-border-palette-color-general': 7,
			'image-border-palette-status-general-hover': true,
			'image-border-palette-color-general-hover': 4,
			'image-border-status-hover': true,
			'image-border-sync-radius-general': 'all',
			'image-border-unit-radius-general': 'px',
			'image-border-unit-radius-general-hover': 'px',
			'image-border-top-width-general': 3,
			'image-border-right-width-general': 3,
			'image-border-bottom-width-general': 3,
			'image-border-left-width-general': 3,
			'image-border-sync-width-general': 'all',
			'image-border-unit-width-general': 'px',
			'image-box-shadow-palette-status-general': true,
			'image-box-shadow-palette-color-general': 8,
			'image-box-shadow-palette-color-general-hover': 6,
			'image-box-shadow-status-hover': false,
			'image-size-advanced-options': false,
			'image-max-width-unit-general': 'px',
			'image-width-unit-general': 'px',
			'image-width-fit-content-general': false,
			'image-min-width-unit-general': 'px',
			'image-max-height-unit-general': 'px',
			'image-height-unit-general': 'px',
			'image-min-height-unit-general': 'px',
			'image-padding-top-unit-general': 'px',
			'image-padding-right-unit-general': 'px',
			'image-padding-bottom-unit-general': 'px',
			'image-padding-left-unit-general': 'px',
			'image-padding-sync-general': 'all',
			blockFullWidth: 'normal',
			'block-background-status-hover': false,
			'border-palette-status-general': true,
			'border-palette-color-general': 2,
			'border-palette-status-general-hover': true,
			'border-palette-color-general-hover': 6,
			'border-status-hover': false,
			'border-sync-radius-general': 'all',
			'border-unit-radius-general': 'px',
			'border-unit-radius-general-hover': 'px',
			'border-top-width-general': 2,
			'border-right-width-general': 2,
			'border-bottom-width-general': 2,
			'border-left-width-general': 2,
			'border-sync-width-general': 'all',
			'border-unit-width-general': 'px',
			'box-shadow-palette-status-general': true,
			'box-shadow-palette-color-general': 5,
			'box-shadow-palette-color-general-hover': 6,
			'box-shadow-status-hover': false,
			'size-advanced-options': false,
			'max-width-unit-general': 'px',
			'width-unit-general': 'px',
			'width-fit-content-general': false,
			'min-width-unit-general': 'px',
			'max-height-unit-general': 'px',
			'height-unit-general': 'px',
			'min-height-unit-general': 'px',
			'margin-sync-general': 'all',
			'margin-top-unit-general': 'px',
			'margin-right-unit-general': 'px',
			'margin-bottom-unit-general': 'px',
			'margin-left-unit-general': 'px',
			'padding-top-unit-general': 'px',
			'padding-right-unit-general': 'px',
			'padding-bottom-unit-general': 'px',
			'padding-left-unit-general': 'px',
			'padding-sync-general': 'all',
			shortcutEffect: 0,
			'scroll-vertical-status-general': false,
			'scroll-vertical-preview-status-general': false,
			'scroll-vertical-easing-general': 'ease',
			'scroll-vertical-speed-general': 500,
			'scroll-vertical-delay-general': 0,
			'scroll-vertical-viewport-top-general': 'mid',
			'scroll-vertical-status-reverse-general': true,
			'scroll-vertical-offset-start-general': -400,
			'scroll-vertical-offset-mid-general': 0,
			'scroll-vertical-offset-end-general': 400,
			'scroll-horizontal-status-general': false,
			'scroll-horizontal-preview-status-general': false,
			'scroll-horizontal-easing-general': 'ease',
			'scroll-horizontal-speed-general': 500,
			'scroll-horizontal-delay-general': 0,
			'scroll-horizontal-viewport-top-general': 'mid',
			'scroll-horizontal-status-reverse-general': true,
			'scroll-horizontal-offset-start-general': -200,
			'scroll-horizontal-offset-mid-general': 0,
			'scroll-horizontal-offset-end-general': 200,
			'scroll-rotate-status-general': false,
			'scroll-rotate-preview-status-general': false,
			'scroll-rotate-easing-general': 'ease',
			'scroll-rotate-speed-general': 500,
			'scroll-rotate-delay-general': 0,
			'scroll-rotate-viewport-top-general': 'mid',
			'scroll-rotate-status-reverse-general': true,
			'scroll-rotate-rotate-start-general': 90,
			'scroll-rotate-rotate-mid-general': 0,
			'scroll-rotate-rotate-end-general': 0,
			'scroll-scale-status-general': false,
			'scroll-scale-preview-status-general': false,
			'scroll-scale-easing-general': 'ease',
			'scroll-scale-speed-general': 500,
			'scroll-scale-delay-general': 0,
			'scroll-scale-viewport-top-general': 'mid',
			'scroll-scale-status-reverse-general': true,
			'scroll-scale-scale-start-general': 70,
			'scroll-scale-scale-mid-general': 100,
			'scroll-scale-scale-end-general': 100,
			'scroll-fade-status-general': false,
			'scroll-fade-preview-status-general': false,
			'scroll-fade-easing-general': 'ease',
			'scroll-fade-speed-general': 500,
			'scroll-fade-delay-general': 0,
			'scroll-fade-viewport-top-general': 'mid',
			'scroll-fade-status-reverse-general': true,
			'scroll-fade-opacity-start-general': 0,
			'scroll-fade-opacity-mid-general': 100,
			'scroll-fade-opacity-end-general': 100,
			'scroll-blur-status-general': false,
			'scroll-blur-preview-status-general': false,
			'scroll-blur-easing-general': 'ease',
			'scroll-blur-speed-general': 500,
			'scroll-blur-delay-general': 0,
			'scroll-blur-viewport-top-general': 'mid',
			'scroll-blur-status-reverse-general': true,
			'scroll-blur-blur-start-general': 10,
			'scroll-blur-blur-mid-general': 0,
			'scroll-blur-blur-end-general': 0,
			'transform-translate-x-unit-general': '%',
			'transform-translate-y-unit-general': '%',
			'transform-origin-x-unit-general': '%',
			'transform-origin-y-unit-general': '%',
			'position-sync-general': 'all',
			'position-unit-general': 'px',
			'flex-basis-unit-general': 'px',
			'row-gap-unit-general': 'px',
			'column-gap-unit-general': 'px',
			uniqueID: 'image-maxi-331',
			isFirstOnHierarchy: true,
			blockStyle: 'maxi-light',
			parentBlockStyle: 'light',
			mediaID: 22,
			mediaURL:
				'http://localhost:8888/wp-content/uploads/2022/04/ball.jpg',
			mediaWidth: 225,
			mediaHeight: 225,
			mediaAlt: 'ball',
			'text-alignment-general': 'center',
			SVGElement:
				'<svg viewBox="0 0 36.1 36.1" class="heart-54-shape-maxi-svg" data-item="image-maxi-331__svg"><pattern id="image-maxi-331__428__img" class="maxi-svg-block__pattern" width="100%" height="100%" x="0" y="0" patternunits="userSpaceOnUse"><image class="maxi-svg-block__pattern__image" width="100%" height="100%" x="0" y="0" href="http://localhost:8888/wp-content/uploads/2022/04/ball.jpg" preserveaspectratio="xMidYMid slice"></image></pattern><path fill="url(#image-maxi-331__428__img)" data-fill="" fill-rule="evenodd" d="M2.2 6.2h0c2.7-2.7 7.2-2.7 10 0L18 12l5.8-5.8c2.7-2.7 7.2-2.7 10 0h0c2.7 2.7 2.7 7.2 0 10L18 32 2.2 16.2c-2.7-2.8-2.7-7.3 0-10h0z" style="fill: url(#image-maxi-331__428__img)"></path></svg>',
			SVGData: {
				'image-maxi-331__428': {
					color: '',
					imageID: 22,
					imageURL:
						'http://localhost:8888/wp-content/uploads/2022/04/ball.jpg',
				},
			},
			'image-border-style-general': 'dashed',
			'image-border-top-left-radius-general': 71,
			'image-border-top-right-radius-general': 71,
			'image-border-bottom-right-radius-general': 71,
			'image-border-bottom-left-radius-general': 71,
			'image-border-style-general-hover': 'dashed',
			'image-border-top-width-general-hover': 3,
			'image-border-right-width-general-hover': 3,
			'image-border-bottom-width-general-hover': 3,
			'image-border-left-width-general-hover': 3,
			'image-border-sync-width-general-hover': 'all',
			'image-border-unit-width-general-hover': 'px',
			'image-border-top-left-radius-general-hover': 71,
			'image-border-top-right-radius-general-hover': 71,
			'image-border-bottom-right-radius-general-hover': 71,
			'image-border-bottom-left-radius-general-hover': 71,
			'image-border-sync-radius-general-hover': 'all',
			'box-shadow-palette-opacity-general': 0.23,
			'box-shadow-horizontal-general': 0,
			'box-shadow-vertical-general': 30,
			'box-shadow-blur-general': 50,
			'box-shadow-spread-general': 0,
			'transform-scale-x-general': 65,
			'transform-scale-y-general': 110,
		};

		const result = getOrganizedAttributes(object, copyPasteMapping);
		expect(result).toMatchSnapshot();

		const result2 = getOrganizedAttributes(object, copyPasteMapping, true);
		expect(result2).toMatchSnapshot();
	});
});
