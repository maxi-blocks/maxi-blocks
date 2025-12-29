import apiFetch from '@wordpress/api-fetch';
import { createReduxStore, dispatch, register } from '@wordpress/data';

import {
	loadFromIndexedDB,
	saveToIndexedDB,
} from '../uniqueIDCacheDB';

jest.mock('@wordpress/api-fetch', () => jest.fn());

jest.mock('@wordpress/data', () => ({
	createReduxStore: jest.fn(() => ({})),
	register: jest.fn(),
	dispatch: jest.fn(),
}));

jest.mock('../uniqueIDCacheDB', () => ({
	loadFromIndexedDB: jest.fn(),
	saveToIndexedDB: jest.fn(),
	clearIndexedDB: jest.fn(),
}));

describe('uniqueID cache initialization', () => {
	const originalNodeEnv = process.env.NODE_ENV;
	const originalReadyState = Object.getOwnPropertyDescriptor(
		document,
		'readyState'
	);

	afterEach(() => {
		process.env.NODE_ENV = originalNodeEnv;
		if (originalReadyState) {
			Object.defineProperty(document, 'readyState', originalReadyState);
		}
		jest.resetModules();
		jest.clearAllMocks();
	});

	it('loads cached data, validates with 304 response, and avoids refetch', async () => {
		process.env.NODE_ENV = 'development';
		Object.defineProperty(document, 'readyState', {
			value: 'complete',
			configurable: true,
		});

		const loadUniqueIDCache = jest.fn();
		dispatch.mockReturnValue({ loadUniqueIDCache });

		loadFromIndexedDB.mockResolvedValue({
			uniqueIDs: ['cached-id-1'],
			hash: 'hash-123',
			timestamp: 123,
		});

		apiFetch.mockResolvedValue({ status: 'not_modified' });

		jest.isolateModules(() => {
			require('../index');
		});

		await new Promise(resolve => setImmediate(resolve));

		expect(createReduxStore).toHaveBeenCalled();
		expect(register).toHaveBeenCalled();
		expect(dispatch).toHaveBeenCalledWith('maxiBlocks/blocks');
		expect(loadUniqueIDCache).toHaveBeenCalledWith(['cached-id-1']);
		expect(apiFetch).toHaveBeenCalledTimes(1);
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/maxi-blocks/v1.0/unique-ids/all?page=1&per_page=1000&client_hash=hash-123',
			method: 'GET',
		});
		expect(saveToIndexedDB).not.toHaveBeenCalled();
	});
});
