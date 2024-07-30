import getImageShapeStyles from '../getImageShapeStyles';

/**
 * PHP snapshots
 */
import imageShapeScaleResponsive from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Image_Shape_Styles_Test__test_ensure_that_image_shape_scale_is_working_with_responsive__1.json';
import imageShapeScaleResponsive2 from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Image_Shape_Styles_Test__test_ensure_that_image_shape_scale_is_working_with_responsive__2.json';
import imageShapeScaleIgnoreOmit from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Image_Shape_Styles_Test__test_ensure_that_ignore_omit_is_working__1.json';

describe('getImageShapeStyles', () => {
	const object = {
		'background-svg-image-shape-scale-general': 100,
		'background-svg-image-shape-scale-m': 50,
		'background-svg-image-shape-scale-s': 100,
	};

	it('Ensure that image shape scale is working with responsive', () => {
		const result = getImageShapeStyles('svg', object, 'background-svg-');
		expect(result).toMatchSnapshot();
		expect(result).toEqual(imageShapeScaleResponsive);

		const object2 = {
			'background-svg-image-shape-scale-general': 50,
			'background-svg-image-shape-scale-m': 100,
			'background-svg-image-shape-scale-s': 50,
		};

		const result2 = getImageShapeStyles('svg', object2, 'background-svg-');
		expect(result2).toMatchSnapshot();
		expect(result2).toEqual(imageShapeScaleResponsive2);
	});

	it('Ensure that ignoreOmit is working', () => {
		const result = getImageShapeStyles(
			'svg',
			object,
			'background-svg-',
			true
		);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(imageShapeScaleIgnoreOmit);
	});
});
