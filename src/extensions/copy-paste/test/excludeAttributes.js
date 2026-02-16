/**
 * Internal dependencies
 */
import excludeAttributes from '../excludeAttributes';
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
});
