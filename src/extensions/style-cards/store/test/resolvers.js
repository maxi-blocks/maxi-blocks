import {
	receiveMaxiStyleCards,
	sendMaxiStyleCards,
} from '@extensions/style-cards/store/actions';
import resolvers from '@extensions/style-cards/store/resolvers';
import updateSCOnEditor from '@extensions/style-cards/updateSCOnEditor';
import getActiveStyleCard from '@extensions/style-cards/getActiveStyleCard';
import { getActiveColourFromSC } from '@editor/style-cards/utils';
import { isEmpty } from 'lodash';

jest.mock('@extensions/style-cards/store/actions', () => ({
	receiveMaxiStyleCards: jest.fn(),
	sendMaxiStyleCards: jest.fn(),
}));
jest.mock('@extensions/style-cards/updateSCOnEditor', () => jest.fn());
jest.mock('@extensions/style-cards/getActiveStyleCard', () => jest.fn());
jest.mock('@editor/style-cards/utils', () => ({
	getActiveColourFromSC: jest.fn(),
}));
jest.mock('lodash', () => ({
	isEmpty: jest.fn(),
}));

describe('style-cards store resolvers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('receiveMaxiStyleCards', () => {
		it('Fetches style cards and updates editor when style cards exist', async () => {
			const mockStyleCards = {
				sc_maxi: {
					name: 'Maxi',
					status: 'active',
					gutenberg_blocks_status: true,
				},
				sc_custom: { name: 'Custom', gutenberg_blocks_status: true },
			};

			receiveMaxiStyleCards.mockReturnValue(mockStyleCards);
			sendMaxiStyleCards.mockReturnValue({ type: 'SEND_STYLE_CARDS' });

			isEmpty.mockReturnValue(false);
			getActiveStyleCard.mockReturnValue({
				value: mockStyleCards.sc_maxi,
				key: 'sc_maxi',
			});
			getActiveColourFromSC.mockReturnValue('#123456');

			const generator = resolvers.receiveMaxiStyleCards();

			// First yield: receiveMaxiStyleCards()
			let next = generator.next();
			expect(next.value).toBe(mockStyleCards);

			// Second yield: sendMaxiStyleCards(mockStyleCards)
			next = generator.next(mockStyleCards);
			expect(next.value).toEqual({ type: 'SEND_STYLE_CARDS' });

			// Generator should be done
			next = generator.next();
			expect(next.done).toBe(true);

			// Verify function calls
			expect(receiveMaxiStyleCards).toHaveBeenCalled();
			expect(isEmpty).toHaveBeenCalledWith(mockStyleCards);
			expect(getActiveStyleCard).toHaveBeenCalledWith(mockStyleCards);
			expect(getActiveColourFromSC).toHaveBeenCalledWith(
				{ value: mockStyleCards.sc_maxi, key: 'sc_maxi' },
				4
			);
			expect(updateSCOnEditor).toHaveBeenCalledWith(
				mockStyleCards.sc_maxi,
				'#123456'
			);
			expect(sendMaxiStyleCards).toHaveBeenCalledWith(mockStyleCards);
		});

		it('Migrates style cards without gutenberg_blocks_status', async () => {
			const mockStyleCards = {
				sc_maxi: { name: 'Maxi', status: 'active' },
				sc_custom: { name: 'Custom' },
			};

			const updatedStyleCards = {
				sc_maxi: {
					name: 'Maxi',
					status: 'active',
					gutenberg_blocks_status: true,
				},
				sc_custom: {
					name: 'Custom',
					gutenberg_blocks_status: true,
				},
			};

			receiveMaxiStyleCards.mockReturnValue(mockStyleCards);
			sendMaxiStyleCards.mockReturnValue({ type: 'SEND_STYLE_CARDS' });

			isEmpty.mockReturnValue(false);
			getActiveStyleCard.mockReturnValue({
				value: updatedStyleCards.sc_maxi,
				key: 'sc_maxi',
			});
			getActiveColourFromSC.mockReturnValue('#123456');

			const generator = resolvers.receiveMaxiStyleCards();

			// First yield: receiveMaxiStyleCards()
			let next = generator.next();
			expect(next.value).toBe(mockStyleCards);

			// Second yield: sendMaxiStyleCards(updatedStyleCards)
			next = generator.next(mockStyleCards);
			expect(next.value).toEqual({ type: 'SEND_STYLE_CARDS' });

			// Generator should be done
			next = generator.next();
			expect(next.done).toBe(true);

			// Verify function calls
			expect(receiveMaxiStyleCards).toHaveBeenCalled();
			expect(isEmpty).toHaveBeenCalledWith(mockStyleCards);
			expect(updateSCOnEditor).toHaveBeenCalledWith(
				updatedStyleCards.sc_maxi,
				'#123456'
			);
			expect(sendMaxiStyleCards).toHaveBeenCalledWith(
				expect.objectContaining({
					sc_maxi: expect.objectContaining({
						gutenberg_blocks_status: true,
					}),
					sc_custom: expect.objectContaining({
						gutenberg_blocks_status: true,
					}),
				})
			);
		});

		it('Handles empty style cards', async () => {
			const mockStyleCards = {};

			receiveMaxiStyleCards.mockReturnValue(mockStyleCards);
			sendMaxiStyleCards.mockReturnValue({ type: 'SEND_STYLE_CARDS' });

			isEmpty.mockReturnValue(true);

			const generator = resolvers.receiveMaxiStyleCards();

			// First yield: receiveMaxiStyleCards()
			let next = generator.next();
			expect(next.value).toBe(mockStyleCards);

			// Second yield: sendMaxiStyleCards(mockStyleCards)
			next = generator.next(mockStyleCards);
			expect(next.value).toEqual({ type: 'SEND_STYLE_CARDS' });

			// Generator should be done
			next = generator.next();
			expect(next.done).toBe(true);

			// Verify function calls
			expect(receiveMaxiStyleCards).toHaveBeenCalled();
			expect(isEmpty).toHaveBeenCalledWith(mockStyleCards);
			expect(getActiveStyleCard).not.toHaveBeenCalled();
			expect(updateSCOnEditor).not.toHaveBeenCalled();
			expect(sendMaxiStyleCards).toHaveBeenCalledWith(mockStyleCards);
		});
	});
});
