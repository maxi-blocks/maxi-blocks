import controls from '@extensions/style-cards/store/controls';
import apiFetch from '@wordpress/api-fetch';
import { createSCStyleString } from '@extensions/style-cards/updateSCOnEditor';
import getSCVariablesObject from '@extensions/style-cards/getSCVariablesObject';
import getSCStyles from '@extensions/style-cards/getSCStyles';

jest.mock('@wordpress/api-fetch', () => jest.fn(() => Promise.resolve({})));
jest.mock('@extensions/style-cards/updateSCOnEditor', () => ({
	createSCStyleString: jest.fn(),
}));
jest.mock('@extensions/style-cards/getSCVariablesObject', () => jest.fn());
jest.mock('@extensions/style-cards/getSCStyles', () => jest.fn());

describe('style-cards store controls', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('RECEIVE_STYLE_CARDS control', () => {
		it('Fetches style cards from API and parses the response', async () => {
			const mockResponse = JSON.stringify({
				styleCard1: { name: 'Style Card 1' },
				styleCard2: { name: 'Style Card 2' },
			});

			apiFetch.mockResolvedValue(mockResponse);

			const result = await controls.RECEIVE_STYLE_CARDS();

			expect(apiFetch).toHaveBeenCalledWith({
				path: '/maxi-blocks/v1.0/style-cards/',
			});
			expect(result).toEqual({
				styleCard1: { name: 'Style Card 1' },
				styleCard2: { name: 'Style Card 2' },
			});
		});
	});

	describe('SAVE_STYLE_CARDS control', () => {
		it('Saves style cards to API', async () => {
			const styleCards = {
				styleCard1: { name: 'Style Card 1' },
				styleCard2: { name: 'Style Card 2' },
			};

			await controls.SAVE_STYLE_CARDS(styleCards);

			expect(apiFetch).toHaveBeenCalledWith({
				path: '/maxi-blocks/v1.0/style-cards/',
				method: 'POST',
				data: {
					styleCards: JSON.stringify(styleCards),
				},
			});
		});
	});

	describe('UPDATE_STYLE_CARD control', () => {
		it('Updates style card with variables and styles', async () => {
			const styleCards = {
				value: {
					name: 'Style Card 1',
					gutenberg_blocks_status: true,
				},
			};
			const isUpdate = true;

			const mockVarSC = { color: 'red' };
			const mockVarSCString = ':root { --maxi-color: red; }';
			const mockSCStyles = '.maxi-block { color: red; }';

			getSCVariablesObject.mockReturnValue(mockVarSC);
			createSCStyleString.mockReturnValue(mockVarSCString);
			getSCStyles.mockResolvedValue(mockSCStyles);

			await controls.UPDATE_STYLE_CARD(styleCards, isUpdate);

			expect(getSCVariablesObject).toHaveBeenCalledWith(
				styleCards.value,
				null,
				true
			);
			expect(createSCStyleString).toHaveBeenCalledWith(mockVarSC);
			expect(getSCStyles).toHaveBeenCalledWith(
				mockVarSC,
				styleCards.value.gutenberg_blocks_status
			);
			expect(apiFetch).toHaveBeenCalledWith({
				path: '/maxi-blocks/v1.0/style-card',
				method: 'POST',
				data: {
					sc_variables: mockVarSCString,
					sc_styles: mockSCStyles,
					update: isUpdate,
				},
			});
		});
	});

	describe('RESET_STYLE_CARDS control', () => {
		it('Resets style cards and logs a message', async () => {
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

			await controls.RESET_STYLE_CARDS();

			expect(apiFetch).toHaveBeenCalledWith({
				path: '/maxi-blocks/v1.0/style-cards/reset',
			});
			expect(consoleSpy).toHaveBeenCalledWith(
				"IMPORTANT: the changes won't have any effect until the page is refreshed"
			);

			consoleSpy.mockRestore();
		});
	});
});
