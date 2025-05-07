/**
 * Internal dependencies
 */
import { getSelectedIBSettings } from '@extensions/relations/utils';
import getIBOptionsFromBlockData from '@extensions/relations/getIBOptionsFromBlockData';

jest.mock('@extensions/relations/getIBOptionsFromBlockData', () => jest.fn());

describe('getSelectedIBSettings', () => {
	const mockClientId = 'test-client-id';
	const mockValue = 'test-value';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return undefined when no matching option is found', () => {
		getIBOptionsFromBlockData.mockReturnValue({
			group1: [{ sid: 'other-value' }],
			group2: [{ sid: 'another-value' }],
		});

		const result = getSelectedIBSettings(mockClientId, mockValue);
		expect(result).toBeUndefined();
	});

	it('should find and return the matching option from nested groups', () => {
		const expectedOption = { sid: 'test-value', label: 'Test Option' };
		getIBOptionsFromBlockData.mockReturnValue({
			group1: [{ sid: 'other-value' }],
			group2: [expectedOption],
		});

		const result = getSelectedIBSettings(mockClientId, mockValue);
		expect(result).toEqual(expectedOption);
	});

	it('should handle empty options object', () => {
		getIBOptionsFromBlockData.mockReturnValue({});

		const result = getSelectedIBSettings(mockClientId, mockValue);
		expect(result).toBeUndefined();
	});

	it('should handle options with empty arrays', () => {
		getIBOptionsFromBlockData.mockReturnValue({
			group1: [],
			group2: [],
		});

		const result = getSelectedIBSettings(mockClientId, mockValue);
		expect(result).toBeUndefined();
	});

	it('should find the first matching option when multiple matches exist', () => {
		const firstMatch = { sid: 'test-value', label: 'First Match' };
		const secondMatch = { sid: 'test-value', label: 'Second Match' };
		getIBOptionsFromBlockData.mockReturnValue({
			group1: [firstMatch],
			group2: [secondMatch],
		});

		const result = getSelectedIBSettings(mockClientId, mockValue);
		expect(result).toEqual(firstMatch);
	});
});
