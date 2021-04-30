import getHoverEffectsBackgroundStyles from '../getHoverEffectsBackgroundStyles';
import '@wordpress/block-editor';
import '@wordpress/i18n';

describe('getHoverEffectsBackgroundStyles', () => {
	it('Get a correct Hover Effects', () => {
		const object = {
			/** 'hover-type': 'none',
			'hover-preview': 'true',
			'hover-basic-effect-type': 'zoom-in',
			'hover-text-effect-type': 'fade',
			'hover-text-preset': 'center-center',
			'hover-transition-easing': 'easing',
			'hover-transition-easing-cubic-bezier': 'object',
			'hover-transition-duration': 0.3,
			'hover-basic-zoom-in-value': 1.3,
			'hover-basic-zoom-out-value': 1.5,
			'hover-basic-slide-value': 30,
			'hover-basic-rotate-value': 15,
			'hover-basic-blur-value': 2,
			'hover-border-status': 'true',
			'hover-background-status': 'true',
			'hover-background-active-media': 'red',
			'hover-margin-status': 'true',
			'hover-padding-status': 'false',
			'hover-title-typography-status': 'true',
			'hover-title-typography-content': 'typography content',
			'hover-title-font-size-general': 4,
			'hover-title-color-general': 'blue',
			'hover-content-typography-status': 'true',
			'hover-content-typography-content': 'content', */
		};

		const result = getHoverEffectsBackgroundStyles(object);
		expect(result).toMatchSnapshot();
	});
});
