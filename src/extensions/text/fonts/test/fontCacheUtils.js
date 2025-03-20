import {
	getStorageCache,
	setStorageCache,
	cleanUrl,
} from '@extensions/text/fonts/fontCacheUtils';

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();
const mockClear = jest.fn();

let store = {};

mockGetItem.mockImplementation(key => store[key] || null);
mockSetItem.mockImplementation((key, value) => {
	store[key] = value;
});
mockRemoveItem.mockImplementation(key => {
	delete store[key];
});
mockClear.mockImplementation(() => {
	store = {};
});

Object.defineProperty(global, 'localStorage', {
	value: {
		getItem: mockGetItem,
		setItem: mockSetItem,
		removeItem: mockRemoveItem,
		clear: mockClear,
	},
	writable: true,
});

const mockTimestamp = 1600000000000;
const originalDateNow = Date.now;

describe('fontCacheUtils', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		store = {};
		Date.now = jest.fn(() => mockTimestamp);
	});

	afterAll(() => {
		Date.now = originalDateNow;
	});

	describe('getStorageCache', () => {
		it('Returns null when cache key does not exist', () => {
			const result = getStorageCache('nonexistent');
			expect(result).toBeNull();
			expect(mockGetItem).toHaveBeenCalledWith('maxi_font_nonexistent');
		});

		it('Returns null when JSON parsing fails', () => {
			mockGetItem.mockReturnValueOnce('invalid json');
			const result = getStorageCache('test');
			expect(result).toBeNull();
		});

		it('Returns cached value when within cache duration', () => {
			const cachedData = {
				value: 'cached value',
				timestamp: mockTimestamp - 1000, // 1 second ago
			};
			mockGetItem.mockReturnValueOnce(JSON.stringify(cachedData));

			const result = getStorageCache('test');
			expect(result).toBe('cached value');
		});

		it('Removes and returns null for expired cache', () => {
			// Set cache duration to a large value to simulate expired cache
			const cachedData = {
				value: 'expired value',
				timestamp: mockTimestamp - (30 * 24 * 60 * 60 * 1000 + 1), // Just over 30 days
			};
			mockGetItem.mockReturnValueOnce(JSON.stringify(cachedData));

			const result = getStorageCache('test');
			expect(result).toBeNull();
			expect(mockRemoveItem).toHaveBeenCalledWith('maxi_font_test');
		});
	});

	describe('setStorageCache', () => {
		it('Stores value with timestamp in localStorage', () => {
			setStorageCache('test', 'test value');

			expect(mockSetItem).toHaveBeenCalledWith(
				'maxi_font_test',
				JSON.stringify({
					value: 'test value',
					timestamp: mockTimestamp,
				})
			);
		});

		it('Handles localStorage errors gracefully', () => {
			mockSetItem.mockImplementationOnce(() => {
				throw new Error('Storage full');
			});

			expect(() => setStorageCache('test', 'test value')).not.toThrow();
		});
	});

	describe('cleanUrl', () => {
		const originalLocation = window.location;

		beforeEach(() => {
			delete window.location;
			window.location = {
				origin: 'https://example.com',
			};
		});

		afterEach(() => {
			window.location = originalLocation;
		});

		it('Removes quotes from URLs', () => {
			const dirtyUrl = '"https://example.com/font.woff2"';
			const result = cleanUrl(dirtyUrl);
			expect(result).toBe('https://example.com/font.woff2');
		});

		it('Removes backslashes from URLs', () => {
			const dirtyUrl = 'https://example.com/font\\path.woff2';
			const result = cleanUrl(dirtyUrl);
			expect(result).toBe('https://example.com/fontpath.woff2');
		});

		it('Fixes multiple slashes in URLs', () => {
			const dirtyUrl = 'https://example.com//fonts//font.woff2';
			const result = cleanUrl(dirtyUrl);
			expect(result).toBe('https://example.com/fonts/font.woff2');
		});

		it('Removes $fontData placeholder', () => {
			const dirtyUrl = 'https://example.com/$fontData/font.woff2';
			const result = cleanUrl(dirtyUrl);
			expect(result).toBe('https://example.com//font.woff2');
		});

		it('Fixes double domain issue for local fonts', () => {
			const dirtyUrl = 'https://example.com/example.com/font.woff2';
			const result = cleanUrl(dirtyUrl);
			expect(result).toBe('https://example.com/font.woff2');
		});

		it('Fixes http protocol with missing slash', () => {
			const dirtyUrl = 'http:/example.com/font.woff2';
			const result = cleanUrl(dirtyUrl);
			expect(result).toBe('http://example.com/font.woff2');
		});

		it('Fixes https protocol with missing slash', () => {
			const dirtyUrl = 'https:/example.com/font.woff2';
			const result = cleanUrl(dirtyUrl);
			expect(result).toBe('https://example.com/font.woff2');
		});

		it('Handles multiple issues in a single URL', () => {
			const dirtyUrl =
				'"https:/example.com//example.com//$fontDatafont\\/path.woff2"';
			const result = cleanUrl(dirtyUrl);
			expect(result).toBe('https://example.com/font/path.woff2');
		});

		it('Trims whitespace from URLs', () => {
			const dirtyUrl = '  https://example.com/font.woff2  ';
			const result = cleanUrl(dirtyUrl);
			expect(result).toBe('https://example.com/font.woff2');
		});
	});
});
