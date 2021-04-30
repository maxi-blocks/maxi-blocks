import getHoverEffectsBackgroundStyles from '../getHoverEffectsBackgroundStyles';
import '@wordpress/block-editor';
import '@wordpress/i18n';

describe('getHoverEffectsBackgroundStyles', () => {
	it('Get a correct Hover Effects', () => {
		const object = {
			'hover-background-active-media': 'color',
			'hover-background-color': 'red',
		};

		const objectGradient = {
			'hover-background-active-media': 'gradient',
			'hover-background-gradient': 'red',
		};

		const result = getHoverEffectsBackgroundStyles(object);
		expect(result).toMatchSnapshot();

		const resultGradient = getHoverEffectsBackgroundStyles(objectGradient);
		expect(resultGradient).toMatchSnapshot();
	});
});
