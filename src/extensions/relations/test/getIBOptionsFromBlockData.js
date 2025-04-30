import { select } from '@wordpress/data';
import getIBOptionsFromBlockData from '@extensions/relations/getIBOptionsFromBlockData';
import { getBlockData } from '@extensions/attributes';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(() => ({
		getBlock: jest.fn(),
	})),
}));
jest.mock('@extensions/attributes', () => ({
	getBlockData: jest.fn(),
}));

describe('getIBOptionsFromBlockData', () => {
	it('Should return the IB options', () => {
		const blockName = 'maxi-blocks/test';
		const block = {
			name: blockName,
		};
		const blockData = {
			interactionBuilderSettings: {
				enabled: true,
			},
		};
		select.mockReturnValue({
			getBlock: jest.fn(() => block),
		});
		getBlockData.mockReturnValue(blockData);
		const ibOptions = getIBOptionsFromBlockData(blockName);

		expect(ibOptions).toEqual({
			enabled: true,
		});
	});

	it('Should return an empty object if the block name is not found', () => {
		const blockName = 'maxi-blocks/test';
		select.mockReturnValue({
			getBlock: jest.fn(() => null),
		});

		const ibOptions = getIBOptionsFromBlockData(blockName);

		expect(ibOptions).toEqual({});
	});
});
