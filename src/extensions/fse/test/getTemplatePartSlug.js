import getTemplatePartSlug from '@extensions/fse/getTemplatePartSlug';
import getIsSiteEditor from '@extensions/fse/getIsSiteEditor';
import getTemplatePart from '@extensions/fse/getTemplatePart';
import getIsTemplatePart from '@extensions/fse/getIsTemplatePart';
import { select } from '@wordpress/data';

jest.mock('@extensions/fse/getIsSiteEditor', () => jest.fn());
jest.mock('@extensions/fse/getTemplatePart', () => jest.fn());
jest.mock('@extensions/fse/getIsTemplatePart', () => jest.fn());
jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

describe('getTemplatePartSlug', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Returns false when not in site editor', () => {
		getIsSiteEditor.mockReturnValue(false);

		const result = getTemplatePartSlug('test-client-id');

		expect(result).toBe(false);
		expect(getIsSiteEditor).toHaveBeenCalled();
		expect(getIsTemplatePart).not.toHaveBeenCalled();
		expect(select).not.toHaveBeenCalled();
		expect(getTemplatePart).not.toHaveBeenCalled();
	});

	it('Returns template part slug when in template part editor', () => {
		getIsSiteEditor.mockReturnValue(true);
		getIsTemplatePart.mockReturnValue(true);

		const mockEditSiteStore = {
			getEditedPostId: jest
				.fn()
				.mockReturnValue('wp_template_part//header'),
		};

		select.mockReturnValue(mockEditSiteStore);

		const result = getTemplatePartSlug('test-client-id');

		expect(result).toBe('header');
		expect(getIsSiteEditor).toHaveBeenCalled();
		expect(getIsTemplatePart).toHaveBeenCalled();
		expect(select).toHaveBeenCalledWith('core/edit-site');
		expect(mockEditSiteStore.getEditedPostId).toHaveBeenCalled();
		expect(getTemplatePart).not.toHaveBeenCalled();
	});

	it('Returns template part slug from parent when in template editor with template part', () => {
		getIsSiteEditor.mockReturnValue(true);
		getIsTemplatePart.mockReturnValue(false);

		const mockTemplatePartParent = {
			name: 'core/template-part',
			attributes: {
				slug: 'footer',
			},
		};

		getTemplatePart.mockReturnValue(mockTemplatePartParent);

		const result = getTemplatePartSlug('test-client-id');

		expect(result).toBe('footer');
		expect(getIsSiteEditor).toHaveBeenCalled();
		expect(getIsTemplatePart).toHaveBeenCalled();
		expect(getTemplatePart).toHaveBeenCalledWith('test-client-id');
	});

	it('Returns false when template part parent is not found', () => {
		getIsSiteEditor.mockReturnValue(true);
		getIsTemplatePart.mockReturnValue(false);
		getTemplatePart.mockReturnValue(null);

		const result = getTemplatePartSlug('test-client-id');

		expect(result).toBe(false);
		expect(getIsSiteEditor).toHaveBeenCalled();
		expect(getIsTemplatePart).toHaveBeenCalled();
		expect(getTemplatePart).toHaveBeenCalledWith('test-client-id');
	});

	it('Returns false when parent block is not a template part', () => {
		getIsSiteEditor.mockReturnValue(true);
		getIsTemplatePart.mockReturnValue(false);

		const mockNonTemplatePartParent = {
			name: 'core/paragraph',
			attributes: {
				slug: 'some-slug',
			},
		};

		getTemplatePart.mockReturnValue(mockNonTemplatePartParent);

		const result = getTemplatePartSlug('test-client-id');

		expect(result).toBe(false);
		expect(getIsSiteEditor).toHaveBeenCalled();
		expect(getIsTemplatePart).toHaveBeenCalled();
		expect(getTemplatePart).toHaveBeenCalledWith('test-client-id');
	});
});
