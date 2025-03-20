import getTemplatePart from '@extensions/fse/getTemplatePart';
import getIsSiteEditor from '@extensions/fse/getIsSiteEditor';
import { select } from '@wordpress/data';

jest.mock('@extensions/fse/getIsSiteEditor', () => jest.fn());
jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

describe('getTemplatePart', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Returns false when not in site editor', () => {
		getIsSiteEditor.mockReturnValue(false);

		const result = getTemplatePart('test-client-id');

		expect(result).toBe(false);
		expect(select).not.toHaveBeenCalled();
	});

	it('Returns false when clientId is not provided', () => {
		getIsSiteEditor.mockReturnValue(true);

		const result = getTemplatePart();

		expect(result).toBe(false);
		expect(select).not.toHaveBeenCalled();
	});

	it('Returns template part parent when found', () => {
		getIsSiteEditor.mockReturnValue(true);

		const mockTemplatePartBlock = {
			name: 'core/template-part',
			attributes: {
				slug: 'header',
			},
		};

		const mockBlockParents = ['parent-1', 'parent-2', 'template-part-id'];

		const mockBlockEditor = {
			getBlock: jest.fn(id => {
				if (id === 'template-part-id') return mockTemplatePartBlock;
				return { name: 'core/paragraph' };
			}),
			getBlockParents: jest.fn().mockReturnValue(mockBlockParents),
		};

		select.mockReturnValue(mockBlockEditor);

		const result = getTemplatePart('test-client-id');

		expect(result).toBe(mockTemplatePartBlock);
		expect(mockBlockEditor.getBlockParents).toHaveBeenCalledWith(
			'test-client-id'
		);
		expect(mockBlockEditor.getBlock).toHaveBeenCalledWith(
			'template-part-id'
		);
	});

	it('Returns false when no template part parent is found', () => {
		getIsSiteEditor.mockReturnValue(true);

		const mockBlockParents = ['parent-1', 'parent-2', 'parent-3'];

		const mockBlockEditor = {
			getBlock: jest.fn(() => null),
			getBlockParents: jest.fn().mockReturnValue(mockBlockParents),
		};

		select.mockReturnValue(mockBlockEditor);

		const result = getTemplatePart('test-client-id');

		expect(result).toBe(false);
		expect(mockBlockEditor.getBlockParents).toHaveBeenCalledWith(
			'test-client-id'
		);
		// getBlock should be called for each parent + 1 time for the original clientId
		expect(mockBlockEditor.getBlock).toHaveBeenCalledTimes(4);
	});

	it('Returns false when block parents array is empty', () => {
		getIsSiteEditor.mockReturnValue(true);

		const mockBlockEditor = {
			getBlock: jest.fn(),
			getBlockParents: jest.fn().mockReturnValue([]),
		};

		select.mockReturnValue(mockBlockEditor);

		const result = getTemplatePart('test-client-id');

		expect(result).toBe(false);
		expect(mockBlockEditor.getBlockParents).toHaveBeenCalledWith(
			'test-client-id'
		);
	});

	it('Handles case when getBlock returns undefined', () => {
		getIsSiteEditor.mockReturnValue(true);

		const mockBlockParents = ['parent-1'];

		const mockBlockEditor = {
			getBlock: jest.fn().mockReturnValue(undefined),
			getBlockParents: jest.fn().mockReturnValue(mockBlockParents),
		};

		select.mockReturnValue(mockBlockEditor);

		const result = getTemplatePart('test-client-id');

		expect(result).toBe(false);
		expect(mockBlockEditor.getBlockParents).toHaveBeenCalledWith(
			'test-client-id'
		);
		expect(mockBlockEditor.getBlock).toHaveBeenCalledWith('parent-1');
	});
});
