import getRowBorderRadius from '../utils';

describe('getRowBorderRadius', () => {
	it('Get correct row border radius with one nested column', () => {
		const result = getRowBorderRadius(
			{
				'border-radius-top-left': 180,
				'border-radius-top-right': 181,
				'border-radius-bottom-left': 182,
				'border-radius-bottom-right': 183,
			},
			['id-1'],
			'id-1'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for left column with two nested columns', () => {
		const result = getRowBorderRadius(
			{
				'border-radius-top-left': 180,
				'border-radius-top-right': 181,
				'border-radius-bottom-left': 182,
				'border-radius-bottom-right': 183,
			},
			['id-1', 'id-2'],
			'id-1'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for right column with two nested columns', () => {
		const result = getRowBorderRadius(
			{
				'border-radius-top-left': 180,
				'border-radius-top-right': 181,
				'border-radius-bottom-left': 182,
				'border-radius-bottom-right': 183,
			},
			['id-1', 'id-2'],
			'id-2'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for left column with three and more nested columns', () => {
		const result = getRowBorderRadius(
			{
				'border-radius-top-left': 180,
				'border-radius-top-right': 181,
				'border-radius-bottom-left': 182,
				'border-radius-bottom-right': 183,
			},
			['id-1', 'id-2', 'id-3'],
			'id-1'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for not lateral column with three and more nested columns', () => {
		const result = getRowBorderRadius(
			{
				'border-radius-top-left': 180,
				'border-radius-top-right': 181,
				'border-radius-bottom-left': 182,
				'border-radius-bottom-right': 183,
			},
			['id-1', 'id-2', 'id-3'],
			'id-2'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for right column with three and more nested columns', () => {
		const result = getRowBorderRadius(
			{
				'border-radius-top-left': 180,
				'border-radius-top-right': 181,
				'border-radius-bottom-left': 182,
				'border-radius-bottom-right': 183,
			},
			['id-1', 'id-2', 'id-3'],
			'id-3'
		);

		expect(result).toMatchSnapshot();
	});
});
