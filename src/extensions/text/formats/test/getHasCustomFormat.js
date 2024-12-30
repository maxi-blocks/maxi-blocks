/* eslint-disable no-sparse-arrays */
import getHasCustomFormat from '@extensions/text/formats/getHasCustomFormat';

describe('getHasCustomFormat', () => {
	it('Should return true', () => {
		const formatValue = {
			formats: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				[
					{
						type: 'maxi-blocks/text-custom',
						attributes: {
							className: 'maxi-text-block__custom-format--0',
						},
						unregisteredAttributes: {},
					},
				],
				,
				,
				,
				,
				,
			],
			replacements: [, , , , , , , , , , , , , , , , ,],
			text: 'Testing Text Maxi',
			start: 0,
			end: 17,
			activeFormats: [],
		};
		const isHover = false;

		const result = getHasCustomFormat(formatValue, isHover);

		expect(result).toBeTruthy();
	});
});
