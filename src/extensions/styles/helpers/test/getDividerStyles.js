import getDividerStyles from '../getDividerStyles';
import '@wordpress/block-editor';

describe('getDividerStyles', () => {
	it('Get a correct Divider Styles', () => {
		const object = {
			lineVertical: 'center',
			lineHorizontal: 'flex-start',
			lineAlign: 'row',
			lineOrientation: 'horizontal',
			'divider-border-color': 'red',
			'divider-border-style': 'none',
			'divider-border-top-width': 1,
			'divider-border-top-unit': 'px',
			'divider-border-right-width': 2,
			'divider-border-right-unit': 'px',
			'divider-border-radius': 'none',
			'divider-width': 3,
			'divider-width-unit': 'px',
			'divider-height': 4,
		};

		const objectVertical = {
			lineVertical: 'center',
			lineHorizontal: 'flex-start',
			lineAlign: '',
			lineOrientation: 'vertical',
			'divider-border-color': 'red',
			'divider-border-style': 'none',
			'divider-border-top-width': 1,
			'divider-border-top-unit': 'px',
			'divider-border-right-width': 2,
			'divider-border-right-unit': 'px',
			'divider-border-radius': 'none',
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
