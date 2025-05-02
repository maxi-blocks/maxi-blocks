/**
 * Internal dependencies
 */
import getIBStylesObj from '@extensions/relations/getIBStylesObj';
import { getSelectedIBSettings } from '@extensions/relations/utils';
import { getGroupAttributes, styleCleaner } from '@extensions/styles';

jest.mock('@extensions/relations/utils', () => ({
	getSelectedIBSettings: jest.fn(),
}));

jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.fn(),
	styleCleaner: jest.fn(),
}));

describe('getIBStylesObj', () => {
	const mockClientId = 'test-client-id';
	const mockSid = 'test-sid';
	const mockAttributes = {
		'border-status': true,
		'border-width': '2',
		'border-width-unit': 'px',
		'border-color': '#000000',
		'border-radius': '10',
		'border-radius-unit': 'px',
	};
	const mockBlockAttributes = {
		blockStyle: 'default',
		'border-status': true,
		'border-width': '3',
		'border-width-unit': 'px',
		'border-color': '#ffffff',
		'border-radius': '15',
		'border-radius-unit': 'px',
	};
	const mockBreakpoint = 'general';

	beforeEach(() => {
		jest.clearAllMocks();
		styleCleaner.mockReset();
	});

	it('should return undefined when no selected settings are found', () => {
		getSelectedIBSettings.mockReturnValue(null);

		const result = getIBStylesObj({
			clientId: mockClientId,
			sid: mockSid,
			attributes: mockAttributes,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(result).toBeUndefined();
	});

	it('should use default prefix when no prefix is provided in selected settings', () => {
		const mockSelectedSettings = {
			attrGroupName: 'border',
			helper: jest.fn().mockReturnValue({ color: '#000000' }),
		};

		getSelectedIBSettings.mockReturnValue(mockSelectedSettings);
		getGroupAttributes.mockReturnValue(mockAttributes);
		styleCleaner.mockReturnValue({
			target: { result: { color: '#000000' } },
		});

		getIBStylesObj({
			clientId: mockClientId,
			sid: mockSid,
			attributes: mockAttributes,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(getGroupAttributes).toHaveBeenCalledWith(
			mockAttributes,
			'border',
			false,
			''
		);
	});

	it('should use prefix from selected settings when provided', () => {
		const mockPrefix = 'test-prefix-';
		const mockSelectedSettings = {
			prefix: mockPrefix,
			attrGroupName: 'border',
			helper: jest.fn().mockReturnValue({ color: '#000000' }),
		};

		getSelectedIBSettings.mockReturnValue(mockSelectedSettings);
		getGroupAttributes.mockReturnValue(mockAttributes);
		styleCleaner.mockReturnValue({
			target: { result: { color: '#000000' } },
		});

		getIBStylesObj({
			clientId: mockClientId,
			sid: mockSid,
			attributes: mockAttributes,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(getGroupAttributes).toHaveBeenCalledWith(
			mockAttributes,
			'border',
			false,
			mockPrefix
		);
	});

	it('should call helper function with correct parameters', () => {
		const mockHelper = jest.fn().mockReturnValue({ color: '#000000' });
		const mockSelectedSettings = {
			attrGroupName: 'border',
			helper: mockHelper,
			target: 'test-target',
		};

		getSelectedIBSettings.mockReturnValue(mockSelectedSettings);
		getGroupAttributes.mockReturnValue(mockAttributes);
		styleCleaner.mockReturnValue({
			target: { result: { color: '#000000' } },
		});

		getIBStylesObj({
			clientId: mockClientId,
			sid: mockSid,
			attributes: mockAttributes,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(mockHelper).toHaveBeenCalledWith({
			obj: mockAttributes,
			isIB: true,
			prefix: '',
			blockStyle: mockBlockAttributes.blockStyle,
			breakpoint: mockBreakpoint,
			blockAttributes: {
				...mockBlockAttributes,
				...mockAttributes,
			},
			target: 'test-target',
			clientId: mockClientId,
		});
	});

	it('should call styleCleaner with correct parameters', () => {
		const mockHelperResult = { color: '#000000' };
		const mockSelectedSettings = {
			attrGroupName: 'border',
			helper: jest.fn().mockReturnValue(mockHelperResult),
		};

		getSelectedIBSettings.mockReturnValue(mockSelectedSettings);
		getGroupAttributes.mockReturnValue(mockAttributes);
		styleCleaner.mockReturnValue({
			target: { result: { color: '#000000' } },
		});

		getIBStylesObj({
			clientId: mockClientId,
			sid: mockSid,
			attributes: mockAttributes,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(styleCleaner).toHaveBeenCalledWith({
			target: {
				result: mockHelperResult,
			},
		});
	});

	it('should return the cleaned styles from styleCleaner', () => {
		const mockCleanedStyles = { color: '#000000', width: '2px' };
		const mockSelectedSettings = {
			attrGroupName: 'border',
			helper: jest
				.fn()
				.mockReturnValue({ color: '#000000', width: '2px' }),
		};

		getSelectedIBSettings.mockReturnValue(mockSelectedSettings);
		getGroupAttributes.mockReturnValue(mockAttributes);
		styleCleaner.mockReturnValue({ target: { result: mockCleanedStyles } });

		const result = getIBStylesObj({
			clientId: mockClientId,
			sid: mockSid,
			attributes: mockAttributes,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(result).toEqual(mockCleanedStyles);
	});

	it('should handle undefined result from styleCleaner', () => {
		const mockSelectedSettings = {
			attrGroupName: 'border',
			helper: jest.fn().mockReturnValue({ color: '#000000' }),
		};

		getSelectedIBSettings.mockReturnValue(mockSelectedSettings);
		getGroupAttributes.mockReturnValue(mockAttributes);
		styleCleaner.mockReturnValue(undefined);

		const result = getIBStylesObj({
			clientId: mockClientId,
			sid: mockSid,
			attributes: mockAttributes,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(result).toBeUndefined();
	});

	it('should handle undefined target from styleCleaner', () => {
		const mockSelectedSettings = {
			attrGroupName: 'border',
			helper: jest.fn().mockReturnValue({ color: '#000000' }),
		};

		getSelectedIBSettings.mockReturnValue(mockSelectedSettings);
		getGroupAttributes.mockReturnValue(mockAttributes);
		styleCleaner.mockReturnValue({});

		const result = getIBStylesObj({
			clientId: mockClientId,
			sid: mockSid,
			attributes: mockAttributes,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(result).toBeUndefined();
	});

	it('should handle undefined result from styleCleaner target', () => {
		const mockSelectedSettings = {
			attrGroupName: 'border',
			helper: jest.fn().mockReturnValue({ color: '#000000' }),
		};

		getSelectedIBSettings.mockReturnValue(mockSelectedSettings);
		getGroupAttributes.mockReturnValue(mockAttributes);
		styleCleaner.mockReturnValue({ target: {} });

		const result = getIBStylesObj({
			clientId: mockClientId,
			sid: mockSid,
			attributes: mockAttributes,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(result).toBeUndefined();
	});
});
