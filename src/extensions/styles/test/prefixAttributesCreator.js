import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import margin from '@extensions/styles/defaults/margin';
import boxShadowHover from '@extensions/styles/defaults/boxShadowHover';
import { borderWidth } from '@extensions/styles/defaults/border';
import padding from '@extensions/styles/defaults/padding';

describe('prefixAttributesCreator', () => {
	it('Returns prefixed object with default values', () => {
		const obj = {
			...margin,
			...boxShadowHover,
			...borderWidth,
		};

		expect(
			prefixAttributesCreator({ obj, prefix: 'button-' })
		).toMatchSnapshot();
	});

	it('Returns prefixed object with custom values', () => {
		expect(
			prefixAttributesCreator({
				obj: padding,
				prefix: 'button-',
				diffValAttr: { 'button-padding-bottom-general': 30 },
			})
		).toMatchSnapshot();
	});

	it('Returns prefixed object with excluded values', () => {
		expect(
			prefixAttributesCreator({
				obj: padding,
				prefix: 'button-',
				exclAttr: ['padding-bottom'],
			})
		).toMatchSnapshot();
	});
});
