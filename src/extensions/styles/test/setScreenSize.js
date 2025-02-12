import setScreenSize from '../setScreenSize';
import { select, dispatch } from '@wordpress/data';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
	dispatch: jest.fn(),
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
			changeSize: true,
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
			changeSize: true,
		});
	});

	it('Respects changeSize parameter when false', () => {
		const mockBreakpoints = { sm: 768 };
		mockMaxiBlocksStore.receiveMaxiBreakpoints.mockReturnValue(
			mockBreakpoints
		);

		setScreenSize('sm', false);

		expect(mockMaxiBlocksDispatch.setMaxiDeviceType).toHaveBeenCalledWith({
			deviceType: 'sm',
			width: mockBreakpoints.sm,
			changeSize: false,
		});
	});

	it('Uses XXL size for xxl device type', () => {
		const mockXXLSize = 2000;
		mockMaxiBlocksStore.receiveXXLSize.mockReturnValue(mockXXLSize);

		setScreenSize('xxl', false);

		expect(mockMaxiBlocksDispatch.setMaxiDeviceType).toHaveBeenCalledWith({
			deviceType: 'xxl',
			width: mockXXLSize,
			changeSize: false,
		});
	});
});
