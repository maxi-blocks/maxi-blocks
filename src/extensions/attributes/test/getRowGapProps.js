import getRowGapProps from '@extensions/attributes/getRowGapProps';
import { getGroupAttributes } from '@extensions/styles';

// Mock getGroupAttributes
jest.mock('@extensions/styles', () => ({
	getGroupAttributes: jest.fn(),
}));

describe('getRowGapProps', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should return only gap properties from flex attributes', () => {
		getGroupAttributes.mockReturnValue({
			'row-gap-general': '10px',
			'column-gap-general': '20px',
			'flex-direction': 'row',
			'flex-wrap': 'wrap',
		});

		const attributes = {
			'row-gap-general': '10px',
			'column-gap-general': '20px',
		};

		const result = getRowGapProps(attributes);

		expect(result).toEqual({
			'row-gap-general': '10px',
			'column-gap-general': '20px',
		});
		expect(result).not.toHaveProperty('flex-direction');
		expect(result).not.toHaveProperty('flex-wrap');

		expect(getGroupAttributes).toHaveBeenCalledWith(attributes, 'flex');
	});

	it('Should return empty object when no gap properties exist', () => {
		getGroupAttributes.mockReturnValue({
			'flex-direction': 'row',
			'flex-wrap': 'wrap',
		});

		const attributes = {
			'flex-direction': 'row',
			'flex-wrap': 'wrap',
		};

		const result = getRowGapProps(attributes);

		expect(result).toEqual({});
		expect(getGroupAttributes).toHaveBeenCalledWith(attributes, 'flex');
	});

	it('Should handle responsive gap properties', () => {
		getGroupAttributes.mockReturnValue({
			'row-gap-general': '10px',
			'row-gap-m': '8px',
			'column-gap-general': '20px',
			'column-gap-s': '15px',
			'flex-direction': 'row',
		});

		const attributes = {
			'row-gap-general': '10px',
			'row-gap-m': '8px',
			'column-gap-general': '20px',
			'column-gap-s': '15px',
		};

		const result = getRowGapProps(attributes);

		expect(result).toEqual({
			'row-gap-general': '10px',
			'row-gap-m': '8px',
			'column-gap-general': '20px',
			'column-gap-s': '15px',
		});
	});
});
