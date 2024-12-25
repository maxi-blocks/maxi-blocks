import getImageShapeStyles from '@extensions/styles/helpers/getImageShapeStyles';

describe('getImageShapeStyles', () => {
	const object = {
		'background-svg-image-shape-scale-general': 100,
		'background-svg-image-shape-scale-m': 50,
		'background-svg-image-shape-scale-s': 100,
	};

	it('Ensure that image shape scale is working with responsive', () => {
		const result = getImageShapeStyles('svg', object, 'background-svg-');
		expect(result).toMatchSnapshot();

		const object2 = {
			'background-svg-image-shape-scale-general': 50,
			'background-svg-image-shape-scale-m': 100,
			'background-svg-image-shape-scale-s': 50,
		};

		const result2 = getImageShapeStyles('svg', object2, 'background-svg-');
		expect(result2).toMatchSnapshot();
	});

	it('Ensure that ignoreOmit is working', () => {
		const result = getImageShapeStyles(
			'svg',
			object,
			'background-svg-',
			true
		);
		expect(result).toMatchSnapshot();
	});
});
