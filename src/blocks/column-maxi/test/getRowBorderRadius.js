import getRowBorderRadius from '@blocks/column-maxi/utils';

describe('getRowBorderRadius', () => {
	it('Get correct row border radius with one nested column', () => {
		const result = getRowBorderRadius(
			{
				'border-top-left-radius': 180,
				'border-top-right-radius': 181,
				'border-bottom-left-radius': 182,
				'border-bottom-right-radius': 183,
			},
			['id-1'],
			'id-1'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for left column with two nested columns', () => {
		const result = getRowBorderRadius(
			{
				'border-top-left-radius': 180,
				'border-top-right-radius': 181,
				'border-bottom-left-radius': 182,
				'border-bottom-right-radius': 183,
			},
			['id-1', 'id-2'],
			'id-1'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for right column with two nested columns', () => {
		const result = getRowBorderRadius(
			{
				'border-top-left-radius': 180,
				'border-top-right-radius': 181,
				'border-bottom-left-radius': 182,
				'border-bottom-right-radius': 183,
			},
			['id-1', 'id-2'],
			'id-2'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for left column with three and more nested columns', () => {
		const result = getRowBorderRadius(
			{
				'border-top-left-radius': 180,
				'border-top-right-radius': 181,
				'border-bottom-left-radius': 182,
				'border-bottom-right-radius': 183,
			},
			['id-1', 'id-2', 'id-3'],
			'id-1'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for not lateral column with three and more nested columns', () => {
		const result = getRowBorderRadius(
			{
				'border-top-left-radius': 180,
				'border-top-right-radius': 181,
				'border-bottom-left-radius': 182,
				'border-bottom-right-radius': 183,
			},
			['id-1', 'id-2', 'id-3'],
			'id-2'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for right column with three and more nested columns', () => {
		const result = getRowBorderRadius(
			{
				'border-top-left-radius': 180,
				'border-top-right-radius': 181,
				'border-bottom-left-radius': 182,
				'border-bottom-right-radius': 183,
			},
			['id-1', 'id-2', 'id-3'],
			'id-3'
		);

		expect(result).toMatchSnapshot();
	});
});
