import getTemplatePartTagName from '@extensions/fse/getTemplatePartTagName';
import getIsSiteEditor from '@extensions/fse/getIsSiteEditor';
import getIsTemplatePart from '@extensions/fse/getIsTemplatePart';
import getTemplatePart from '@extensions/fse/getTemplatePart';
import { select } from '@wordpress/data';

jest.mock('@extensions/fse/getIsSiteEditor', () => jest.fn());
jest.mock('@extensions/fse/getIsTemplatePart', () => jest.fn());
jest.mock('@extensions/fse/getTemplatePart', () => jest.fn());
jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

describe('getTemplatePartTagName', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Returns false when not in site editor', () => {
		getIsSiteEditor.mockReturnValue(false);

		const result = getTemplatePartTagName('test-client-id');

		expect(result).toBe(false);
		expect(getIsSiteEditor).toHaveBeenCalled();
		expect(getIsTemplatePart).not.toHaveBeenCalled();
		expect(select).not.toHaveBeenCalled();
		expect(getTemplatePart).not.toHaveBeenCalled();
	});

	it('Returns tagName from post ID when in template part editor', () => {
		getIsSiteEditor.mockReturnValue(true);
		getIsTemplatePart.mockReturnValue(true);

		const mockEditSiteStore = {
			getEditedPostId: jest
				.fn()
				.mockReturnValue('wp_template_part//header//div'),
		};

		select.mockReturnValue(mockEditSiteStore);

		const result = getTemplatePartTagName('test-client-id');

		expect(result).toBe('header');
		expect(getIsSiteEditor).toHaveBeenCalled();
		expect(getIsTemplatePart).toHaveBeenCalled();
		expect(select).toHaveBeenCalledWith('core/edit-site');
		expect(mockEditSiteStore.getEditedPostId).toHaveBeenCalled();
		expect(getTemplatePart).not.toHaveBeenCalled();
	});

	it('Returns tagName from template part parent when in template editor', () => {
		getIsSiteEditor.mockReturnValue(true);
		getIsTemplatePart.mockReturnValue(false);

		const mockTemplatePartParent = {
			name: 'core/template-part',
			attributes: {
				tagName: 'header',
			},
		};

		getTemplatePart.mockReturnValue(mockTemplatePartParent);

		const result = getTemplatePartTagName('test-client-id');

		expect(result).toBe('header');
		expect(getIsSiteEditor).toHaveBeenCalled();
		expect(getIsTemplatePart).toHaveBeenCalled();
		expect(getTemplatePart).toHaveBeenCalledWith('test-client-id');
	});

	it('Returns false when template part parent is not found', () => {
		getIsSiteEditor.mockReturnValue(true);
		getIsTemplatePart.mockReturnValue(false);
		getTemplatePart.mockReturnValue(null);

		const result = getTemplatePartTagName('test-client-id');

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
				tagName: 'div',
			},
		};

		getTemplatePart.mockReturnValue(mockNonTemplatePartParent);

		const result = getTemplatePartTagName('test-client-id');

		expect(result).toBe(false);
		expect(getIsSiteEditor).toHaveBeenCalled();
		expect(getIsTemplatePart).toHaveBeenCalled();
		expect(getTemplatePart).toHaveBeenCalledWith('test-client-id');
	});
});
