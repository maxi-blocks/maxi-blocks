import { RelationCleanupManager } from '@extensions/maxi-block/relationCleanupManager';

const waitForIdle = async manager => {
	for (let i = 0; i < 25; i++) {
		if (!manager.isProcessing && manager.cleanupQueue.length === 0) {
			return;
		}
		await new Promise(resolve => {
			setTimeout(resolve, 0);
		});
	}

	throw new Error('Timed out waiting for cleanup manager to idle.');
};

describe('RelationCleanupManager', () => {
	it('schedules cleanup and releases instance references', async () => {
		const manager = new RelationCleanupManager();
		const relationSubscriber = jest.fn();
		const element = {
			removeEventListener: jest.fn(),
			cloneNode: jest.fn(() => ({})),
			parentNode: {
				replaceChild: jest.fn(),
			},
		};
		const instance = {
			element,
			relationSubscriber,
			observer: {
				disconnect: jest.fn(),
				unobserve: jest.fn(),
			},
			handlers: [],
		};

		manager.scheduleInstanceCleanup(instance, 0);
		await waitForIdle(manager);

		expect(relationSubscriber).toHaveBeenCalledTimes(1);
		expect(instance.element).toBeNull();
		expect(instance.observer).toBeNull();
		expect(instance.relationSubscriber).toBeNull();
		expect(manager.cleanupQueue).toHaveLength(0);
		expect(manager.isProcessing).toBe(false);
	});

	it('drains queued tasks even when a cleanup throws', async () => {
		const manager = new RelationCleanupManager();
		const instanceA = {};
		const instanceB = {};

		manager.performSingleInstanceCleanup = jest
			.fn()
			.mockRejectedValueOnce(new Error('Boom'))
			.mockResolvedValueOnce();

		manager.scheduleInstanceCleanup(instanceA, 0);
		manager.scheduleInstanceCleanup(instanceB, 1);
		await waitForIdle(manager);

		expect(manager.cleanupQueue).toHaveLength(0);
		expect(manager.isProcessing).toBe(false);
		expect(manager.stats.totalCleanups).toBe(2);
		expect(manager.stats.failedCleanups).toBe(1);
	});
});
