/* eslint-disable no-sparse-arrays */
import getFormatPosition from '@extensions/text/formats/getFormatPosition';

describe('getFormatPosition', () => {
	it('Returns correct link position', () => {
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
		const result = getFormatPosition({
			formatValue,
			formatName,
			formatClassName,
			formatAttributes,
		});

		expect(result).toStrictEqual([8, 12]);
	});
});
