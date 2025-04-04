import uniqueIDGenerator from '@extensions/attributes/uniqueIDGenerator';
import { v4 as uuidv4 } from 'uuid';

// Mock uuid
jest.mock('uuid', () => ({
	v4: jest.fn(),
}));

describe('uniqueIDGenerator', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should generate ID with correct format for maxi block', () => {
		uuidv4.mockReturnValue('12345678-1234-1234-1234-123456789abc');

		const result = uniqueIDGenerator({
			blockName: 'maxi-blocks/text-maxi',
		});

		expect(result).toBe('text-maxi-12345678-u');
		expect(uuidv4).toHaveBeenCalledTimes(1);
	});

	it('Should generate ID with correct format for another block type', () => {
		uuidv4.mockReturnValue('abcdef12-1234-1234-1234-123456789abc');

		const result = uniqueIDGenerator({
			blockName: 'maxi-blocks/button-maxi',
		});

		expect(result).toBe('button-maxi-abcdef12-u');
		expect(uuidv4).toHaveBeenCalledTimes(1);
	});

	it('Should handle non-maxi block names', () => {
		uuidv4.mockReturnValue('87654321-1234-1234-1234-123456789abc');

		const result = uniqueIDGenerator({ blockName: 'custom-block' });

		expect(result).toBe('custom-block-87654321-u');
		expect(uuidv4).toHaveBeenCalledTimes(1);
	});

	it('Should generate unique IDs for same block type', () => {
		uuidv4
			.mockReturnValueOnce('11111111-1234-1234-1234-123456789abc')
			.mockReturnValueOnce('22222222-1234-1234-1234-123456789abc');

		const result1 = uniqueIDGenerator({
			blockName: 'maxi-blocks/text-maxi',
		});
		const result2 = uniqueIDGenerator({
			blockName: 'maxi-blocks/text-maxi',
		});

		expect(result1).toBe('text-maxi-11111111-u');
		expect(result2).toBe('text-maxi-22222222-u');
		expect(result1).not.toBe(result2);
		expect(uuidv4).toHaveBeenCalledTimes(2);
	});
});
