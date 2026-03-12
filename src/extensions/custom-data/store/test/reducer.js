jest.mock('@extensions/custom-data/store/controls', () => ({
	__esModule: true,
	default: {
		SAVE_CUSTOM_DATA: jest.fn(),
	},
}));

import reducer from '@extensions/custom-data/store/reducer';

describe('customData store reducer', () => {
	it('returns the same state for unchanged custom data updates', () => {
		const state = {
			customData: {
				blockA: {
					relations: [{ id: 'rel-1' }],
				},
			},
			isUpdate: null,
		};
		const action = {
			type: 'UPDATE_CUSTOM_DATA',
			customData: {
				blockA: {
					relations: [{ id: 'rel-1' }],
				},
			},
		};

		const nextState = reducer(state, action);

		expect(nextState).toBe(state);
	});

	it('removes custom data immutably', () => {
		const state = {
			customData: {
				blockA: { relations: [{ id: 'rel-1' }] },
				blockB: { bg_video: true },
			},
			isUpdate: null,
		};

		const nextState = reducer(state, {
			type: 'REMOVE_CUSTOM_DATA',
			target: 'blockA',
		});

		expect(nextState).not.toBe(state);
		expect(nextState.customData).toEqual({
			blockB: { bg_video: true },
		});
		expect(state.customData).toEqual({
			blockA: { relations: [{ id: 'rel-1' }] },
			blockB: { bg_video: true },
		});
	});
});
