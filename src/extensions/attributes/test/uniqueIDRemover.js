import uniqueIDRemover from '@extensions/attributes/uniqueIDRemover';
import apiFetch from '@wordpress/api-fetch';

// Mock dependencies
jest.mock('@wordpress/api-fetch');

describe('uniqueIDRemover', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should return null for empty or nil uniqueID', async () => {
		const result1 = await uniqueIDRemover('');
		expect(result1).toBeNull();

		const result2 = await uniqueIDRemover(null);
		expect(result2).toBeNull();

		const result3 = await uniqueIDRemover(undefined);
		expect(result3).toBeNull();

		expect(apiFetch).not.toHaveBeenCalled();
	});

	it('Should remove single uniqueID', async () => {
		apiFetch.mockResolvedValue(true);

		const result = await uniqueIDRemover('block-123');

		expect(result).toEqual({ response: 'true' });
		expect(apiFetch).toHaveBeenCalledTimes(1);
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-id/remove/block-123',
			method: 'DELETE',
		});
	});

	it('Should handle API error response', async () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
		apiFetch.mockResolvedValue(false);

		const result = await uniqueIDRemover('block-123');

		expect(result).toEqual({ response: 'true' });
		expect(consoleSpy).toHaveBeenCalledWith(
			'There was an error with the fetch call',
			'Could not remove block block-123 from the DB'
		);
		expect(apiFetch).toHaveBeenCalledTimes(1);

		consoleSpy.mockRestore();
	});

	it('Should handle unexpected API response', async () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
		apiFetch.mockResolvedValue({ status: 'error' });

		const result = await uniqueIDRemover('block-123');

		expect(result).toEqual({ response: 'true' });
		expect(consoleSpy).toHaveBeenCalledWith(
			'There was an error with the fetch call',
			'Unexpected response data: {"status":"error"}'
		);
		expect(apiFetch).toHaveBeenCalledTimes(1);

		consoleSpy.mockRestore();
	});

	it('Should handle API network error', async () => {
		const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
		apiFetch.mockRejectedValue(new Error('Network error'));

		const result = await uniqueIDRemover('block-123');

		expect(result).toEqual({ response: 'true' });
		expect(consoleSpy).toHaveBeenCalledWith(
			'There was an error with the fetch call',
			'Network error'
		);
		expect(apiFetch).toHaveBeenCalledTimes(1);

		consoleSpy.mockRestore();
	});

	it('Should process inner blocks recursively', async () => {
		apiFetch.mockResolvedValue(true);

		const innerBlocks = [
			{
				attributes: { uniqueID: 'child-1' },
				innerBlocks: [
					{
						attributes: { uniqueID: 'grandchild-1' },
						innerBlocks: [],
					},
					{
						attributes: { uniqueID: 'grandchild-2' },
						innerBlocks: [
							{
								attributes: { uniqueID: 'great-grandchild-1' },
								innerBlocks: [],
							},
						],
					},
				],
			},
			{
				attributes: { uniqueID: 'child-2' },
				innerBlocks: [],
			},
		];

		const result = await uniqueIDRemover('parent-1', innerBlocks);

		expect(result).toEqual({ response: 'true' });
		expect(apiFetch).toHaveBeenCalledTimes(6);
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-id/remove/parent-1',
			method: 'DELETE',
		});
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-id/remove/child-1',
			method: 'DELETE',
		});
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-id/remove/grandchild-1',
			method: 'DELETE',
		});
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-id/remove/grandchild-2',
			method: 'DELETE',
		});
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-id/remove/great-grandchild-1',
			method: 'DELETE',
		});
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-id/remove/child-2',
			method: 'DELETE',
		});
	});

	it('Should handle blocks without uniqueID', async () => {
		apiFetch.mockResolvedValue(true);

		const innerBlocks = [
			{
				attributes: {},
				innerBlocks: [
					{
						attributes: { uniqueID: 'child-1' },
						innerBlocks: [],
					},
				],
			},
			{
				attributes: { uniqueID: 'child-2' },
				innerBlocks: [],
			},
		];

		const result = await uniqueIDRemover('parent-1', innerBlocks);

		expect(result).toEqual({ response: 'true' });
		expect(apiFetch).toHaveBeenCalledTimes(3);
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-id/remove/parent-1',
			method: 'DELETE',
		});
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-id/remove/child-1',
			method: 'DELETE',
		});
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-id/remove/child-2',
			method: 'DELETE',
		});
	});
});
