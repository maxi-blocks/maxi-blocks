import enableRepeater from '../enableRepeater';
import { validateRowColumnsStructure } from '@extensions/repeater';

jest.mock('@extensions/repeater', () => ({
	validateRowColumnsStructure: jest.fn(),
}));

jest.mock('@extensions/styles', () => ({
	getAttributeKey: jest.fn(target => target),
}));

describe('enableRepeater', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('refreshes inner block positions after validation before enabling repeater', async () => {
		const initialPositions = {
			'-1': ['column-1', 'column-2'],
			0: ['text-1'],
			1: ['image-1'],
		};
		const refreshedPositions = {
			'-1': ['column-1', 'column-2'],
			0: ['text-1', 'text-2'],
			1: ['image-1', 'image-2'],
		};
		const updateInnerBlocksPositions = jest
			.fn()
			.mockReturnValueOnce(initialPositions)
			.mockReturnValueOnce(refreshedPositions);
		const requestStructureConfirmation = jest.fn();
		const markNextChangeAsNotPersistent = jest.fn();
		const onChange = jest.fn();

		validateRowColumnsStructure.mockResolvedValue(true);

		const result = await enableRepeater({
			clientId: 'row',
			updateInnerBlocksPositions,
			requestStructureConfirmation,
			markNextChangeAsNotPersistent,
			onChange,
		});

		expect(result).toBe(true);
		expect(validateRowColumnsStructure).toHaveBeenCalledWith(
			'row',
			initialPositions,
			requestStructureConfirmation,
			undefined,
			true,
			true
		);
		expect(updateInnerBlocksPositions).toHaveBeenCalledTimes(2);
		expect(updateInnerBlocksPositions.mock.invocationCallOrder[1]).toBeLessThan(
			markNextChangeAsNotPersistent.mock.invocationCallOrder[0]
		);
		expect(onChange).toHaveBeenCalledWith({
			'repeater-status': true,
		});
	});

	it('does not refresh positions or enable repeater when validation is rejected', async () => {
		const updateInnerBlocksPositions = jest
			.fn()
			.mockReturnValue({ '-1': ['column-1', 'column-2'] });
		const markNextChangeAsNotPersistent = jest.fn();
		const onChange = jest.fn();

		validateRowColumnsStructure.mockResolvedValue(false);

		const result = await enableRepeater({
			clientId: 'row',
			updateInnerBlocksPositions,
			requestStructureConfirmation: jest.fn(),
			markNextChangeAsNotPersistent,
			onChange,
		});

		expect(result).toBe(false);
		expect(updateInnerBlocksPositions).toHaveBeenCalledTimes(1);
		expect(markNextChangeAsNotPersistent).not.toHaveBeenCalled();
		expect(onChange).not.toHaveBeenCalled();
	});
});
