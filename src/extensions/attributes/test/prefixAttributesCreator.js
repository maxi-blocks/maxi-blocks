import prefixAttributesCreator from '../prefixAttributesCreator';
import margin from '../defaults/margin';
import boxShadowHover from '../defaults/boxShadowHover';
import { borderWidth } from '../defaults/border';
import padding from '../defaults/padding';

describe('prefixAttributesCreator', () => {
	it('Returns prefixed object with default values', () => {
		const obj = {
			...margin,
			...boxShadowHover,
			...borderWidth,
		};

		expect(
			prefixAttributesCreator({
				obj,
				prefix: 'bt-',
				longPrefix: 'button-',
			})
		).toMatchSnapshot();
	});

	it('Returns prefixed object with custom values', () => {
		expect(
			prefixAttributesCreator({
				obj: padding,
				prefix: 'bt-',
				longPrefix: 'button-',
				diffValAttr: { 'bt_p.b-g': 30 },
			})
		).toMatchSnapshot();
	});

	it('Returns prefixed object with excluded values', () => {
		expect(
			prefixAttributesCreator({
				obj: padding,
				prefix: 'bt-',
				exclAttr: ['_p.b'],
				longPrefix: 'button-',
			})
		).toMatchSnapshot();
	});
});
