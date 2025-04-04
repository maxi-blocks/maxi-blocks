import actions from '@extensions/maxi-block/store/actions';
import { select } from '@wordpress/data';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

describe('maxi-block actions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('saveLastInsertedBlocks action', () => {
		it('Should create SAVE_LAST_INSERTED_BLOCKS action with clean post', () => {
			const mockGetDirtyEntityRecords = jest.fn().mockReturnValue([]);
			const mockGetCurrentPostId = jest.fn().mockReturnValue('post-123');

			select.mockImplementation(store => {
				if (store === 'core') {
					return {
						__experimentalGetDirtyEntityRecords:
							mockGetDirtyEntityRecords,
					};
				}
				if (store === 'core/editor') {
					return {
						getCurrentPostId: mockGetCurrentPostId,
					};
				}
				return {};
			});

			const action = actions.saveLastInsertedBlocks([
				'client-1',
				'client-2',
			]);

			expect(action).toEqual({
				type: 'SAVE_LAST_INSERTED_BLOCKS',
				allClientIds: ['client-1', 'client-2'],
				isCurrentPostClean: true,
			});

			expect(mockGetDirtyEntityRecords).toHaveBeenCalled();
		});

		it('Should create SAVE_LAST_INSERTED_BLOCKS action with dirty post', () => {
			// Mock select to return array with current post for dirty entities
			const mockGetDirtyEntityRecords = jest
				.fn()
				.mockReturnValue([{ key: 'post-123' }]);
			const mockGetCurrentPostId = jest.fn().mockReturnValue('post-123');

			select.mockImplementation(store => {
				if (store === 'core') {
					return {
						__experimentalGetDirtyEntityRecords:
							mockGetDirtyEntityRecords,
					};
				}
				if (store === 'core/editor') {
					return {
						getCurrentPostId: mockGetCurrentPostId,
					};
				}
				return {};
			});

			const action = actions.saveLastInsertedBlocks([
				'client-1',
				'client-2',
			]);

			expect(action).toEqual({
				type: 'SAVE_LAST_INSERTED_BLOCKS',
				allClientIds: ['client-1', 'client-2'],
				isCurrentPostClean: false,
			});

			expect(mockGetDirtyEntityRecords).toHaveBeenCalled();
			expect(mockGetCurrentPostId).toHaveBeenCalled();
		});
	});
});
