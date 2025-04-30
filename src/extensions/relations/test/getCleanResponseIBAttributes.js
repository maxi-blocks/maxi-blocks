/**
 * Internal dependencies
 */
import getCleanResponseIBAttributes from '@extensions/relations/getCleanResponseIBAttributes';
import { getClientIdFromUniqueId } from '@extensions/attributes';
import { handleSetAttributes } from '@extensions/maxi-block';
import { getBreakpointFromAttribute } from '@extensions/styles/utils';
import getRelatedAttributes from '@extensions/relations/getRelatedAttributes';
import getTempAttributes from '@extensions/relations/getTempAttributes';

jest.mock('@extensions/attributes', () => ({
	getClientIdFromUniqueId: jest.fn(),
}));

jest.mock('@extensions/maxi-block', () => ({
	handleSetAttributes: jest.fn(),
}));

jest.mock('@extensions/styles/utils', () => ({
	getBreakpointFromAttribute: jest.fn(),
}));

jest.mock('@extensions/relations/getRelatedAttributes', () => jest.fn());

jest.mock('@extensions/relations/getTempAttributes', () => jest.fn());

describe('getCleanResponseIBAttributes', () => {
	const mockUniqueID = 'test-unique-id';
	const mockBlockTriggerClientId = 'trigger-client-id';
	const mockClientId = 'test-client-id';
	const mockPrefix = 'test-';
	const mockSid = 'test';
	const mockBreakpoint = 'general';

	beforeEach(() => {
		jest.clearAllMocks();

		getClientIdFromUniqueId.mockReturnValue(mockClientId);
		handleSetAttributes.mockImplementation(({ obj }) => obj);
		getRelatedAttributes.mockImplementation(
			({ IBAttributes }) => IBAttributes
		);
		getTempAttributes.mockReturnValue({});
	});

	it('should correctly process attributes with default settings', () => {
		const newAttributesObj = {
			'test-width': '100',
			'test-height': '200',
		};
		const blockAttributes = {
			uniqueID: mockUniqueID,
			'test-width': '90',
			'test-height': '180',
		};
		const selectedSettingsObj = {
			relatedAttributes: [],
		};

		const result = getCleanResponseIBAttributes(
			newAttributesObj,
			blockAttributes,
			mockUniqueID,
			selectedSettingsObj,
			mockBreakpoint,
			mockPrefix,
			mockSid,
			mockBlockTriggerClientId
		);

		expect(getClientIdFromUniqueId).toHaveBeenCalledWith(mockUniqueID);
		expect(handleSetAttributes).toHaveBeenCalledWith({
			obj: newAttributesObj,
			attributes: blockAttributes,
			clientId: mockClientId,
			targetClientId: mockBlockTriggerClientId,
			onChange: expect.any(Function),
			allowXXLOverGeneral: true,
		});
		expect(getRelatedAttributes).toHaveBeenCalledWith({
			IBAttributes: newAttributesObj,
			props: blockAttributes,
			relatedAttributes: [],
			sid: mockSid,
		});
		expect(getTempAttributes).toHaveBeenCalledWith(
			selectedSettingsObj,
			newAttributesObj,
			blockAttributes,
			mockBreakpoint,
			mockPrefix,
			mockSid
		);
		expect(result).toEqual({
			cleanAttributesObject: newAttributesObj,
			tempAttributes: {},
		});
	});

	it('should handle relatedAttributes from selectedSettingsObj', () => {
		const newAttributesObj = {
			'test-width': '100',
			'test-height': '200',
		};
		const blockAttributes = {
			uniqueID: mockUniqueID,
			'test-width': '90',
			'test-height': '180',
		};
		const selectedSettingsObj = {
			relatedAttributes: ['test-padding', 'test-margin'],
		};

		getCleanResponseIBAttributes(
			newAttributesObj,
			blockAttributes,
			mockUniqueID,
			selectedSettingsObj,
			mockBreakpoint,
			mockPrefix,
			mockSid,
			mockBlockTriggerClientId
		);

		expect(getRelatedAttributes).toHaveBeenCalledWith({
			IBAttributes: newAttributesObj,
			props: blockAttributes,
			relatedAttributes: ['test-padding', 'test-margin'],
			sid: mockSid,
		});
	});

	it('should handle undefined attributes correctly', () => {
		const newAttributesObj = {
			'test-width': '100',
			'test-height-xxl': undefined,
		};
		const blockAttributes = {
			uniqueID: mockUniqueID,
			'test-width': '90',
			'test-height-xxl': '180',
		};
		const selectedSettingsObj = {
			relatedAttributes: [],
		};

		getBreakpointFromAttribute
			.mockReturnValueOnce('general') // for test-width
			.mockReturnValueOnce('xxl'); // for test-height-xxl

		// Simulate getRelatedAttributes returning attributes with undefined
		getRelatedAttributes.mockReturnValue({
			'test-width': '100',
			'test-height-xxl': undefined,
		});

		const result = getCleanResponseIBAttributes(
			newAttributesObj,
			blockAttributes,
			mockUniqueID,
			selectedSettingsObj,
			mockBreakpoint,
			mockPrefix,
			mockSid,
			mockBlockTriggerClientId
		);

		expect(getBreakpointFromAttribute).toHaveBeenCalledWith(
			'test-height-xxl'
		);
		expect(result.cleanAttributesObject).toEqual({
			'test-width': '100',
			'test-height-xxl': undefined,
		});
	});

	it('should restore original values for undefined attributes with non-general breakpoints', () => {
		const newAttributesObj = {
			'test-width': '100',
			'test-height-xxl': '180',
		};
		const blockAttributes = {
			uniqueID: mockUniqueID,
			'test-width': '90',
			'test-height-xxl': '170',
		};
		const selectedSettingsObj = {
			relatedAttributes: [],
		};

		// Simulate getRelatedAttributes returning attributes with undefined
		getRelatedAttributes.mockReturnValue({
			'test-width': '100',
			'test-height-xxl': undefined,
		});

		getBreakpointFromAttribute
			.mockReturnValueOnce('general') // for test-width
			.mockReturnValueOnce('xxl'); // for test-height-xxl

		const result = getCleanResponseIBAttributes(
			newAttributesObj,
			blockAttributes,
			mockUniqueID,
			selectedSettingsObj,
			mockBreakpoint,
			mockPrefix,
			mockSid,
			mockBlockTriggerClientId
		);

		expect(result.cleanAttributesObject).toEqual({
			'test-width': '100',
			'test-height-xxl': '180', // Should be restored from newAttributesObj
		});
	});

	it('should include temp attributes from getTempAttributes', () => {
		const newAttributesObj = {
			'test-width': '100',
		};
		const blockAttributes = {
			uniqueID: mockUniqueID,
			'test-width': '90',
		};
		const selectedSettingsObj = {
			relatedAttributes: [],
		};
		const mockTempAttributes = {
			'test-color': 'red',
			'test-border': '1 solid black',
		};

		getTempAttributes.mockReturnValue(mockTempAttributes);

		const result = getCleanResponseIBAttributes(
			newAttributesObj,
			blockAttributes,
			mockUniqueID,
			selectedSettingsObj,
			mockBreakpoint,
			mockPrefix,
			mockSid,
			mockBlockTriggerClientId
		);

		expect(result).toEqual({
			cleanAttributesObject: newAttributesObj,
			tempAttributes: mockTempAttributes,
		});
	});

	it('should handle onChange callback in handleSetAttributes', () => {
		const newAttributesObj = {
			'test-width': '100',
		};
		const blockAttributes = {
			uniqueID: mockUniqueID,
			'test-width': '90',
		};
		const selectedSettingsObj = {
			relatedAttributes: [],
		};

		handleSetAttributes.mockImplementation(({ onChange }) => {
			const response = { 'test-width': '110' };
			return onChange(response);
		});

		getCleanResponseIBAttributes(
			newAttributesObj,
			blockAttributes,
			mockUniqueID,
			selectedSettingsObj,
			mockBreakpoint,
			mockPrefix,
			mockSid,
			mockBlockTriggerClientId
		);

		expect(handleSetAttributes).toHaveBeenCalledWith({
			obj: newAttributesObj,
			attributes: blockAttributes,
			clientId: mockClientId,
			targetClientId: mockBlockTriggerClientId,
			onChange: expect.any(Function),
			allowXXLOverGeneral: true,
		});
	});
});
