import getHoverEffectsBackgroundStyles from '../getHoverEffectsBackgroundStyles';
import '@wordpress/i18n';

describe('getHoverEffectsBackgroundStyles', () => {
	it('Get a correct hover effects color background style', () => {
		const object = {
			'h-b_am-g': 'color',
			'h-bc_cc-g': 'rgb(255,99,71)',
		};

		const result = getHoverEffectsBackgroundStyles(object, 'light');
		expect(result).toMatchSnapshot();
	});

	it('Get a correct hover effects gradient background style', () => {
		const objectGradient = {
			'h-b_am-g': 'gradient',
			'h-bg_o-g': 0.8,
			'h-bg_c-g':
				'linear-gradient(135deg,rgba(6,147,200,0.5) 0%,rgb(224,82,100) 100%)',
		};

		const resultGradient = getHoverEffectsBackgroundStyles(objectGradient);
		expect(resultGradient).toMatchSnapshot();
	});
});
