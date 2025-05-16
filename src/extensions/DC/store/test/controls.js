/**
 * WordPress dependencies
 */
import { resolveSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import controls, { clearCache } from '@extensions/DC/store/controls';

jest.mock('@wordpress/data', () => ({
	resolveSelect: jest.fn(),
}));

jest.mock('@wordpress/api-fetch', () => jest.fn());

global.wp = {
	domReady: jest.fn(callback => callback()),
};

describe('DC/controls', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		clearCache();
	});

	describe('GET_POST_TYPES', () => {
		it('should fetch post types and return them', async () => {
			const mockPostTypes = [
				{ slug: 'post', supports: { editor: true } },
				{ slug: 'page', supports: { editor: true } },
			];

			const getPostTypes = jest.fn().mockResolvedValue(mockPostTypes);
			resolveSelect.mockImplementation(() => ({
				getPostTypes,
			}));

			const result = await controls.GET_POST_TYPES();

			expect(resolveSelect).toHaveBeenCalledWith('core');
			expect(getPostTypes).toHaveBeenCalledWith({
				per_page: -1,
			});
			expect(result).toEqual(mockPostTypes);
		});

		it('should use cached result on subsequent calls', async () => {
			const mockPostTypes = [
				{ slug: 'post', supports: { editor: true } },
				{ slug: 'page', supports: { editor: true } },
			];

			resolveSelect.mockImplementation(() => ({
				getPostTypes: jest.fn().mockResolvedValue(mockPostTypes),
			}));

			await controls.GET_POST_TYPES();

			// Reset mocks to verify they aren't called again
			resolveSelect.mockClear();

			// Second call should use cache
			const result = await controls.GET_POST_TYPES();

			expect(resolveSelect).not.toHaveBeenCalled();
			expect(result).toEqual(mockPostTypes);
		});
	});

	describe('GET_TAXONOMIES', () => {
		it('should fetch taxonomies and return them', async () => {
			const mockTaxonomies = [{ slug: 'category' }, { slug: 'post_tag' }];

			const getTaxonomies = jest.fn().mockResolvedValue(mockTaxonomies);
			resolveSelect.mockImplementation(() => ({
				getTaxonomies,
			}));

			const result = await controls.GET_TAXONOMIES();

			expect(resolveSelect).toHaveBeenCalledWith('core');
			expect(getTaxonomies).toHaveBeenCalledWith({
				per_page: -1,
			});
			expect(result).toEqual(mockTaxonomies);
		});

		it('should use cached result on subsequent calls', async () => {
			const mockTaxonomies = [{ slug: 'category' }, { slug: 'post_tag' }];

			resolveSelect.mockImplementation(() => ({
				getTaxonomies: jest.fn().mockResolvedValue(mockTaxonomies),
			}));

			await controls.GET_TAXONOMIES();

			resolveSelect.mockClear();

			const result = await controls.GET_TAXONOMIES();

			expect(resolveSelect).not.toHaveBeenCalled();
			expect(result).toEqual(mockTaxonomies);
		});
	});

	describe('GET_INTEGRATION_PLUGINS', () => {
		it('should fetch integration plugins via API and return them', async () => {
			const mockPlugins = ['acf', 'woocommerce'];

			apiFetch.mockResolvedValue(mockPlugins);

			const result = await controls.GET_INTEGRATION_PLUGINS();

			expect(apiFetch).toHaveBeenCalledWith({
				path: '/maxi-blocks/v1.0/get-active-integration-plugins',
				method: 'GET',
			});
			expect(result).toEqual(mockPlugins);
		});

		it('should use cached result on subsequent calls', async () => {
			const mockPlugins = ['acf', 'woocommerce'];

			apiFetch.mockResolvedValue(mockPlugins);

			await controls.GET_INTEGRATION_PLUGINS();

			apiFetch.mockClear();

			const result = await controls.GET_INTEGRATION_PLUGINS();

			expect(apiFetch).not.toHaveBeenCalled();
			expect(result).toEqual(mockPlugins);
		});

		it('should return empty array and log error when API call fails', async () => {
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation();
			const errorMessage = 'API Error';

			apiFetch.mockRejectedValue(new Error(errorMessage));

			const result = await controls.GET_INTEGRATION_PLUGINS();

			expect(apiFetch).toHaveBeenCalled();
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Error loading integration plugins:',
				expect.any(Error)
			);
			expect(result).toEqual([]);

			consoleErrorSpy.mockRestore();
		});

		it('should handle null response from API', async () => {
			apiFetch.mockResolvedValue(null);

			const result = await controls.GET_INTEGRATION_PLUGINS();

			expect(result).toEqual([]);
		});
	});
});
