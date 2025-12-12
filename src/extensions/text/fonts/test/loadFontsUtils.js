import buildFontUrl from '@extensions/text/fonts/loadFontUtils';
import { cleanUrl } from '@extensions/text/fonts/fontCacheUtils';

jest.mock('@extensions/text/fonts/fontCacheUtils', () => ({
	cleanUrl: jest.fn(url => url),
	getStorageCache: jest.fn(),
	setStorageCache: jest.fn(),
	fontUrlCache: {
		get: jest.fn(),
		set: jest.fn(),
		delete: jest.fn(),
	},
}));

describe('buildFontUrl', () => {
	let originalWindow;
	let mockFetch;

	beforeEach(() => {
		originalWindow = { ...window };

		mockFetch = jest.fn();
		global.fetch = mockFetch;

		window.maxiBlocksMain = {};
		window.wpApiSettings = {
			root: 'https://example.com/wp-json/',
			nonce: 'test-nonce',
		};
	});

	afterEach(() => {
		window = originalWindow;

		jest.clearAllMocks();
	});

	it('Should build URL for Google Fonts when local_fonts is false', async () => {
		window.maxiBlocksMain = { local_fonts: false, bunny_fonts: false };
		const fontName = 'Open Sans';
		const fontData = { weight: '400', style: 'normal' };

		const result = await buildFontUrl(fontName, fontData);

		expect(result).toBe(
			'https://fonts.googleapis.com/css2?family=Open%20Sans:wght@400&display=swap'
		);
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('Should build URL for Bunny Fonts when bunny_fonts is true', async () => {
		window.maxiBlocksMain = { local_fonts: false, bunny_fonts: true };
		const fontName = 'Roboto';
		const fontData = { weight: '700', style: 'normal' };

		const result = await buildFontUrl(fontName, fontData);

		expect(result).toBe(
			'https://fonts.bunny.net/css2?family=Roboto:wght@700&display=swap'
		);
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('Should handle italic style correctly', async () => {
		window.maxiBlocksMain = { local_fonts: false, bunny_fonts: false };
		const fontName = 'Lato';
		const fontData = { weight: '300', style: 'italic' };

		const result = await buildFontUrl(fontName, fontData);

		expect(result).toBe(
			'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;1,300&display=swap'
		);
	});

	it('Should handle array of weights correctly', async () => {
		window.maxiBlocksMain = { local_fonts: false, bunny_fonts: false };
		const fontName = 'Montserrat';
		const fontData = { weight: ['300', '400', '700'], style: 'normal' };

		const result = await buildFontUrl(fontName, fontData);

		expect(result).toBe(
			'https://fonts.googleapis.com/css2?family=Montserrat:wght@300,400,700&display=swap'
		);
	});

	it('Should use default weight when not provided', async () => {
		window.maxiBlocksMain = { local_fonts: false, bunny_fonts: false };
		const fontName = 'Poppins';
		const fontData = { style: 'normal' };

		const result = await buildFontUrl(fontName, fontData);

		expect(result).toBe(
			'https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap'
		);
	});

	it('Should use default style when not provided', async () => {
		window.maxiBlocksMain = { local_fonts: false, bunny_fonts: false };
		const fontName = 'Source Sans Pro';
		const fontData = { weight: '600' };

		const result = await buildFontUrl(fontName, fontData);

		expect(result).toBe(
			'https://fonts.googleapis.com/css2?family=Source%20Sans%20Pro:wght@600&display=swap'
		);
	});

	it('Should fetch local font URL when local_fonts is true', async () => {
		window.maxiBlocksMain = { local_fonts: true };
		const fontName = 'Roboto Slab';
		const fontData = { weight: '400', style: 'normal' };

		const mockResponse = {
			ok: true,
			text: jest
				.fn()
				.mockResolvedValue(
					'https://example.com/fonts/roboto-slab.woff2'
				),
		};
		mockFetch.mockResolvedValue(mockResponse);

		await buildFontUrl(fontName, fontData);

		expect(mockFetch).toHaveBeenCalledWith(
			'https://example.com/wp-json/maxi-blocks/v1.0/get-font-url/Roboto+Slab',
			{
				credentials: 'same-origin',
				headers: {
					'X-WP-Nonce': 'test-nonce',
				},
			}
		);
		expect(cleanUrl).toHaveBeenCalledWith(
			'https://example.com/fonts/roboto-slab.woff2'
		);
	});

	it('Should use default API root when wpApiSettings is not available', async () => {
		window.maxiBlocksMain = { local_fonts: true };
		window.wpApiSettings = undefined;
		window.maxiStarterSites = undefined;

		// Mock window.location for consistent testing
		delete window.location;
		window.location = { origin: 'http://localhost' };

		const fontName = 'Merriweather';
		const fontData = { weight: '400', style: 'normal' };

		const mockResponse = {
			ok: true,
			text: jest
				.fn()
				.mockResolvedValue(
					'https://example.com/fonts/merriweather.woff2'
				),
		};
		mockFetch.mockResolvedValue(mockResponse);

		await buildFontUrl(fontName, fontData);

		expect(mockFetch).toHaveBeenCalledWith(
			'http://localhost/wp-json/maxi-blocks/v1.0/get-font-url/Merriweather',
			{
				credentials: 'same-origin',
				headers: {
					'X-WP-Nonce': undefined,
				},
			}
		);
	});

	it('Should use maxiStarterSites.apiRoot when wpApiSettings is not available', async () => {
		window.maxiBlocksMain = { local_fonts: true };
		window.wpApiSettings = undefined;
		window.maxiStarterSites = {
			apiRoot: 'http://localhost/subfolder/wp-json/',
		};

		const fontName = 'Inter';
		const fontData = { weight: '400', style: 'normal' };

		const mockResponse = {
			ok: true,
			text: jest
				.fn()
				.mockResolvedValue('https://example.com/fonts/inter.woff2'),
		};
		mockFetch.mockResolvedValue(mockResponse);

		await buildFontUrl(fontName, fontData);

		expect(mockFetch).toHaveBeenCalledWith(
			'http://localhost/subfolder/wp-json/maxi-blocks/v1.0/get-font-url/Inter',
			{
				credentials: 'same-origin',
				headers: {
					'X-WP-Nonce': undefined,
				},
			}
		);
	});

	it('Should use maxiBlocksMain.apiRoot when wpApiSettings and maxiStarterSites are not available', async () => {
		window.maxiBlocksMain = {
			local_fonts: true,
			apiRoot: 'http://localhost/another/wp-json/',
		};
		window.wpApiSettings = undefined;
		window.maxiStarterSites = undefined;

		const fontName = 'Poppins';
		const fontData = { weight: '400', style: 'normal' };

		const mockResponse = {
			ok: true,
			text: jest
				.fn()
				.mockResolvedValue('https://example.com/fonts/poppins.woff2'),
		};
		mockFetch.mockResolvedValue(mockResponse);

		await buildFontUrl(fontName, fontData);

		expect(mockFetch).toHaveBeenCalledWith(
			'http://localhost/another/wp-json/maxi-blocks/v1.0/get-font-url/Poppins',
			{
				credentials: 'same-origin',
				headers: {
					'X-WP-Nonce': undefined,
				},
			}
		);
	});

	it('Should throw error when fetch response is not ok', async () => {
		window.maxiBlocksMain = { local_fonts: true };
		const fontName = 'Nunito';
		const fontData = { weight: '400', style: 'normal' };

		const mockResponse = {
			ok: false,
			status: 404,
		};
		mockFetch.mockResolvedValue(mockResponse);

		await expect(buildFontUrl(fontName, fontData)).rejects.toThrow(
			'HTTP error! status: 404'
		);
	});

	it('Should encode font name correctly for local fonts', async () => {
		window.maxiBlocksMain = { local_fonts: true };
		const fontName = 'Open Sans Condensed';
		const fontData = { weight: '400', style: 'normal' };

		const mockResponse = {
			ok: true,
			text: jest
				.fn()
				.mockResolvedValue(
					'https://example.com/fonts/open-sans-condensed.woff2'
				),
		};
		mockFetch.mockResolvedValue(mockResponse);

		await buildFontUrl(fontName, fontData);

		expect(mockFetch).toHaveBeenCalledWith(
			'https://example.com/wp-json/maxi-blocks/v1.0/get-font-url/Open+Sans+Condensed',
			expect.any(Object)
		);
	});
});
