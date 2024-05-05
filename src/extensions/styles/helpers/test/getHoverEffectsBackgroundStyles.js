import getHoverEffectsBackgroundStyles from '../getHoverEffectsBackgroundStyles';

/**
 * PHP snapshots
 */
import correctHoverEffectColorBackgroundStyle from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Hover_Effects_Background_Styles_Test__test_get_a_correct_hover_effects_color_background_style__1.json';
import correctHoverEffectGradientBackgroundStyle from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Hover_Effects_Background_Styles_Test__test_get_a_correct_hover_effects_gradient_background_style__1.json';

describe('getHoverEffectsBackgroundStyles', () => {
	it('Get a correct hover effects color background style', () => {
		const object = {
			'hover-background-active-media-general': 'color',
			'hover-background-color-general': 'rgb(255,99,71)',
		};

		const result = getHoverEffectsBackgroundStyles(object, 'light');
		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctHoverEffectColorBackgroundStyle);
	});

	it('Get a correct hover effects gradient background style', () => {
		const objectGradient = {
			'hover-background-active-media-general': 'gradient',
			'hover-background-gradient-opacity-general': 0.8,
			'hover-background-gradient-general':
				'linear-gradient(135deg,rgba(6,147,200,0.5) 0%,rgb(224,82,100) 100%)',
		};

		const resultGradient = getHoverEffectsBackgroundStyles(
			objectGradient,
			'light'
		);
		expect(resultGradient).toMatchSnapshot();
		expect(resultGradient).toEqual(
			correctHoverEffectGradientBackgroundStyle
		);
	});
});
