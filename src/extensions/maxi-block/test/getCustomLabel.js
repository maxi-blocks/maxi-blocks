import getCustomLabel from '../getCustomLabel';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => ({
			getBlocks: jest.fn(() => [
				{
					clientId: '89293228-0e7b-4176-a6fd-87ad56f72be2',
					name: 'maxi-blocks/button-maxi',
					innerBlocks: [],
					attributes: {
						uniqueID: 'button-maxi-2',
						customLabel: 'Custom button name',
					},
				},
				{
					clientId: '5200ee1b-b2de-4848-9a0b-5af38df3b33a',
					name: 'maxi-blocks/button-maxi',
					innerBlocks: [],
					attributes: {
						uniqueID: 'button-maxi-3',
						customLabel: 'Custom button name',
					},
				},
				{
					clientId: '4da1841c-a90b-41f3-964c-038c088cbf95',
					name: 'maxi-blocks/button-maxi',
					innerBlocks: [],
					attributes: {
						uniqueID: 'button-maxi-4',
						customLabel: 'Custom button name 2  ',
					},
				},
				{
					clientId: '87601a8a-cee9-451e-a6ae-702c91c5e343',
					name: 'maxi-blocks/button-maxi',
					innerBlocks: [],
					attributes: {
						uniqueID: 'button-maxi-5',
						customLabel: 'Custom button name 2_2',
					},
				},
				{
					clientId: 'aec3ceb0-18dc-4e93-909d-f9ecbdfeef85',
					name: 'maxi-blocks/button-maxi',
					innerBlocks: [],
					attributes: {
						uniqueID: 'button-maxi-6',
						customLabel: 'Custom button name 2_2',
					},
				},
			]),
		})),
	};
});

describe('getCustomLabel', () => {
	it('Should return generated from uniqueID customLabel', () => {
		expect(getCustomLabel(null, 'button-maxi-5')).toBe('Button_5');
	});

	it('Should return customLabel with number from unique id', () => {
		expect(getCustomLabel('Button_5', 'button-maxi-6')).toBe('Button_6');
	});

	it('Should return custom customLabel with corrected number', () => {
		expect(getCustomLabel('Custom button name 2_2', 'button-maxi-6')).toBe(
			'Custom button name 2_6'
		);
	});
});
