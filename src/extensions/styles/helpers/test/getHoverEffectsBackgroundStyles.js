import getHoverEffectsBackgroundStyles from '../getHoverEffectsBackgroundStyles';
import '@wordpress/i18n';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
	};
});

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
