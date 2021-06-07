import { getAttributes } from '../getBlockAttributes';

describe('Testing getBlockAttributes', () => {
	it('Returns a nested block', () => {
		const blocks = [
			{
				clientId: '9ccf2e39-2e24-4fe2-b0df-5075fdd42401',
				attributes: {},
				innerBlocks: [
					{
						clientId: '694d7a24-f583-4f97-a84c-ee54addf34a3',
						attributes: {},
						innerBlocks: [
							{
								clientId:
									'792b55ab-b1c4-4b9e-b31c-1975a152dbbd',
								attributes: {},
								innerBlocks: [],
							},
							{
								clientId:
									'580bf4e3-ae92-456e-aec0-3ab0f643da7c',
								attributes: {
									testing: 'approved',
								},
								innerBlocks: [],
							},
							{
								clientId:
									'cd9a1f1f-31e1-4ef6-b019-c10000a464f2',
								attributes: {},
								innerBlocks: [],
							},
							{
								clientId:
									'a849abb5-0a82-4fc6-a56d-2f731ca96c46',
								attributes: {},
								innerBlocks: [],
							},
							{
								clientId:
									'32094fb6-4010-4e23-8fc8-a0b8744edac5',
								attributes: {},
								innerBlocks: [],
							},
							{
								clientId:
									'420eceb4-ad67-4c0a-9a60-2f7ca8e86560',
								attributes: {},
								innerBlocks: [],
							},
							{
								clientId:
									'6bbb262b-8d29-478f-a943-63f4dd5ac3ed',
								attributes: {},
								innerBlocks: [],
							},
							{
								clientId:
									'0a07bf6b-5df3-4a1e-9b87-3d35fa242a22',
								attributes: {},
								innerBlocks: [],
							},
						],
					},
				],
			},
		];
		const clientId = '580bf4e3-ae92-456e-aec0-3ab0f643da7c';

		const result = getAttributes(blocks, clientId);

		expect(result).toStrictEqual({ testing: 'approved' });
	});
});
