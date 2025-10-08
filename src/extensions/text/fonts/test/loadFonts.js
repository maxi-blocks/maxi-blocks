import { getFontUrl, loadFonts } from '@extensions/text/fonts/loadFonts';
import { buildFontUrl } from '@extensions/text/fonts/loadFontUtils';

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
}));

jest.mock('@extensions/text/fonts/loadFontUtils', () => ({
	buildFontUrl: jest.fn(() => Promise.resolve('')),
}));

describe('getFontUrl', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should build and return font URL directly', async () => {
		const fontName = 'Roboto';
		const fontData = { weight: '400', style: 'normal' };
		const expectedUrl =
			'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap';

		buildFontUrl.mockResolvedValue(expectedUrl);

		const result = await getFontUrl(fontName, fontData);

		expect(result).toBe(expectedUrl);
		expect(buildFontUrl).toHaveBeenCalledWith(fontName, fontData);
	});

	it('Should handle empty font data', async () => {
		const fontName = 'Lato';
		const expectedUrl =
			'https://fonts.googleapis.com/css2?family=Lato:wght@400&display=swap';

		buildFontUrl.mockResolvedValue(expectedUrl);

		const result = await getFontUrl(fontName);

		expect(result).toBe(expectedUrl);
		expect(buildFontUrl).toHaveBeenCalledWith(fontName, {});
	});

	it('Should handle errors during URL building', async () => {
		const fontName = 'Error Font';
		const fontData = { weight: '400', style: 'normal' };
		const errorMessage = 'Network error during font URL building';
		const consoleErrorSpy = jest
			.spyOn(console, 'error')
			.mockImplementation();

		buildFontUrl.mockRejectedValue(new Error(errorMessage));

		await expect(getFontUrl(fontName, fontData)).rejects.toThrow(
			errorMessage
		);
		expect(buildFontUrl).toHaveBeenCalledWith(fontName, fontData);
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error getting font URL:',
			expect.any(Error)
		);

		consoleErrorSpy.mockRestore();
	});

	it('Should work with different font configurations', async () => {
		const testCases = [
			{
				fontName: 'Open Sans',
				fontData: { weight: '700', style: 'italic' },
				expectedUrl:
					'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@1,700&display=swap',
			},
			{
				fontName: 'Roboto',
				fontData: { weight: '300,400,700' },
				expectedUrl:
					'https://fonts.googleapis.com/css2?family=Roboto:wght@300,400,700&display=swap',
			},
		];

		await Promise.all(
			testCases.map(async testCase => {
				buildFontUrl.mockResolvedValue(testCase.expectedUrl);

				const result = await getFontUrl(
					testCase.fontName,
					testCase.fontData
				);

				expect(result).toBe(testCase.expectedUrl);
				expect(buildFontUrl).toHaveBeenCalledWith(
					testCase.fontName,
					testCase.fontData
				);
			})
		);
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
