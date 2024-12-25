import { background, backgroundColor } from '@extensions/styles/defaults/background';
import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';

describe('hoverAttributesCreator', () => {
	it('Returns a color bg object', () => {
		const result = hoverAttributesCreator({
			obj: backgroundColor,
			sameValAttr: ['background-palette-status-general'],
			diffValAttr: { 'background-palette-color-general': 6 },
		});

		expect(result).toMatchSnapshot();
	});

	it('Returns basic background object', () => {
		const result = hoverAttributesCreator({
			obj: background,
			newAttr: {
				'background-status-hover': {
					type: 'boolean',
					default: false,
				},
			},
		});

		expect(result).toMatchSnapshot();
	});
});
