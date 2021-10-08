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
// jest.mock('@wordpress/blocks', () => {
// 	return {
// 		getBlockAttributes: jest.fn(),
// 	};
// });

describe('getHoverEffectsBackgroundStyles', () => {
	it('Get a correct hover effects background style', () => {
		const object = {
			'hover-background-active-media': 'color',
			'hover-background-color': 'rgb(255,99,71)',
		};

		const objectGradient = {
			'hover-background-active-media': 'gradient',
			'hover-background-gradient-opacity': 0.8,
			'hover-background-gradient':
				'linear-gradient(135deg,rgba(6,147,200,0.5) 0%,rgb(224,82,100) 100%)',
		};

		debugger;

		const result = getHoverEffectsBackgroundStyles(object);
		expect(result).toMatchSnapshot();

		const resultGradient = getHoverEffectsBackgroundStyles(objectGradient);

		expect(resultGradient).toMatchSnapshot();
	});
});
