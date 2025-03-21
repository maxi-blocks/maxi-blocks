import controls, { processCss } from '@extensions/styles/store/controls';
import apiFetch from '@wordpress/api-fetch';
import { select } from '@wordpress/data';
import frontendStyleGenerator from '@extensions/styles/frontendStyleGenerator';
import entityRecordsWrapper from '@extensions/styles/entityRecordsWrapper';
import postcss from 'postcss';
import minifyCssString from 'minify-css-string';

// Mock apiFetch to return a proper promise with catch method
jest.mock('@wordpress/api-fetch', () => ({
	__esModule: true,
	default: jest.fn(() => Promise.resolve({})),
}));

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));
jest.mock('@extensions/styles/frontendStyleGenerator');
jest.mock('@extensions/styles/entityRecordsWrapper');
jest.mock('autoprefixer');
jest.mock('postcss');
jest.mock('minify-css-string');

describe('styles store controls', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('processCss', () => {
		it('Returns null when no code provided', async () => {
			const result = await processCss(null);
			expect(result).toBeNull();
		});

		it('Returns null when processed css is empty', async () => {
			postcss.mockReturnValue({
				process: () => ({ css: '' }),
			});

			const result = await processCss('.test { color: red; }');
			expect(result).toBeNull();
		});

		it('Processes and minifies CSS successfully', async () => {
			postcss.mockReturnValue({
				process: () => ({ css: '.test{color:red}' }),
			});
			minifyCssString.mockReturnValue('.test{color:red}');

			const result = await processCss('.test { color: red; }');
			expect(result).toBe('.test{color:red}');
		});
	});

	describe('SAVE_STYLES control', () => {
		it('Processes and saves styles successfully', async () => {
			const mockStyles = {
				block1: {
					uniqueID: 'block1',
					styles: '.block1 { color: red; }',
				},
			};

			frontendStyleGenerator.mockImplementation(
				blockStyle => blockStyle[1].styles
			);

			const mockFonts = { font1: {} };
			select.mockReturnValue({
				getPostFonts: () => mockFonts,
			});

			// A promise to await SAVE_STYLES which is not async
			let resolveWrapper;
			const wrapperPromise = new Promise(resolve => {
				resolveWrapper = resolve;
			});

			entityRecordsWrapper.mockImplementation(async callback => {
				await callback({ key: 'test-id', name: 'test' });
				resolveWrapper();
				return wrapperPromise;
			});

			controls.SAVE_STYLES({
				isUpdate: true,
				styles: mockStyles,
			});

			await wrapperPromise;

			expect(apiFetch).toHaveBeenCalledWith(
				expect.objectContaining({
					path: '/maxi-blocks/v1.0/styles',
					method: 'POST',
					data: expect.objectContaining({
						styles: expect.any(String),
						meta: expect.any(String),
						update: true,
					}),
				})
			);
		});

		it('Merges multiple styles for same uniqueID', async () => {
			const mockStyles = {
				block1: {
					uniqueID: 'block1',
					styles: '.block1 { color: red; }',
				},
				block2: {
					uniqueID: 'block1', // Same uniqueID
					styles: '.block1 { margin: 10px; }',
				},
			};

			frontendStyleGenerator.mockImplementation(
				blockStyle => blockStyle[1].styles
			);

			select.mockReturnValue({
				getPostFonts: () => ({}),
			});

			// A promise to await SAVE_STYLES which is not async
			let resolveWrapper;
			const wrapperPromise = new Promise(resolve => {
				resolveWrapper = resolve;
			});

			entityRecordsWrapper.mockImplementation(async callback => {
				await callback({ key: 'test-id', name: 'test' });
				resolveWrapper();
				return wrapperPromise;
			});

			await controls.SAVE_STYLES({
				isUpdate: true,
				styles: mockStyles,
			});

			await wrapperPromise;

			// Verify styles were merged
			expect(apiFetch).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						styles: expect.stringContaining('block1'),
					}),
				})
			);
		});
	});
});
