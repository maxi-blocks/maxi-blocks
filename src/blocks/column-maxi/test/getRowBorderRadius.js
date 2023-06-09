import getRowBorderRadius from '../utils';

describe('getRowBorderRadius', () => {
	it('Get correct row border radius with one nested column', () => {
		const result = getRowBorderRadius(
			{
				'bo.ra.tl': 180,
				'bo.ra.tr': 181,
				'bo.ra.bl': 182,
				'bo.ra.br': 183,
			},
			['id-1'],
			'id-1'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for left column with two nested columns', () => {
		const result = getRowBorderRadius(
			{
				'bo.ra.tl': 180,
				'bo.ra.tr': 181,
				'bo.ra.bl': 182,
				'bo.ra.br': 183,
			},
			['id-1', 'id-2'],
			'id-1'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for right column with two nested columns', () => {
		const result = getRowBorderRadius(
			{
				'bo.ra.tl': 180,
				'bo.ra.tr': 181,
				'bo.ra.bl': 182,
				'bo.ra.br': 183,
			},
			['id-1', 'id-2'],
			'id-2'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for left column with three and more nested columns', () => {
		const result = getRowBorderRadius(
			{
				'bo.ra.tl': 180,
				'bo.ra.tr': 181,
				'bo.ra.bl': 182,
				'bo.ra.br': 183,
			},
			['id-1', 'id-2', 'id-3'],
			'id-1'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for not lateral column with three and more nested columns', () => {
		const result = getRowBorderRadius(
			{
				'bo.ra.tl': 180,
				'bo.ra.tr': 181,
				'bo.ra.bl': 182,
				'bo.ra.br': 183,
			},
			['id-1', 'id-2', 'id-3'],
			'id-2'
		);

		expect(result).toMatchSnapshot();
	});

	it('Get correct row border radius for right column with three and more nested columns', () => {
		const result = getRowBorderRadius(
			{
				'bo.ra.tl': 180,
				'bo.ra.tr': 181,
				'bo.ra.bl': 182,
				'bo.ra.br': 183,
			},
			['id-1', 'id-2', 'id-3'],
			'id-3'
		);

		expect(result).toMatchSnapshot();
	});
});
