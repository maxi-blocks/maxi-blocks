/**
 * Internal dependencies
 */
import getCustomLabel from '../getCustomLabel';
import getIsUniqueCustomLabelRepeated from '../getIsUniqueCustomLabelRepeated';

const mockStateBlock = {
	blocks: {
		'button-maxi-2se8ef1z-u': {
			clientId: '89293228-0e7b-4176-a6fd-87ad56f72be2',
			name: 'maxi-blocks/button-maxi',
			innerBlocks: [],
			attributes: {
				uniqueID: 'button-maxi-2se8ef1z-u',
				customLabel: 'Button_1',
			},
		},
		'button-maxi-3se8ef1z-u': {
			clientId: '5200ee1b-b2de-4848-9a0b-5af38df3b33a',
			name: 'maxi-blocks/button-maxi',
			innerBlocks: [],
			attributes: {
				uniqueID: 'button-maxi-3se8ef1z-u',
				customLabel: 'Button_1',
			},
		},
		'button-maxi-4se8ef1z-u': {
			clientId: '4da1841c-a90b-41f3-964c-038c088cbf95',
			name: 'maxi-blocks/button-maxi',
			innerBlocks: [],
			attributes: {
				uniqueID: 'button-maxi-4se8ef1z-u',
				customLabel: 'Custom button name 2',
			},
		},
	},
};

const mockStateBlocks = [
	{
		clientId: '89293228-0e7b-4176-a6fd-87ad56f72be2',
		name: 'maxi-blocks/button-maxi',
		innerBlocks: [],
		attributes: {
			uniqueID: 'button-maxi-2se8ef1z-u',
			customLabel: 'Button_1',
		},
	},
	{
		clientId: '5200ee1b-b2de-4848-9a0b-5af38df3b33a',
		name: 'maxi-blocks/button-maxi',
		innerBlocks: [],
		attributes: {
			uniqueID: 'button-maxi-3se8ef1z-u',
			customLabel: 'Button_1',
		},
	},
	{
		clientId: '4da1841c-a90b-41f3-964c-038c088cbf95',
		name: 'maxi-blocks/button-maxi',
		innerBlocks: [],
		attributes: {
			uniqueID: 'button-maxi-4se8ef1z-u',
			customLabel: 'Custom button name 2',
		},
	},
];

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => ({
			getBlocks: jest.fn(() => mockStateBlocks),
			getBlock: jest.fn(
				(state, uniqueID) => mockStateBlock.blocks[uniqueID]
			),
		})),
	};
});

const checkCustomLabel = (customLabel, uniqueID) => {
	if (getIsUniqueCustomLabelRepeated(customLabel))
		return getCustomLabel(customLabel, uniqueID);
	return customLabel;
};

describe('getCustomLabel', () => {
	it('Should return generated from uniqueID customLabel', () => {
		expect(checkCustomLabel('Button_1', 'button-maxi-3se8ef1z-u')).toBe(
			'Button_2'
		);
	});

	it('Should return customLabel with number from unique id', () => {
		expect(
			checkCustomLabel('Custom button name 2', 'button-maxi-4se8ef1z-u')
		).toBe('Custom button name 2');
	});
});
