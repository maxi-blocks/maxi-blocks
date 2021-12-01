import { background, backgroundColor } from '../defaults/background';
import hoverObjectCreator from '../hoverObjectCreator';

describe('hoverObjectCreator', () => {
	it('Returns a color bg object', () => {
		const result = hoverObjectCreator({
			obj: backgroundColor,
			sameValAttr: ['background-palette-color-status-general'],
			diffValAttr: { 'background-palette-color-general': 6 },
		});

		expect(result).toMatchSnapshot();
	});

	it('Returns basic background object', () => {
		const result = hoverObjectCreator({
			obj: background,
			newAttr: {
				'background-hover-status': {
					type: 'boolean',
					default: false,
				},
			},
		});

		expect(result).toMatchSnapshot();
	});
});
