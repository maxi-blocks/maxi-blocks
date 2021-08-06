import getDividerStyles from '../getDividerStyles';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
	};
});

describe('getDividerStyles', () => {
	it('Get a correct divider styles', () => {
		const object = {
			lineVertical: 'center',
			lineHorizontal: 'flex-start',
			lineAlign: 'row',
			lineOrientation: 'horizontal',
			'divider-border-color': 'rgb(255, 99, 71)',
			'divider-border-style': 'null',
			'divider-border-top-width': 1,
			'divider-border-top-unit': 'px',
			'divider-border-right-width': 2,
			'divider-border-right-unit': 'px',
			'divider-border-radius': 'null',
			'divider-width': 3,
			'divider-width-unit': 'px',
			'divider-height': 4,
		};

		const objectVertical = {
			lineVertical: 'center',
			lineHorizontal: 'flex-start',
			lineAlign: '',
			lineOrientation: 'vertical',
			'divider-border-color': 'rgb(255, 99, 71)',
			'divider-border-style': 'null',
			'divider-border-top-width': 1,
			'divider-border-top-unit': 'px',
			'divider-border-right-width': 2,
			'divider-border-right-unit': 'px',
			'divider-border-radius': 'null',
			'divider-width': 3,
			'divider-width-unit': 'px',
			'divider-height': 4,
		};

		const resultLine = getDividerStyles(object, 'line');
		expect(resultLine).toMatchSnapshot();

		const resultLineVertical = getDividerStyles(objectVertical, 'line');
		expect(resultLineVertical).toMatchSnapshot();

		const resultAlign = getDividerStyles(object, 'row');
		expect(resultAlign).toMatchSnapshot();

		const resultNone = getDividerStyles(objectVertical, '');
		expect(resultNone).toMatchSnapshot();
	});
});
