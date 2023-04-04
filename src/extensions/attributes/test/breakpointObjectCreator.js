import { rawBackgroundImage } from '../defaults/background';
import breakpointAttributesCreator from '../breakpointAttributesCreator';

describe('breakpointAttributesCreator', () => {
	it('Returns an image bg object', () => {
		const result = breakpointAttributesCreator({
			obj: rawBackgroundImage,
			noBreakpointAttr: ['bi_mu', 'bi_mi', 'bi_pal', 'bi_pas'],
		});

		expect(result).toMatchSnapshot();
	});
});
