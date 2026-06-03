jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.requireActual('@extensions/styles/getGroupAttributes')
		.default,
	styleProcessor: jest.fn(styles => styles),
}));

jest.mock('@extensions/relations', () => ({
	getCanvasSettings: jest.fn(() => ({})),
	getAdvancedSettings: jest.fn(() => ({})),
}));

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => 0)
);

jest.mock('src/extensions/style-cards/getActiveStyleCard.js', () => {
	return jest.fn(() => {
		return {
			value: {
				name: 'Maxi (Default)',
				status: 'active',
				light: {
					styleCard: {},
					defaultStyleCard: {
						color: {
							1: '255,255,255',
							2: '242,249,253',
							3: '155,155,155',
							4: '255,74,23',
							5: '0,0,0',
							6: '201,52,10',
							7: '8,18,25',
							8: '150,176,203',
						},
					},
				},
			},
		};
	});
});

import getStyles from '../styles';

describe('container-maxi styles', () => {
	it('passes background transition settings to callout arrow color elements', () => {
		const uniqueID = 'container-maxi-arrow-transition-test-u';
		const result = getStyles({
			uniqueID,
			blockStyle: 'light',
			'arrow-status-general': true,
			'arrow-side-general': 'bottom',
			'arrow-position-general': 50,
			'arrow-width-general': 24,
			'block-background-status-hover': true,
			'background-layers': [
				{
					type: 'color',
					'display-general': 'block',
					'background-palette-status-general': false,
					'background-color-general': 'rgba(150,200,90)',
					'background-palette-status-general-hover': false,
					'background-color-general-hover': 'rgba(61,133,209)',
					order: 0,
				},
			],
			transition: {
				canvas: {
					'background / layer': {
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						'transition-status-general': true,
					},
				},
			},
		});

		expect(
			result[uniqueID][' .maxi-container-arrow:before'].transition
				.general.transition
		).toBe('background-color 0.3s 0s ease');
		expect(
			result[uniqueID][
				' .maxi-container-arrow .maxi-container-arrow--content:after'
			].transition.general.transition
		).toBe('background-color 0.3s 0s ease');
	});
});
