import entityRecordsWrapper from '@extensions/styles/entityRecordsWrapper';
import { select } from '@wordpress/data';
import { getIsSiteEditor } from '@extensions/fse';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));
jest.mock('@extensions/fse', () => ({
	getIsSiteEditor: jest.fn(),
}));

describe('entityRecordsWrapper', () => {
	const mockCoreStore = {
		__experimentalGetDirtyEntityRecords: jest.fn(),
	};

	const mockEditorStore = {
		getCurrentPostType: jest.fn(),
		getCurrentPostId: jest.fn(),
	};

	const mockEditSiteStore = {
		getEditedPostType: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		select.mockImplementation(store => {
			if (store === 'core') return mockCoreStore;
			if (store === 'core/editor') return mockEditorStore;
			if (store === 'core/edit-site') return mockEditSiteStore;
			return {};
		});
	});

	it('Executes callback for each dirty entity record', () => {
		const mockCallback = jest.fn();
		const mockDirtyRecords = [
			{ key: 'record1', name: 'post' },
			{ key: 'record2', name: 'page' },
		];

		mockCoreStore.__experimentalGetDirtyEntityRecords.mockReturnValue(
			mockDirtyRecords
		);

		entityRecordsWrapper(mockCallback);

		expect(mockCallback).toHaveBeenCalledTimes(2);
		expect(mockCallback).toHaveBeenCalledWith(
			mockDirtyRecords[0],
			0,
			mockDirtyRecords
		);
		expect(mockCallback).toHaveBeenCalledWith(
			mockDirtyRecords[1],
			1,
			mockDirtyRecords
		);
	});

	it('Does not execute callback when no dirty records exist', () => {
		const mockCallback = jest.fn();
		mockCoreStore.__experimentalGetDirtyEntityRecords.mockReturnValue([]);

		entityRecordsWrapper(mockCallback);

		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('Adds current entity when addClearEntity is true in site editor', () => {
		const mockCallback = jest.fn();
		const mockDirtyRecords = [];

		mockCoreStore.__experimentalGetDirtyEntityRecords.mockReturnValue(
			mockDirtyRecords
		);
		mockEditorStore.getCurrentPostId.mockReturnValue('123');
		getIsSiteEditor.mockReturnValue(true);
		mockEditSiteStore.getEditedPostType.mockReturnValue('wp_template');

		entityRecordsWrapper(mockCallback, true);

		expect(mockCallback).toHaveBeenCalledWith({
			key: '123',
			name: 'wp_template',
		});
	});

	it('Adds current entity when addClearEntity is true in post editor', () => {
		const mockCallback = jest.fn();
		const mockDirtyRecords = [];

		mockCoreStore.__experimentalGetDirtyEntityRecords.mockReturnValue(
			mockDirtyRecords
		);
		mockEditorStore.getCurrentPostId.mockReturnValue('123');
		getIsSiteEditor.mockReturnValue(false);
		mockEditorStore.getCurrentPostType.mockReturnValue('post');

		entityRecordsWrapper(mockCallback, true);

		expect(mockCallback).toHaveBeenCalledWith({
			key: '123',
			name: 'post',
		});
	});

	it('Handles both dirty records and current entity', () => {
		const mockCallback = jest.fn();
		const mockDirtyRecords = [{ key: 'record1', name: 'post' }];

		mockCoreStore.__experimentalGetDirtyEntityRecords.mockReturnValue(
			mockDirtyRecords
		);
		mockEditorStore.getCurrentPostId.mockReturnValue('123');
		getIsSiteEditor.mockReturnValue(false);
		mockEditorStore.getCurrentPostType.mockReturnValue('page');

		entityRecordsWrapper(mockCallback, true);

		expect(mockCallback).toHaveBeenCalledTimes(2);
		expect(mockCallback).toHaveBeenCalledWith(
			mockDirtyRecords[0],
			0,
			mockDirtyRecords
		);
		expect(mockCallback).toHaveBeenCalledWith({
			key: '123',
			name: 'page',
		});
	});
});
