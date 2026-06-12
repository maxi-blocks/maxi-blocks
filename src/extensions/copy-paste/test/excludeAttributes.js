/**
 * Internal dependencies
 */
import excludeAttributes from '@extensions/copy-paste/excludeAttributes';
import { getDefaultAttribute } from '@extensions/styles';
import DC_LINK_BLOCKS from '@components/toolbar/components/link/dcLinkBlocks';

jest.mock('@extensions/styles', () => ({
	getDefaultAttribute: jest.fn(),
	getAttributeKey: jest.fn(prop => prop),
}));

describe('excludeAttributes', () => {
	beforeEach(() => {
		getDefaultAttribute.mockClear();
	});

	it('Excludes global attributes', () => {
		const rawAttributesToExclude = {
			uniqueID: 'test-id',
			customLabel: 'label',
			'dc-status': 'active',
			otherAttr: 'value',
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			{},
			{ _exclude: [] }
		);

		expect(result).toEqual({
			otherAttr: 'value',
		});
	});


	it('Keeps dc-status for DC link blocks outside repeater mode', () => {
		const blockName = DC_LINK_BLOCKS[0];
		const rawAttributesToExclude = {
			'dc-status': true,
			otherAttr: 'value',
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			{},
			{ _exclude: [] },
			false,
			blockName
		);

		expect(result).toEqual({
			'dc-status': true,
			otherAttr: 'value',
		});
	});

	it('Handles repeater mode with different exclusions', () => {
		const rawAttributesToExclude = {
			customLabel: 'label',
			content: 'test content',
			otherAttr: 'value',
		};

		getDefaultAttribute.mockReturnValue('different content');

		const result = excludeAttributes(
			rawAttributesToExclude,
			{ content: 'test content' },
			{ _exclude: [] },
			true,
			'some-block'
		);

		expect(result).toEqual({
			content: 'test content',
			customLabel: 'label',
			otherAttr: 'value',
		});
	});

	it('Handles SVG icon exception in repeater mode', () => {
		const rawAttributesToExclude = {
			content: 'svg content',
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			{ content: 'svg content' },
			{ _exclude: [] },
			true,
			'maxi-blocks/svg-icon-maxi'
		);

		expect(result).toEqual({
			content: 'svg content',
		});
	});

	it('Processes background layers correctly', () => {
		const rawAttributesToExclude = {
			'background-layers': [
				{
					type: 'image',
					mediaID: '123',
					mediaURL: 'test.jpg',
				},
			],
		};

		const attributes = {
			'background-layers': [
				{
					type: 'image',
					mediaID: '456',
					mediaURL: 'original.jpg',
				},
			],
		};

		const result = excludeAttributes(rawAttributesToExclude, attributes, {
			_exclude: [],
		});

		expect(result['background-layers']).toEqual([
			{
				type: 'image',
				mediaID: '456',
				mediaURL: 'original.jpg',
			},
		]);
	});

	it('Handles DC link blocks exception', () => {
		const blockName = DC_LINK_BLOCKS[0];
		const rawAttributesToExclude = {
			'dc-status': 'active',
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			{},
			{ _exclude: [] },
			true,
			blockName
		);

		expect(result).toEqual({});
	});

	it('Excludes dc-status for DC link blocks in repeater mode when at default value', () => {
		const blockName = DC_LINK_BLOCKS[0];
		getDefaultAttribute.mockReturnValue(false);

		const rawAttributesToExclude = {
			'dc-status': false,
			otherAttr: 'value',
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			{ 'dc-status': false },
			{ _exclude: [] },
			true,
			blockName
		);

		expect(result).toEqual({
			otherAttr: 'value',
		});
	});

	it('Respects custom all time exclude list', () => {
		const rawAttributesToExclude = {
			customExclude: 'value',
			normalAttr: 'keep',
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			{},
			{ _exclude: [] },
			true,
			'some-block',
			['customExclude']
		);

		expect(result).toEqual({
			customExclude: 'value',
			normalAttr: 'keep',
		});
	});

	it('Handles copyPasteMapping exclusions', () => {
		const rawAttributesToExclude = {
			mappedAttr: 'value',
			normalAttr: 'keep',
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			{},
			{ _exclude: ['mappedAttr'] }
		);

		expect(result).toEqual({
			normalAttr: 'keep',
		});
	});

	it('Keeps image size response fields for matching image blocks in repeater mode', () => {
		const rawAttributesToExclude = {
			imageSize: 'medium',
			mediaID: 123,
			mediaURL: 'medium.jpg',
			mediaWidth: 300,
			mediaHeight: 200,
			mediaAlt: 'Alt text',
		};

		const attributes = {
			imageSize: 'full',
			mediaID: 123,
			mediaURL: 'full.jpg',
			mediaWidth: 900,
			mediaHeight: 600,
			mediaAlt: 'Existing alt text',
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			attributes,
			{
				_exclude: [
					'mediaID',
					'mediaURL',
					'mediaWidth',
					'mediaHeight',
					'mediaAlt',
				],
			},
			true,
			'maxi-blocks/image-maxi'
		);

		expect(result).toEqual({
			imageSize: 'medium',
			mediaURL: 'medium.jpg',
			mediaWidth: 300,
			mediaHeight: 200,
		});
	});

	it('Keeps responsive image size response fields for matching image blocks in repeater mode', () => {
		const rawAttributesToExclude = {
			'imageSize-l': 'medium',
			mediaID: 123,
			'mediaURL-l': 'medium.jpg',
			'mediaWidth-l': 300,
			'mediaHeight-l': 200,
			'cropOptions-l': {
				image: {
					source_url: 'medium-crop.jpg',
				},
			},
		};

		const attributes = {
			'imageSize-l': 'full',
			mediaID: 123,
			'mediaURL-l': 'full.jpg',
			'mediaWidth-l': 900,
			'mediaHeight-l': 600,
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			attributes,
			{
				_exclude: [
					'mediaID',
					'mediaURL-l',
					'mediaWidth-l',
					'mediaHeight-l',
					'cropOptions-l',
				],
			},
			true,
			'maxi-blocks/image-maxi'
		);

		expect(result).toEqual({
			'imageSize-l': 'medium',
			'mediaURL-l': 'medium.jpg',
			'mediaWidth-l': 300,
			'mediaHeight-l': 200,
			'cropOptions-l': {
				image: {
					source_url: 'medium-crop.jpg',
				},
			},
		});
	});

	it('Does not copy image size response fields to repeater images with different media IDs', () => {
		const rawAttributesToExclude = {
			imageSize: 'medium',
			mediaID: 123,
			mediaURL: 'source-medium.jpg',
			mediaWidth: 300,
			mediaHeight: 200,
		};

		const attributes = {
			imageSize: 'full',
			mediaID: 456,
			mediaURL: 'target-full.jpg',
			mediaWidth: 900,
			mediaHeight: 600,
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			attributes,
			{
				_exclude: [
					'mediaID',
					'mediaURL',
					'mediaWidth',
					'mediaHeight',
				],
			},
			true,
			'maxi-blocks/image-maxi'
		);

		expect(result).toEqual({
			imageSize: 'medium',
		});
	});

	it('Does not copy responsive image size response fields to repeater images with different media IDs', () => {
		const rawAttributesToExclude = {
			'imageSize-l': 'medium',
			mediaID: 123,
			'mediaURL-l': 'source-medium.jpg',
			'mediaWidth-l': 300,
			'mediaHeight-l': 200,
			'cropOptions-l': {
				image: {
					source_url: 'source-crop.jpg',
				},
			},
		};

		const attributes = {
			'imageSize-l': 'full',
			mediaID: 456,
			'mediaURL-l': 'target-full.jpg',
			'mediaWidth-l': 900,
			'mediaHeight-l': 600,
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			attributes,
			{
				_exclude: [
					'mediaID',
					'mediaURL',
					'mediaWidth',
					'mediaHeight',
					'cropOptions',
				],
			},
			true,
			'maxi-blocks/image-maxi'
		);

		expect(result).toEqual({
			'imageSize-l': 'medium',
		});
	});

	it('Still excludes image media fields in repeater mode when image size is unchanged', () => {
		const rawAttributesToExclude = {
			mediaURL: 'replacement.jpg',
			mediaWidth: 300,
			mediaHeight: 200,
		};

		const result = excludeAttributes(
			rawAttributesToExclude,
			{
				mediaURL: 'existing.jpg',
				mediaWidth: 900,
				mediaHeight: 600,
			},
			{
				_exclude: ['mediaURL', 'mediaWidth', 'mediaHeight'],
			},
			true,
			'maxi-blocks/image-maxi'
		);

		expect(result).toEqual({});
	});
});
