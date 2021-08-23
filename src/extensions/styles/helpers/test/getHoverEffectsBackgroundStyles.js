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
			'hover-background-gradient':
				'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgba(224,82,84,1) 100%)',
		};

		const result = getHoverEffectsBackgroundStyles(object);
		expect(result).toMatchSnapshot();

		const resultGradient = getHoverEffectsBackgroundStyles(objectGradient);
		expect(resultGradient).toMatchSnapshot();
	});
});
