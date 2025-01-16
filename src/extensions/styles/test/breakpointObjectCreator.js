import { rawBackgroundImage } from '@extensions/styles/defaults/background';
import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

describe('breakpointAttributesCreator', () => {
	it('Returns an image bg object', () => {
		const result = breakpointAttributesCreator({
			obj: rawBackgroundImage,
			noBreakpointAttr: [
				'background-image-mediaURL',
				'background-image-mediaID',
				'background-image-parallax-alt',
				'background-image-parallax-alt-selector',
			],
		});

		expect(result).toMatchSnapshot();
	});
});
