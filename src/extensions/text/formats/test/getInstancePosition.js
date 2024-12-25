/* eslint-disable no-sparse-arrays */
import getInstancePositions from '@extensions/text/formats/getInstancePositions';

describe('getInstancePositions', () => {
	it('Returns format position', () => {
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
						type: 'maxi-blocks/text-link',
						attributes: {
							url: 'test.com',
							rel: '',
							title: '',
						},
						unregisteredAttributes: {},
					},
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
						type: 'maxi-blocks/text-link',
						attributes: {
							url: 'test.com',
							rel: '',
							title: '',
						},
						unregisteredAttributes: {},
					},
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
						type: 'maxi-blocks/text-link',
						attributes: {
							url: 'test.com',
							rel: '',
							title: '',
						},
						unregisteredAttributes: {},
					},
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
						type: 'maxi-blocks/text-link',
						attributes: {
							url: 'test.com',
							rel: '',
							title: '',
						},
						unregisteredAttributes: {},
					},
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
			text: 'Texting Text Maxi',
			start: 8,
			end: 12,
			activeFormats: [
				{
					type: 'maxi-blocks/text-link',
					attributes: {
						url: 'test.com',
						rel: '',
						title: '',
					},
					unregisteredAttributes: {},
				},
				{
					type: 'maxi-blocks/text-custom',
					attributes: {
						className: 'maxi-text-block__custom-format--0',
					},
					unregisteredAttributes: {},
				},
			],
		};
		const formatName = 'maxi-blocks/text-link';
		const formatClassName = null;
		const formatAttributes = {
			url: 'test.com',
			opensInNewTab: false,
			noFollow: '',
			sponsored: '',
			ugc: '',
			title: '',
		};
		const result = getInstancePositions(
			formatValue,
			formatName,
			formatClassName,
			formatAttributes
		);

		expect(result).toStrictEqual([[8, 12]]);
	});
});

/**
 * TODO: receive multiple instance positions of a formatValue with multiple instances of same Custom Formats
 */
