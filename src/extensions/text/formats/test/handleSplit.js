import handleSplit from '../handleSplit';
import { createBlock } from '@wordpress/blocks';

jest.mock('@wordpress/blocks', () => ({
	createBlock: jest.fn((name, attrs) => ({ blockName: name, ...attrs })),
}));

describe('handleSplit', () => {
	beforeEach(() => {
		createBlock.mockClear();
	});

	it('Returns block with original attributes when isOriginal is true', () => {
		const value = 'test content';
		const attributes = {
			content: 'original content',
			uniqueID: 'test-id',
			someOtherAttr: 'value',
		};
		const clientId = 'test-client-id';
		const blockName = 'core/test-block';

		const result = handleSplit(
			value,
			true,
			attributes,
			clientId,
			blockName
		);

		expect(result).toEqual({
			blockName: 'core/test-block',
			content: 'test content',
			uniqueID: 'test-id',
			someOtherAttr: 'value',
			clientId: 'test-client-id',
		});
	});

	it('Returns block with modified attributes when isOriginal is false', () => {
		const value = 'test content';
		const attributes = {
			content: 'original content',
			uniqueID: 'test-id',
			someOtherAttr: 'value',
		};
		const clientId = 'test-client-id';
		const blockName = 'core/test-block';

		const result = handleSplit(
			value,
			false,
			attributes,
			clientId,
			blockName
		);

		expect(result).toEqual({
			blockName: 'core/test-block',
			content: 'test content',
			uniqueID: null,
			someOtherAttr: 'value',
		});
	});

	it('Returns block with undefined attributes when value is empty and isOriginal is false', () => {
		const value = '';
		const attributes = {
			content: 'original content',
			uniqueID: 'test-id',
			someOtherAttr: 'value',
		};
		const clientId = 'test-client-id';
		const blockName = 'core/test-block';

		const result = handleSplit(
			value,
			false,
			attributes,
			clientId,
			blockName
		);

		expect(result).toEqual({
			blockName: 'core/test-block',
		});
	});
});
