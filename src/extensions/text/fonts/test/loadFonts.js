import {
	getStorageCache,
	setStorageCache,
} from '@extensions/text/fonts/fontCacheUtils';
import { getFontUrl, loadFonts } from '@extensions/text/fonts/loadFonts';
import {
	buildFontUrl,
	isCacheValid,
} from '@extensions/text/fonts/loadFontUtils';

jest.mock('@wordpress/data', () => ({
	select: jest.fn().mockReturnValue({
		getFont: jest.fn().mockReturnValue({
			files: {
				400: 'regular',
				500: 'medium',
				700: 'bold',
				'400italic': 'italic',
				'500italic': 'medium-italic',
				'700italic': 'bold-italic',
			},
		}),
	}),
}));

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

jest.mock('@extensions/text/fonts/loadFontUtils', () => ({
	buildFontUrl: jest.fn(() => Promise.resolve('')),
	isCacheValid: jest.fn(() => Promise.resolve(true)),
}));

describe('getFontUrl', () => {
	let originalWindow;
	let mockFetch;

	beforeEach(() => {
		originalWindow = { ...window };
		mockFetch = jest.fn();
		global.fetch = mockFetch;

		window.maxiBlocksMain = { local_fonts: false, bunny_fonts: false };

		jest.clearAllMocks();
	});

	afterEach(() => {
		window = originalWindow;
		jest.clearAllMocks();
	});

	it('Should return cached URL when available and valid', async () => {
		const fontName = 'Roboto';
		const fontData = { weight: '400', style: 'normal' };
		const cachedUrl =
			'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap';
		const requestKey = `${fontName}-${JSON.stringify(fontData)}`;

		getStorageCache.mockReturnValue(cachedUrl);
		isCacheValid.mockResolvedValue(true);

		const result = await getFontUrl(fontName, fontData);

		expect(result).toBe(cachedUrl);
		expect(getStorageCache).toHaveBeenCalledWith(requestKey);
		expect(isCacheValid).toHaveBeenCalledWith(cachedUrl);
		expect(buildFontUrl).not.toHaveBeenCalled();
		expect(setStorageCache).not.toHaveBeenCalled();
	});

	it('Should clear invalid cache and build new URL', async () => {
		const fontName = 'Roboto';
		const fontData = { weight: '400', style: 'normal' };
		const cachedUrl =
			'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap';
		const newUrl =
			'https://fonts.googleapis.com/css2?family=Railway:wght@400&display=swap';
		const requestKey = `${fontName}-${JSON.stringify(fontData)}`;

		getStorageCache.mockReturnValue(cachedUrl);
		isCacheValid.mockImplementation(url =>
			Promise.resolve(url !== cachedUrl)
		);
		buildFontUrl.mockResolvedValue(newUrl);

		const result = await getFontUrl(fontName, fontData);

		expect(result).toBe(newUrl);
		expect(getStorageCache).toHaveBeenCalledWith(requestKey);
		expect(buildFontUrl).toHaveBeenCalledWith(fontName, fontData);
		expect(setStorageCache).toHaveBeenCalledWith(requestKey, newUrl);
	});

	it('Should build and cache new URL when no cache exists', async () => {
		const fontName = 'Lato';
		const fontData = { weight: '700', style: 'normal' };
		const newUrl =
			'https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap';
		const requestKey = `${fontName}-${JSON.stringify(fontData)}`;

		getStorageCache.mockReturnValue(null);
		buildFontUrl.mockResolvedValue(newUrl);
		isCacheValid.mockResolvedValue(true);

		const result = await getFontUrl(fontName, fontData);

		expect(result).toBe(newUrl);
		expect(getStorageCache).toHaveBeenCalledWith(requestKey);
		expect(buildFontUrl).toHaveBeenCalledWith(fontName, fontData);
		expect(isCacheValid).toHaveBeenCalledWith(newUrl);
		expect(setStorageCache).toHaveBeenCalledWith(requestKey, newUrl);
	});

	it('Should throw error when built URL is not valid', async () => {
		const fontName = 'Invalid Font';
		const fontData = { weight: '400', style: 'normal' };
		const invalidUrl = 'https://invalid-url.com/font.woff2';
		const requestKey = `${fontName}-${JSON.stringify(fontData)}`;

		getStorageCache.mockReturnValue(null);
		buildFontUrl.mockResolvedValue(invalidUrl);
		isCacheValid.mockResolvedValue(false);

		await expect(getFontUrl(fontName, fontData)).rejects.toThrow(
			`Invalid font URL: ${invalidUrl}`
		);
		expect(getStorageCache).toHaveBeenCalledWith(requestKey);
		expect(buildFontUrl).toHaveBeenCalledWith(fontName, fontData);
		expect(isCacheValid).toHaveBeenCalledWith(invalidUrl);
		expect(setStorageCache).not.toHaveBeenCalled();
	});

	it('Should handle errors during URL building', async () => {
		const fontName = 'Error Font';
		const fontData = { weight: '400', style: 'normal' };
		const errorMessage = 'Network error during font URL building';

		buildFontUrl.mockRejectedValue(new Error(errorMessage));

		await expect(getFontUrl(fontName, fontData)).rejects.toThrow(
			errorMessage
		);
		expect(console.error).toHaveBeenCalled();
	});
});

