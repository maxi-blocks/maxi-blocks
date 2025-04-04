import uniqueCustomLabelGenerator from '@extensions/attributes/uniqueCustomLabelGenerator';
import getIsUniqueCustomLabelRepeated from '@extensions/maxi-block/getIsUniqueCustomLabelRepeated';

// Mock getIsUniqueCustomLabelRepeated
jest.mock('@extensions/maxi-block/getIsUniqueCustomLabelRepeated', () =>
	jest.fn()
);

describe('uniqueCustomLabelGenerator', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should return original label if not repeated', () => {
		getIsUniqueCustomLabelRepeated.mockReturnValue(false);

		const result = uniqueCustomLabelGenerator('my-label', 'unique-123');

		expect(result).toBe('my-label_1');
		expect(getIsUniqueCustomLabelRepeated).toHaveBeenCalledWith(
			'my-label_1',
			'unique-123',
			0
		);
	});

	it('Should increment suffix until unique label is found', () => {
		getIsUniqueCustomLabelRepeated
			.mockReturnValueOnce(true) // my-label_1 is repeated
			.mockReturnValueOnce(true) // my-label_2 is repeated
			.mockReturnValueOnce(false); // my-label_3 is not repeated

		const result = uniqueCustomLabelGenerator('my-label', 'unique-123');

		expect(result).toBe('my-label_3');
		expect(getIsUniqueCustomLabelRepeated).toHaveBeenCalledTimes(3);
		expect(getIsUniqueCustomLabelRepeated).toHaveBeenNthCalledWith(
			1,
			'my-label_1',
			'unique-123',
			0
		);
		expect(getIsUniqueCustomLabelRepeated).toHaveBeenNthCalledWith(
			2,
			'my-label_2',
			'unique-123',
			0
		);
		expect(getIsUniqueCustomLabelRepeated).toHaveBeenNthCalledWith(
			3,
			'my-label_3',
			'unique-123',
			0
		);
	});

	it('Should handle empty custom label', () => {
		getIsUniqueCustomLabelRepeated.mockReturnValue(false);

		const result = uniqueCustomLabelGenerator('', 'unique-123');

		expect(result).toBe('_1');
		expect(getIsUniqueCustomLabelRepeated).toHaveBeenCalledWith(
			'_1',
			'unique-123',
			0
		);
	});

	it('Should handle custom diff value', () => {
		getIsUniqueCustomLabelRepeated.mockReturnValue(false);

		const result = uniqueCustomLabelGenerator('my-label', 'unique-123', 5);

		expect(result).toBe('my-label_5');
		expect(getIsUniqueCustomLabelRepeated).toHaveBeenCalledWith(
			'my-label_5',
			'unique-123',
			0
		);
	});
});
