/**
 * Internal dependencies
 */
import getCustomLabel from '../getCustomLabel';

const mockStateBlock = {
	blocks: {
		'button-maxi-2se8ef1z-u': {
			clientId: '89293228-0e7b-4176-a6fd-87ad56f72be2',
			name: 'maxi-blocks/button-maxi',
			innerBlocks: [],
			attributes: {
				uniqueID: 'button-maxi-2se8ef1z-u',
				customLabel: 'Custom button name',
			},
		},
		'button-maxi-3se8ef1z-u': {
			clientId: '5200ee1b-b2de-4848-9a0b-5af38df3b33a',
			name: 'maxi-blocks/button-maxi',
			innerBlocks: [],
			attributes: {
				uniqueID: 'button-maxi-3se8ef1z-u',
				customLabel: 'Custom button name',
			},
		},
		'button-maxi-4se8ef1z-u': {
			clientId: '4da1841c-a90b-41f3-964c-038c088cbf95',
			name: 'maxi-blocks/button-maxi',
			innerBlocks: [],
			attributes: {
				uniqueID: 'button-maxi-4se8ef1z-u',
				customLabel: 'Custom button name 2  ',
			},
		},
		'button-maxi-5se8ef1z-u': {
			clientId: '87601a8a-cee9-451e-a6ae-702c91c5e343',
			name: 'maxi-blocks/button-maxi',
			innerBlocks: [],
			attributes: {
				uniqueID: 'button-maxi-5se8ef1z-u',
				customLabel: 'Custom button name 2_2',
			},
		},
		'button-maxi-6se8ef1z-u': {
			clientId: 'aec3ceb0-18dc-4e93-909d-f9ecbdfeef85',
			name: 'maxi-blocks/button-maxi',
			innerBlocks: [],
			attributes: {
				uniqueID: 'button-maxi-6se8ef1z-u',
				customLabel: 'Custom button name 2_2',
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
			customLabel: 'Custom button name',
		},
	},
	{
		clientId: '5200ee1b-b2de-4848-9a0b-5af38df3b33a',
		name: 'maxi-blocks/button-maxi',
		innerBlocks: [],
		attributes: {
			uniqueID: 'button-maxi-3se8ef1z-u',
			customLabel: 'Custom button name',
		},
	},
	{
		clientId: '4da1841c-a90b-41f3-964c-038c088cbf95',
		name: 'maxi-blocks/button-maxi',
		innerBlocks: [],
		attributes: {
			uniqueID: 'button-maxi-4se8ef1z-u',
			customLabel: 'Custom button name 2  ',
		},
	},
	{
		clientId: '87601a8a-cee9-451e-a6ae-702c91c5e343',
		name: 'maxi-blocks/button-maxi',
		innerBlocks: [],
		attributes: {
			uniqueID: 'button-maxi-5se8ef1z-u',
			customLabel: 'Custom button name 2_2',
		},
	},
	{
		clientId: 'aec3ceb0-18dc-4e93-909d-f9ecbdfeef85',
		name: 'maxi-blocks/button-maxi',
		innerBlocks: [],
		attributes: {
			uniqueID: 'button-maxi-6se8ef1z-u',
			customLabel: 'Custom button name 2_2',
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

describe('getCustomLabel', () => {
	it('Should return generated from uniqueID customLabel', () => {
		expect(getCustomLabel(null, 'button-maxi-5se8ef1z-u')).toBe('Button_1');
	});

	it('Should return customLabel with number from unique id', () => {
		expect(getCustomLabel('Button_5', 'button-maxi-6se8ef1z-u')).toBe(
			'Button_1'
		);
	});

	it('Should return custom customLabel with corrected number', () => {
		expect(
			getCustomLabel('Custom button name 2_2', 'button-maxi-6se8ef1z-u')
		).toBe('Button_1');
	});
});
