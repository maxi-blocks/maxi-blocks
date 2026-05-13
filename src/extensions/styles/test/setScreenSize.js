import setScreenSize, {
	resetThrottleState,
} from '@extensions/styles/setScreenSize';
import { select, dispatch } from '@wordpress/data';
import {
	getProfileStart,
	recordProfile,
} from '@extensions/performance/profiler';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
	dispatch: jest.fn(),
}));

jest.mock('@extensions/performance/profiler', () => ({
	getProfileStart: jest.fn(() => 0),
	recordProfile: jest.fn(),
}));

describe('setScreenSize', () => {
	const mockMaxiBlocksStore = {
		receiveXXLSize: jest.fn(),
		receiveMaxiBreakpoints: jest.fn(),
	};

	const mockMaxiBlocksDispatch = {
		setMaxiDeviceType: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		resetThrottleState(); // Reset throttling state between tests
		getProfileStart.mockReturnValue(0);
		recordProfile.mockImplementation(() => {});
		select.mockImplementation(store => {
			if (store === 'maxiBlocks') return mockMaxiBlocksStore;
			return {};
		});
		dispatch.mockImplementation(store => {
			if (store === 'maxiBlocks') return mockMaxiBlocksDispatch;
			return {};
		});
	});

	it('Sets general device type without width', () => {
		setScreenSize('general');

		expect(mockMaxiBlocksDispatch.setMaxiDeviceType).toHaveBeenCalledWith({
			deviceType: 'general',
		});
	});

	it('Sets XXL size with XXL width', () => {
		const mockXXLSize = 1920;
		mockMaxiBlocksStore.receiveXXLSize.mockReturnValue(mockXXLSize);

		setScreenSize('xxl');

		expect(mockMaxiBlocksDispatch.setMaxiDeviceType).toHaveBeenCalledWith({
			deviceType: 'xxl',
			width: mockXXLSize,
		});
	});

	it('Sets device type with breakpoint width', () => {
		const mockBreakpoints = {
			xl: 1500,
			lg: 1200,
			md: 992,
			sm: 768,
			xs: 480,
		};
		mockMaxiBlocksStore.receiveMaxiBreakpoints.mockReturnValue(
			mockBreakpoints
		);

		setScreenSize('md');

		expect(mockMaxiBlocksDispatch.setMaxiDeviceType).toHaveBeenCalledWith({
			deviceType: 'md',
			width: mockBreakpoints.md,
		});
	});

	it('Uses XXL size for xxl device type', () => {
		const mockXXLSize = 2000;
		mockMaxiBlocksStore.receiveXXLSize.mockReturnValue(mockXXLSize);

		setScreenSize('xxl');

		expect(mockMaxiBlocksDispatch.setMaxiDeviceType).toHaveBeenCalledWith({
			deviceType: 'xxl',
			width: mockXXLSize,
		});
	});

	it('Sets device type when profiling throws', () => {
		getProfileStart.mockImplementationOnce(() => {
			throw new Error('profile start failed');
		});
		recordProfile.mockImplementationOnce(() => {
			throw new Error('profile record failed');
		});

		setScreenSize('general');

		expect(mockMaxiBlocksDispatch.setMaxiDeviceType).toHaveBeenCalledWith({
			deviceType: 'general',
		});
	});
});
