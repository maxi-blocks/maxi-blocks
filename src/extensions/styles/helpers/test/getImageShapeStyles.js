import getImageShapeStyles from '../getImageShapeStyles';

describe('getImageShapeStyles', () => {
	it('Ensure that image shape scale is working with responsive', () => {
		const object = {
			'background-svg-image-shape-scale-general': 100,
			'background-svg-image-shape-scale-m': 50,
		};

		const result = getImageShapeStyles('svg', object, 'background-svg-');
		expect(result).toMatchSnapshot();

		const object2 = {
			'background-svg-image-shape-scale-general': 50,
			'background-svg-image-shape-scale-m': 100,
		};

		const result2 = getImageShapeStyles('svg', object2, 'background-svg-');
		expect(result2).toMatchSnapshot();
	});
});
