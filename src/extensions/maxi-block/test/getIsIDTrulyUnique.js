/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getIsIDTrulyUnique from '@extensions/maxi-block/getIsIDTrulyUnique';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => ({
			getBlocks: jest.fn(
				clientId =>
					!clientId && [
						{
							clientId: '89293228-0e7b-4176-a6fd-87ad56f72be2',
							name: 'maxi-blocks/button-maxi',
							innerBlocks: [],
							attributes: {
								uniqueID: 'button-maxi-7f750e3e-u',
							},
						},
						{
							clientId: '5200ee1b-b2de-4848-9a0b-5af38df3b33a',
							name: 'maxi-blocks/button-maxi',
							innerBlocks: [],
							attributes: {
								uniqueID: 'button-maxi-8f753e7g-u',
							},
						},
						{
							clientId: '4da1841c-a90b-41f3-964c-038c088cbf95',
							name: 'maxi-blocks/button-maxi',
							innerBlocks: [],
							attributes: {
								uniqueID: 'button-maxi-8f753e7g-u',
							},
						},
						{
							clientId: '87601a8a-cee9-451e-a6ae-702c91c5e343',
							name: 'maxi-blocks/button-maxi',
							innerBlocks: [],
							attributes: {
								uniqueID: 'button-maxi-9f75ge3g-u',
							},
						},
						{
							clientId: 'aec3ceb0-18dc-4e93-909d-f9ecbdfeef85',
							name: 'maxi-blocks/button-maxi',
							innerBlocks: [],
							attributes: {
								uniqueID: 'button-maxi-9f75ge3g-u',
							},
						},
						{
							clientId: '9d3d0c7c-c3e3-4ca6-a191-4a1f923f0da8',
							name: 'maxi-blocks/button-maxi',
							innerBlocks: [],
							attributes: {
								uniqueID: 'button-maxi-0f75de4g-u',
							},
						},
						{
							clientId: '2b93c090-8658-47ef-b8a3-fc36e686e727',
							name: 'maxi-blocks/button-maxi',
							innerBlocks: [],
							attributes: {
								uniqueID: 'button-maxi-0f75de4g-u',
							},
						},
						{
							clientId: '8646bf0a-084d-442c-b916-7001b3dd63f9',
							name: 'maxi-blocks/button-maxi',
							innerBlocks: [],
							attributes: {
								uniqueID: 'button-maxi-0f75de4g-u',
							},
						},
						{
							clientId: '1822e076-34a5-4068-87f1-1f8dc9e764a5',
							name: 'maxi-blocks/container-maxi',
							innerBlocks: [
								{
									clientId:
										'dc4dfd7a-5165-407a-b8a3-7251aefafec6',
									name: 'maxi-blocks/row-maxi',
									innerBlocks: [
										{
											clientId:
												'402bcc4c-7f31-44df-b027-33febc284208',
											name: 'maxi-blocks/column-maxi',
											innerBlocks: [
												{
													clientId:
														'3a6240bb-fe2d-4484-ae19-fbe6c88ca4c5',
													name: 'maxi-blocks/row-maxi',
													innerBlocks: [
														{
															clientId:
																'f692deb2-015d-429a-ba71-0c954baab988',
															name: 'maxi-blocks/column-maxi',
															innerBlocks: [],
															attributes: {
																uniqueID:
																	'column-maxi-3eu7sf1p-uf45se4g-u',
															},
														},
														{
															clientId:
																'6dfb79e1-556c-4733-93b8-285ef7ffd90f',
															name: 'maxi-blocks/column-maxi',
															innerBlocks: [
																{
																	clientId:
																		'd03c54eb-54e2-4726-b110-10f3641c1355',
																	name: 'maxi-blocks/row-maxi',
																	innerBlocks:
																		[
																			{
																				clientId:
																					'21047fc0-727a-49d5-a461-5e1981799c79',
																				name: 'maxi-blocks/column-maxi',
																				innerBlocks:
																					[
																						{
																							clientId:
																								'87a36bb0-6e2d-4717-bd50-c1bd22936fa2',
																							name: 'maxi-blocks/divider-maxi',
																							innerBlocks:
																								[],
																							attributes:
																								{
																									uniqueID:
																										'divider-maxi-2l45ss4g-u',
																								},
																						},
																					],
																				attributes:
																					{
																						uniqueID:
																							'column-maxi-il45ss6g-u',
																					},
																			},
																		],
																	attributes:
																		{
																			uniqueID:
																				'row-maxi-ql85ss8l-u',
																		},
																},
															],
															attributes: {
																uniqueID:
																	'column-maxi-3eu7sf1p-uf45se4g-u',
															},
														},
														{
															clientId:
																'cbaec051-a442-4937-9123-f50d3e70519c',
															name: 'maxi-blocks/column-maxi',
															innerBlocks: [
																{
																	clientId:
																		'3749e21d-38f2-41c7-a488-57fccd0871b2',
																	name: 'maxi-blocks/text-maxi',
																	innerBlocks:
																		[],
																	attributes:
																		{
																			uniqueID:
																				'text-maxi-wl35ss8l-u',
																		},
																},
															],
															attributes: {
																uniqueID:
																	'column-maxi-3eu7sf1p-uf45se4g-u',
															},
														},
													],
													attributes: {
														uniqueID:
															'row-maxi-2e35ss1p-u',
													},
												},
											],
											attributes: {
												uniqueID:
													'column-maxi-3eu7sf1p-uf45se4g-u',
											},
										},
										{
											clientId:
												'8037ccce-f388-4cc4-86b0-68c2b90ea9bb',
											name: 'maxi-blocks/column-maxi',
											innerBlocks: [
												{
													clientId:
														'b0de73d4-8b63-448e-8c60-4d86a14f620c',
													name: 'maxi-blocks/text-maxi',
													innerBlocks: [],
													attributes: {
														uniqueID:
															'text-maxi-wl35ss8l-u',
													},
												},
											],
											attributes: {
												uniqueID:
													'column-maxi-2e75sf1p-u',
											},
										},
										{
											clientId:
												'd84c7ea8-9ddf-4233-9c15-2ca34cfad749',
											name: 'maxi-blocks/column-maxi',
											innerBlocks: [],
											attributes: {
												uniqueID:
													'column-maxi-3eu7sf1p-u',
											},
										},
										{
											clientId:
												'6e4443d9-3457-4ab7-a754-92dc9452f31d',
											name: 'maxi-blocks/column-maxi',
											innerBlocks: [],
											attributes: {
												uniqueID:
													'column-maxi-3eu7sf1p-u',
											},
										},
									],
									attributes: {
										uniqueID: 'row-maxi-1ue7sf1w-u',
									},
								},
							],
							attributes: {
								uniqueID: 'container-maxi-1seusf1w-u',
							},
						},
					]
			),
			getBlock: jest.fn(() => false),
		})),
	};
});

