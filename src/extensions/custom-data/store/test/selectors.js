import {
	getPostCustomData,
	getStoreCustomData,
} from '@extensions/custom-data/store/selectors';
import {
	clearPendingCustomData,
	queuePendingCustomData,
} from '@extensions/custom-data/store/pendingCustomData';

describe('customData selectors', () => {
	afterEach(() => {
		clearPendingCustomData();
	});

	it('merges pending custom data into getPostCustomData', () => {
		queuePendingCustomData({
			blockB: {
				relations: [{ id: 'rel-2' }],
			},
		});

		expect(
			getPostCustomData({
				customData: {
					blockA: {
						bg_video: true,
					},
				},
			})
		).toEqual({
			blockA: {
				bg_video: true,
			},
			blockB: {
				relations: [{ id: 'rel-2' }],
			},
		});
	});

	it('returns raw store custom data without pending entries', () => {
		queuePendingCustomData({
			blockB: {
				relations: [{ id: 'rel-2' }],
			},
		});

		expect(
			getStoreCustomData({
				customData: {
					blockA: {
						bg_video: true,
					},
				},
			})
		).toEqual({
			blockA: {
				bg_video: true,
			},
		});
	});
});
