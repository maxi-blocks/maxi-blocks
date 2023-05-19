import { background, backgroundColor } from '../defaults/background';
import hoverAttributesCreator from '../hoverAttributesCreator';

describe('hoverAttributesCreator', () => {
	it('Returns a color bg object', () => {
		const result = hoverAttributesCreator({
			obj: backgroundColor,
			sameValAttr: ['bc_ps-general'],
			diffValAttr: { 'bc_pc-general': 6 },
		});

		expect(result).toMatchSnapshot();
	});

	it('Returns basic background object', () => {
		const result = hoverAttributesCreator({
			obj: background,
			newAttr: {
				'b.sh': {
					type: 'boolean',
					default: false,
				},
			},
		});

		expect(result).toMatchSnapshot();
	});
});
