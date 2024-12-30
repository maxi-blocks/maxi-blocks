import getDividerStyles from '@extensions/styles/helpers/getDividerStyles';

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

describe('getDividerStyles', () => {
	it('Get a correct divider styles', () => {
		const obj = {
			'divider-border-top-width-general': 38,
			'divider-border-top-width-s': 149,
			'divider-border-top-unit-general': 'px',
			'divider-border-right-width-general': 2,
			'divider-border-right-width-l': 14,
			'divider-border-right-unit-general': 'px',
			'divider-border-radius-general': false,
			'divider-width-general': 79,
			'divider-width-s': 23,
			'divider-width-unit-general': '%',
			'divider-height-general': 100,
			'divider-height-l': 41,
			'line-align-general': 'row',
			'line-vertical-general': 'flex-end',
			'line-vertical-l': 'flex-start',
			'line-vertical-s': 'center',
			'line-horizontal-general': 'flex-start',
			'line-horizontal-l': 'center',
			'line-horizontal-s': 'flex-start',
			'line-orientation-general': 'horizontal',
			'line-orientation-l': 'vertical',
			'line-orientation-s': 'horizontal',
			'divider-border-palette-status-general': true,
			'divider-border-palette-status-l': true,
			'divider-border-palette-status-s': true,
			'divider-border-palette-color-general': 7,
			'divider-border-palette-color-l': 4,
			'divider-border-palette-color-s': 3,
			'divider-border-palette-opacity-l': 0.56,
			'divider-border-palette-opacity-s': 0.56,
			'divider-border-style-general': 'dashed',
			'divider-border-style-l': 'solid',
		};

		const resultLine = getDividerStyles(obj, 'line', 'light');
		expect(resultLine).toMatchSnapshot();

		const resultAlign = getDividerStyles(obj, 'row', 'light');
		expect(resultAlign).toMatchSnapshot();
	});
});
