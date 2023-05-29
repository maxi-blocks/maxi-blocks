import getImageShapeStyles from '../getImageShapeStyles';

describe('getImageShapeStyles', () => {
	const object = {
		'bsv-is_sc-g': 100,
		'bsv-is_sc-m': 50,
		'bsv-is_sc-s': 100,
	};

	it('Ensure that image shape scale is working with responsive', () => {
		const result = getImageShapeStyles('svg', object, 'bsv-');
		expect(result).toMatchSnapshot();

		const object2 = {
			'bsv-is_sc-g': 50,
			'bsv-is_sc-m': 100,
			'bsv-is_sc-s': 50,
		};

		const result2 = getImageShapeStyles('svg', object2, 'bsv-');
		expect(result2).toMatchSnapshot();
	});

	it('Ensure that ignoreOmit is working', () => {
		const result = getImageShapeStyles('svg', object, 'bsv-', true);
		expect(result).toMatchSnapshot();
	});
});