describe('getIsIDTrulyUnique', () => {
	it('Should not be repeated, first on hierarchy', () => {
		expect(getIsIDTrulyUnique('button-maxi-7f750e3e-u')).toBe(true);
	});

	it('Should be repeated, first on hierarchy', () => {
		expect(getIsIDTrulyUnique('button-maxi-8f753e7g-u')).toBe(false);
	});

	it('Should be repeated only two times, first on hierarchy', () => {
		expect(getIsIDTrulyUnique('button-maxi-9f75ge3g-u', 2)).toBe(true);
	});

	it('Should not be repeated only two times, first on hierarchy', () => {
		expect(getIsIDTrulyUnique('button-maxi-0f75de4g-u', 2)).toBe(false);
	});

	it('Should not be repeated, nested block', () => {
		expect(getIsIDTrulyUnique('divider-maxi-2l45ss4g-u')).toBe(true);
	});

	it('Should be repeated, nested block', () => {
		expect(getIsIDTrulyUnique('column-maxi-3eu7sf1p-u')).toBe(false);
	});

	it('Should be repeated only 4 times, nested blocks on different levels', () => {
		expect(getIsIDTrulyUnique('column-maxi-3eu7sf1p-uf45se4g-u', 4)).toBe(
			true
		);
	});

	it('Should be repeated, when uniqueID is the same for two inner blocks with different root and parent', () => {
		select.mockImplementation(() => ({
			getBlocks: jest.fn(
				clientId =>
					!clientId && [
						{
							clientId: '36d5807b-981b-4d80-88ea-21fef846647d',
							name: 'maxi-blocks/group-maxi',
							attributes: {
								uniqueID: 'group-maxi-1se8sf1z-u',
							},
							innerBlocks: [
								{
									clientId:
										'a8db982d-4460-4092-8c34-3e7d8ff1623f',
									name: 'maxi-blocks/text-maxi',
									attributes: {
										uniqueID: 'text-maxi-wl35ss8l-u',
									},
									innerBlocks: [],
								},
							],
						},
						{
							clientId: '437157e6-2af5-4e6e-8b2c-f2274fff85eb',
							name: 'maxi-blocks/group-maxi',
							attributes: {
								uniqueID: 'group-maxi-2se8ef1z-u',
							},
							innerBlocks: [
								{
									clientId:
										'687687a4-0636-4b9a-a70c-979ef4dbad60',
									name: 'maxi-blocks/text-maxi',
									attributes: {
										uniqueID: 'text-maxi-wl35ss8l-u',
									},
									innerBlocks: [],
								},
							],
						},
					]
			),
			getBlock: jest.fn(() => false),
		}));
		expect(getIsIDTrulyUnique('text-maxi-wl35ss8l-u')).toBe(false);
	});
});
