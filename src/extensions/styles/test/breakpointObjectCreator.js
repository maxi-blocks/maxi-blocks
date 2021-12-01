import { rawBackgroundImage } from '../defaults/background';
import breakpointObjectCreator from '../breakpointObjectCreator';

describe('breakpointObjectCreator', () => {
	it('Returns an image bg object', () => {
		const result = breakpointObjectCreator({
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
