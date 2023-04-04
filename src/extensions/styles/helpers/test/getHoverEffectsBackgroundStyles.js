import getHoverEffectsBackgroundStyles from '../getHoverEffectsBackgroundStyles';
import '@wordpress/i18n';
import parseLongAttrObj from '../../../attributes/dictionary/parseLongAttrObj';

describe('getHoverEffectsBackgroundStyles', () => {
	it('Get a correct hover effects color background style', () => {
		const object = parseLongAttrObj({
			'hover-background-active-media-general': 'color',
			'hover-background-color-custom-color-general': 'rgb(255,99,71)',
		});

		const result = getHoverEffectsBackgroundStyles(object, 'light');
		expect(result).toMatchSnapshot();
	});

	it('Get a correct hover effects gradient background style', () => {
		const objectGradient = parseLongAttrObj({
			'hover-background-active-media-general': 'gradient',
			'hover-background-gradient-opacity-general': 0.8,
			'hover-background-gradient-content-general':
				'linear-gradient(135deg,rgba(6,147,200,0.5) 0%,rgb(224,82,100) 100%)',
		});

		const resultGradient = getHoverEffectsBackgroundStyles(objectGradient);
		expect(resultGradient).toMatchSnapshot();
	});
});
