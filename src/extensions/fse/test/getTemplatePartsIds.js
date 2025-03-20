import getTemplatePartsIds from '@extensions/fse/getTemplatePartsIds';
import createTemplatePartId from '@extensions/fse/createTemplatePartId';
import { select } from '@wordpress/data';

jest.mock('@extensions/fse/createTemplatePartId', () => jest.fn());
jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

describe('getTemplatePartsIds', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Returns empty array when no template part blocks exist', () => {
		const mockBlocks = [
			{ name: 'core/paragraph' },
			{ name: 'core/heading' },
		];

		const mockBlockEditor = {
			getBlocks: jest.fn().mockReturnValue(mockBlocks),
		};

		select.mockReturnValue(mockBlockEditor);

		const result = getTemplatePartsIds();

		expect(result).toEqual([]);
		expect(select).toHaveBeenCalledWith('core/block-editor');
		expect(mockBlockEditor.getBlocks).toHaveBeenCalled();
		expect(createTemplatePartId).not.toHaveBeenCalled();
	});

	it('Returns array of template part IDs when template part blocks exist', () => {
		const mockBlocks = [
			{
				name: 'core/paragraph',
			},
			{
				name: 'core/template-part',
				attributes: {
					theme: 'theme1',
					slug: 'header',
				},
			},
			{
				name: 'core/heading',
			},
			{
				name: 'core/template-part',
				attributes: {
					theme: 'theme1',
					slug: 'footer',
				},
			},
		];

		const mockBlockEditor = {
			getBlocks: jest.fn().mockReturnValue(mockBlocks),
		};

		select.mockReturnValue(mockBlockEditor);

		// Mock createTemplatePartId to return a predictable ID
		createTemplatePartId
			.mockImplementationOnce((theme, slug) => `${theme}//${slug}`)
			.mockImplementationOnce((theme, slug) => `${theme}//${slug}`);

		const result = getTemplatePartsIds();

		expect(result).toEqual(['theme1//header', 'theme1//footer']);
		expect(select).toHaveBeenCalledWith('core/block-editor');
		expect(mockBlockEditor.getBlocks).toHaveBeenCalled();
		expect(createTemplatePartId).toHaveBeenCalledTimes(2);
		expect(createTemplatePartId).toHaveBeenNthCalledWith(
			1,
			'theme1',
			'header'
		);
		expect(createTemplatePartId).toHaveBeenNthCalledWith(
			2,
			'theme1',
			'footer'
		);
	});

	it('Handles case when template part attributes are missing', () => {
		const mockBlocks = [
			{
				name: 'core/template-part',
				attributes: {
					// Missing theme
					slug: 'footer',
				},
			},
			{
				name: 'core/template-part',
				attributes: {
					theme: 'theme1',
					// Missing slug
				},
			},
		];

		const mockBlockEditor = {
			getBlocks: jest.fn().mockReturnValue(mockBlocks),
		};

		select.mockReturnValue(mockBlockEditor);

		// Mock createTemplatePartId to handle undefined values
		createTemplatePartId.mockImplementation((theme, slug) => {
			if (!theme || !slug) return 'invalid-id';
			return `${theme}//${slug}`;
		});

		const result = getTemplatePartsIds();

		// Even with missing attributes, the function should still call createTemplatePartId
		expect(createTemplatePartId).toHaveBeenCalledTimes(2);
		expect(result).toEqual(['invalid-id', 'invalid-id']);
	});
});
