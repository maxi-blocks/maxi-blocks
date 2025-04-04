import handleOnReset from '@extensions/attributes/handleOnReset';
import { select } from '@wordpress/data';
import { getDefaultAttribute } from '@extensions/styles';

// Mock dependencies
jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

jest.mock('@extensions/styles', () => ({
	getDefaultAttribute: jest.fn(),
}));

describe('handleOnReset', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should return original props if not in general breakpoint', () => {
		const mockSelect = {
			receiveMaxiDeviceType: jest.fn().mockReturnValue('m'),
			receiveBaseBreakpoint: jest.fn(),
		};
		select.mockReturnValue(mockSelect);

		const props = {
			'font-size-general': '16px',
			'font-size-m': '14px',
		};

		const result = handleOnReset(props);

		expect(result).toEqual(props);
		expect(mockSelect.receiveMaxiDeviceType).toHaveBeenCalled();
		expect(mockSelect.receiveBaseBreakpoint).not.toHaveBeenCalled();
	});

	it('Should reset base breakpoint attributes when in general breakpoint', () => {
		const mockSelect = {
			receiveMaxiDeviceType: jest.fn().mockReturnValue('general'),
			receiveBaseBreakpoint: jest.fn().mockReturnValue('xl'),
		};
		select.mockReturnValue(mockSelect);

		getDefaultAttribute.mockImplementation(attr => {
			if (attr === 'font-size-xl') return '20px';
			if (attr === 'color-xl') return '#000000';
			return null;
		});

		const props = {
			'font-size-general': '16px',
			'color-general': '#FF0000',
			padding: '10px',
		};

		const result = handleOnReset(props);

		expect(result).toEqual({
			'font-size-general': '16px',
			'font-size-xl': '20px',
			'color-general': '#FF0000',
			'color-xl': '#000000',
			padding: '10px',
		});

		expect(mockSelect.receiveMaxiDeviceType).toHaveBeenCalled();
		expect(mockSelect.receiveBaseBreakpoint).toHaveBeenCalled();
		expect(getDefaultAttribute).toHaveBeenCalledWith('font-size-xl');
		expect(getDefaultAttribute).toHaveBeenCalledWith('color-xl');
	});

	it('Should handle empty props object', () => {
		const mockSelect = {
			receiveMaxiDeviceType: jest.fn(() => 'general'),
			receiveBaseBreakpoint: jest.fn(() => 'xl'),
		};
		select.mockReturnValue(mockSelect);

		const result = handleOnReset({});

		expect(result).toEqual({});
		expect(mockSelect.receiveMaxiDeviceType).toHaveBeenCalled();
		expect(mockSelect.receiveBaseBreakpoint).toHaveBeenCalled();
	});

	it('Should handle props without general breakpoint attributes', () => {
		const mockSelect = {
			receiveMaxiDeviceType: jest.fn(() => 'general'),
			receiveBaseBreakpoint: jest.fn(() => 'xl'),
		};
		select.mockReturnValue(mockSelect);

		const props = {
			padding: '10px',
			margin: '5px',
		};

		const result = handleOnReset(props);

		expect(result).toEqual(props);
		expect(mockSelect.receiveMaxiDeviceType).toHaveBeenCalled();
		expect(mockSelect.receiveBaseBreakpoint).toHaveBeenCalled();
	});
});
