/**
 * WordPress dependencies
 */
import { create } from '@wordpress/rich-text';

/**
 * Internal dependencies
 */
import generateFormatValue from '../generateFormatValue';

jest.mock('@wordpress/rich-text', () => ({
	create: jest.fn(input => input),
}));

describe('generateFormatValue', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should handle null/undefined node', () => {
		const result = generateFormatValue(null);

		expect(create).toHaveBeenCalledWith({});
		expect(result).toEqual({});
	});

	it('Should generate format value from node with selection', () => {
		const mockRange = {};
		const mockSelection = {
			rangeCount: 1,
			getRangeAt: jest.fn(() => mockRange),
		};
		const mockNode = {
			ownerDocument: {
				defaultView: {
					getSelection: () => mockSelection,
				},
			},
		};

		const result = generateFormatValue(mockNode);

		expect(create).toHaveBeenCalledWith({
			element: mockNode,
			range: mockRange,
		});
		expect(result).toEqual({
			element: mockNode,
			range: mockRange,
		});
	});

	it('Should handle no selection range', () => {
		const mockSelection = {
			rangeCount: 0,
		};
		const mockNode = {
			ownerDocument: {
				defaultView: {
					getSelection: () => mockSelection,
				},
			},
		};

		const result = generateFormatValue(mockNode);

		const expectedFormat = {
			element: mockNode,
			range: null,
		};
		expect(create).toHaveBeenCalledWith(expectedFormat);
		expect(result).toEqual(expectedFormat);
	});
});
