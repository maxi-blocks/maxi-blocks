/**
 * Internal dependencies
 */
import getCustomLabel from '@extensions/maxi-block/getCustomLabel';

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
		'text-maxi-34d8de32-u': {
			clientId: 'e0a326e8-8e25-4da7-8ec1-923663fb4c91',
			name: 'maxi-blocks/text-maxi',
			innerBlocks: [],
			attributes: {
				uniqueID: 'text-maxi-34d8de32-u',
				customLabel: 'Custom text name 2',
			},
		},
		'text-maxi-a9333c75-u': {
			clientId: '29990f41-7f8a-4d4a-948c-592f33b66281',
			name: 'maxi-blocks/text-maxi',
			innerBlocks: [],
			attributes: {
				uniqueID: 'text-maxi-a9333c75-u',
				customLabel: 'Custom text name 2',
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
	{
		clientId: 'e0a326e8-8e25-4da7-8ec1-923663fb4c91',
		name: 'maxi-blocks/text-maxi',
		innerBlocks: [],
		attributes: {
			uniqueID: 'text-maxi-34d8de32-u',
			customLabel: 'Custom text name 2',
		},
	},
	{
		clientId: '29990f41-7f8a-4d4a-948c-592f33b66281',
		name: 'maxi-blocks/text-maxi',
		innerBlocks: [],
		attributes: {
			uniqueID: 'text-maxi-a9333c75-u',
			customLabel: 'Custom text name 2',
		},
	},
];

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(storeName => {
			if (storeName === 'maxiBlocks/blocks') {
				return {
					getBlocks: jest.fn(() => mockStateBlock.blocks),
				};
			}
			// For 'core/block-editor'
			return {
				getBlocks: jest.fn(() => mockStateBlocks),
				getBlock: jest.fn(
					clientId =>
						mockStateBlocks.find(
							block => block.clientId === clientId
						) || false
				),
			};
		}),
	};
});

describe('getCustomLabel', () => {
	it('Should return generated from uniqueID customLabel', () => {
		expect(getCustomLabel('Button_1', 'button-maxi-3se8ef1z-u')).toBe(
			'Button_2'
		);
	});

	it('Should return customLabel with number from unique id', () => {
		expect(
			getCustomLabel('Custom button name 2', 'button-maxi-4se8ef1z-u')
		).toBe('Custom button name 2');
	});

	it('Should return customLabel with unique index', () => {
		expect(
			getCustomLabel('Custom text name 2', 'text-maxi-a9333c75-u')
		).toBe('Custom text name 2_2');
	});
});
