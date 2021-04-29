import getShapeDividerStyles from '../getShapeDividerStyles';

describe('getShapeDividerStyles', () => {
	it('Get a correct alignment', () => {
		const object = {
			'divider-border-color': 'test',
			'divider-border-style': 'test',
			'divider-border-top-width': 1,
			'divider-border-top-unit': 'test',
			'divider-border-right-width': 2,
			'divider-border-right-unit': 'test',
			'divider-border-radius': 'test',
			'divider-width': 3,
			'divider-width-unit': 'test',
			'divider-height': 4,
		};

		const result = getShapeDividerStyles(object);
		expect(result).toMatchSnapshot();
	});
});
