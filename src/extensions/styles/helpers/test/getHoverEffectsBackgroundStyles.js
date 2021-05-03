import getHoverEffectsBackgroundStyles from '../getHoverEffectsBackgroundStyles';
import '@wordpress/block-editor';
import '@wordpress/i18n';

describe('getHoverEffectsBackgroundStyles', () => {
	it('Get a correct hover effects background style', () => {
		const object = {
			'hover-background-active-media': 'color',
			'hover-background-color': 'rgb(255, 99, 71)',
		};

		const objectGradient = {
			'hover-background-active-media': 'gradient',
			'hover-background-gradient': 'rgb(255, 99, 71)',
		};

		const result = getHoverEffectsBackgroundStyles(object);
		expect(result).toMatchSnapshot();

		const resultGradient = getHoverEffectsBackgroundStyles(objectGradient);
		expect(resultGradient).toMatchSnapshot();
	});
});