describe('loadFonts', () => {
	let originalWindow;
	let originalDocument;
	let createElementSpy;
	let querySelectorSpy;
	let appendChildSpy;

	beforeEach(() => {
		originalWindow = { ...window };
		originalDocument = { ...document };

		createElementSpy = jest
			.spyOn(document, 'createElement')
			.mockImplementation(() => ({
				rel: '',
				href: '',
				type: '',
				media: '',
				id: '',
				onload: null,
				appendChild: jest.fn(),
			}));

		querySelectorSpy = jest.spyOn(document, 'querySelector');
		appendChildSpy = jest
			.spyOn(document.head, 'appendChild')
			.mockImplementation(() => {});

		window.maxiBlocksMain = { local_fonts: false, bunny_fonts: false };

		isCacheValid.mockResolvedValue(true);
	});

	afterEach(() => {
		window = originalWindow;
		document = originalDocument;
		jest.clearAllMocks();
	});

	it('Should load single font with single weight', async () => {
		const font = {
			Inconsolata: {
				weight: '400',
			},
		};

		buildFontUrl.mockResolvedValue(
			'https://fonts.googleapis.com/css2?family=Inconsolata:wght@400&display=swap'
		);

		await loadFonts(font);

		expect(buildFontUrl).toHaveBeenCalledWith('Inconsolata', {
			weight: '400',
			style: 'normal',
		});
		expect(createElementSpy).toHaveBeenCalledWith('link');
		expect(appendChildSpy).toHaveBeenCalled();
	});

	it('Should load font with multiple weights', async () => {
		const font = {
			Roboto: {
				weight: '500,400',
			},
		};

		buildFontUrl
			.mockResolvedValueOnce(
				'https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap'
			)
			.mockResolvedValueOnce(
				'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap'
			);

		await loadFonts(font);

		const expectedFontData = [
			{
				fontName: 'Roboto',
				fontData: {
					weight: '400',
					style: 'normal',
				},
			},
			{
				fontName: 'Roboto',
				fontData: {
					weight: '500',
					style: 'normal',
				},
			},
		];

		expect(createElementSpy).toHaveBeenCalledWith('link');
		expect(appendChildSpy).toHaveBeenCalled();
		expectedFontData.forEach(fontData => {
			expect(buildFontUrl).toHaveBeenCalledWith(
				fontData.fontName,
				fontData.fontData
			);
		});
	});

	it('Should load font with italic style', async () => {
		const font = {
			'Open Sans': {
				weight: '400',
				style: 'italic',
			},
		};

		buildFontUrl.mockResolvedValue(
			'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@1,400&display=swap'
		);

		await loadFonts(font);

		expect(createElementSpy).toHaveBeenCalledWith('link');
		expect(appendChildSpy).toHaveBeenCalled();
		expect(buildFontUrl).toHaveBeenCalledWith('Open Sans', {
			weight: '400',
			style: 'italic',
		});
	});

	it('Should load multiple fonts with different configurations', async () => {
		const font = {
			Inconsolata: {
				weight: '400',
			},
			Roboto: {
				weight: '500,400',
				style: 'italic',
			},
		};

		buildFontUrl
			.mockResolvedValueOnce(
				'https://fonts.googleapis.com/css2?family=Inconsolata:wght@400&display=swap'
			)
			.mockResolvedValueOnce(
				'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@500&display=swap'
			)
			.mockResolvedValueOnce(
				'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@400&display=swap'
			);

		await loadFonts(font);

		const expectedFontData = [
			{
				fontName: 'Inconsolata',
				fontData: {
					weight: '400',
					style: 'normal',
				},
			},
			{
				fontName: 'Roboto',
				fontData: {
					weight: '400',
					style: 'italic',
				},
			},
			{
				fontName: 'Roboto',
				fontData: {
					weight: '500',
					style: 'italic',
				},
			},
		];

		expectedFontData.forEach(fontData => {
			expect(buildFontUrl).toHaveBeenCalledWith(
				fontData.fontName,
				fontData.fontData
			);
		});
		expect(appendChildSpy).toHaveBeenCalledTimes(expectedFontData.length);
		expect(buildFontUrl).toHaveBeenCalledTimes(expectedFontData.length);
	});

	it('Should handle font loading in iframe editor', async () => {
		const font = {
			Roboto: {
				weight: '400',
			},
		};

		const mockIframe = {
			contentDocument: {
				head: {
					appendChild: jest.fn(),
					querySelector: jest.fn(() => null),
				},
				getElementById: jest.fn(),
				createElement: jest.fn(() => ({
					rel: '',
					href: '',
					type: '',
					media: '',
					id: '',
					onload: null,
					appendChild: jest.fn(),
				})),
			},
		};

		querySelectorSpy.mockReturnValue(mockIframe);

		buildFontUrl.mockResolvedValue(
			'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap'
		);

		await loadFonts(font, true, mockIframe.contentDocument);

		expect(mockIframe.contentDocument.head.appendChild).toHaveBeenCalled();
		expect(buildFontUrl).toHaveBeenCalledWith('Roboto', {
			weight: '400',
			style: 'normal',
		});
	});
});
