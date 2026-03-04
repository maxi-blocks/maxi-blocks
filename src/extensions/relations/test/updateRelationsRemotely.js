/**
 * Internal dependencies
 */
import updateRelationsRemotely from '@extensions/relations/updateRelationsRemotely';
import { getSelectedIBSettings } from '@extensions/relations/utils';
import getCleanResponseIBAttributes from '@extensions/relations/getCleanResponseIBAttributes';
import getIBStylesObj from '@extensions/relations/getIBStylesObj';
import getIBStyles from '@extensions/relations/getIBStyles';
import batchRelationsUpdater from '@extensions/relations/batchRelationsUpdater';
import { select } from '@wordpress/data';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
	dispatch: jest.fn(),
}));

jest.mock('@extensions/relations/utils', () => ({
	getSelectedIBSettings: jest.fn(),
}));

jest.mock('@extensions/relations/getCleanResponseIBAttributes', () =>
	jest.fn()
);

jest.mock('@extensions/relations/getIBStylesObj', () => jest.fn());

jest.mock('@extensions/relations/getIBStyles', () => jest.fn());

jest.mock('@extensions/relations/batchRelationsUpdater', () => ({
	addUpdate: jest.fn(),
	flush: jest.fn(),
	getPendingCount: jest.fn(),
}));

describe('updateRelationsRemotely', () => {
	const mockBlockTriggerClientId = 'trigger-client-id';
	const mockBlockTargetClientId = 'target-client-id';
	const mockBlockAttributes = {
		uniqueID: 'target-unique-id',
		blockStyle: 'default',
		'border-status': true,
		'border-width': '2px',
		'border-color': '#000000',
		'border-radius': '10px',
		'background-layers': [
			{
				id: 'bg-layer-1',
				'background-color': '#ffffff',
				'background-opacity': 1,
			},
		],
	};
	const mockBreakpoint = 'general';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return early if trigger and target blocks are the same', () => {
		updateRelationsRemotely({
			blockTriggerClientId: mockBlockTriggerClientId,
			blockTargetClientId: mockBlockTriggerClientId,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(getSelectedIBSettings).not.toHaveBeenCalled();
		expect(getCleanResponseIBAttributes).not.toHaveBeenCalled();
		expect(getIBStylesObj).not.toHaveBeenCalled();
		expect(getIBStyles).not.toHaveBeenCalled();
	});

	it('should return early if no relations are found', () => {
		select.mockReturnValue({
			getBlockAttributes: jest.fn().mockReturnValue({}),
		});

		updateRelationsRemotely({
			blockTriggerClientId: mockBlockTriggerClientId,
			blockTargetClientId: mockBlockTargetClientId,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(getSelectedIBSettings).not.toHaveBeenCalled();
		expect(getCleanResponseIBAttributes).not.toHaveBeenCalled();
		expect(getIBStylesObj).not.toHaveBeenCalled();
		expect(getIBStyles).not.toHaveBeenCalled();
	});

	it('should preserve relations with empty attributes', () => {
		select.mockReturnValue({
			getBlockAttributes: jest.fn().mockReturnValue({
				relations: [
					{
						uniqueID: 'other-unique-id',
						attributes: {},
					},
				],
			}),
		});

		updateRelationsRemotely({
			blockTriggerClientId: mockBlockTriggerClientId,
			blockTargetClientId: mockBlockTargetClientId,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(getSelectedIBSettings).not.toHaveBeenCalled();
		expect(getCleanResponseIBAttributes).not.toHaveBeenCalled();
		expect(getIBStylesObj).not.toHaveBeenCalled();
		expect(getIBStyles).not.toHaveBeenCalled();
		expect(batchRelationsUpdater.addUpdate).not.toHaveBeenCalled();
	});

	it('should skip relations with different uniqueID', () => {
		select.mockReturnValue({
			getBlockAttributes: jest.fn().mockReturnValue({
				relations: [
					{
						uniqueID: 'other-unique-id',
						attributes: {
							'border-status': true,
						},
					},
				],
			}),
		});

		updateRelationsRemotely({
			blockTriggerClientId: mockBlockTriggerClientId,
			blockTargetClientId: mockBlockTargetClientId,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(getSelectedIBSettings).not.toHaveBeenCalled();
		expect(getCleanResponseIBAttributes).not.toHaveBeenCalled();
		expect(getIBStylesObj).not.toHaveBeenCalled();
		expect(getIBStyles).not.toHaveBeenCalled();
	});

	it('should handle background layers special case', () => {
		select.mockReturnValue({
			getBlockAttributes: jest.fn().mockReturnValue({
				relations: [
					{
						uniqueID: 'target-unique-id',
						sid: 'bgl',
						attributes: {
							'background-layers': [
								{
									id: 'bg-layer-1',
									'background-color': '#ffffff',
									'background-opacity': 1,
								},
								{
									id: 'bg-layer-2',
									'background-color': '#000000',
									'background-opacity': 0.5,
								},
							],
						},
					},
				],
			}),
		});

		const selectedSettings = {
			prefix: '',
			attrGroupName: 'background',
		};

		getSelectedIBSettings.mockReturnValue(selectedSettings);
		getCleanResponseIBAttributes.mockReturnValue({
			cleanAttributesObject: {},
			tempAttributes: {},
		});
		getIBStylesObj.mockReturnValue({});
		getIBStyles.mockReturnValue({});

		updateRelationsRemotely({
			blockTriggerClientId: mockBlockTriggerClientId,
			blockTargetClientId: mockBlockTargetClientId,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(getCleanResponseIBAttributes).toHaveBeenCalledWith(
			expect.objectContaining({
				'background-layers': [
					{
						id: 'bg-layer-1',
						'background-color': '#ffffff',
						'background-opacity': 1,
					},
				],
			}),
			mockBlockAttributes,
			'target-unique-id',
			selectedSettings,
			mockBreakpoint,
			'',
			'bgl',
			mockBlockTriggerClientId
		);
	});

	it('should handle transition effects', () => {
		select.mockReturnValue({
			getBlockAttributes: jest.fn().mockReturnValue({
				relations: [
					{
						uniqueID: 'target-unique-id',
						sid: 't',
						attributes: {
							'transform-status': true,
						},
						effects: {
							transitionTarget: ['transform'],
						},
					},
				],
			}),
		});

		const selectedSettings = {
			prefix: '',
			attrGroupName: 'transform',
		};

		getSelectedIBSettings.mockReturnValue(selectedSettings);
		getCleanResponseIBAttributes.mockReturnValue({
			cleanAttributesObject: {},
			tempAttributes: {},
		});
		getIBStylesObj.mockReturnValue({});
		getIBStyles.mockReturnValue({
			transform: 'scale(1.2)',
			'transform-origin': 'center',
		});

		updateRelationsRemotely({
			blockTriggerClientId: mockBlockTriggerClientId,
			blockTargetClientId: mockBlockTargetClientId,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(batchRelationsUpdater.addUpdate).toHaveBeenCalledWith(
			mockBlockTriggerClientId,
			expect.arrayContaining([
				expect.objectContaining({
					effects: {
						transitionTarget: ['transform', 'transform-origin'],
					},
				}),
			])
		);
	});

	it('should update relations if there are changes', () => {
		select.mockReturnValue({
			getBlockAttributes: jest.fn().mockReturnValue({
				relations: [
					{
						uniqueID: 'target-unique-id',
						sid: 'border',
						attributes: {
							'border-status': true,
						},
						css: {
							'border-width': '1px',
						},
					},
				],
			}),
		});

		const selectedSettings = {
			prefix: '',
			attrGroupName: 'border',
		};

		getSelectedIBSettings.mockReturnValue(selectedSettings);
		getCleanResponseIBAttributes.mockReturnValue({
			cleanAttributesObject: {
				'border-width': '2px',
			},
			tempAttributes: {},
		});
		getIBStylesObj.mockReturnValue({});
		getIBStyles.mockReturnValue({
			'border-width': '2px',
		});

		updateRelationsRemotely({
			blockTriggerClientId: mockBlockTriggerClientId,
			blockTargetClientId: mockBlockTargetClientId,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(batchRelationsUpdater.addUpdate).toHaveBeenCalledWith(
			mockBlockTriggerClientId,
			expect.arrayContaining([
				expect.objectContaining({
					attributes: expect.objectContaining({
						'border-status': true,
						'border-width': '2px',
					}),
					css: {
						'border-width': '2px',
					},
				}),
			])
		);
	});

	it('should not update relations if there are no changes', () => {
		select.mockReturnValue({
			getBlockAttributes: jest.fn().mockReturnValue({
				relations: [
					{
						uniqueID: 'target-unique-id',
						sid: 'border',
						attributes: {
							'border-status': true,
							'border-width': '2px',
						},
						css: {
							'border-width': '2px',
						},
					},
				],
			}),
		});

		const selectedSettings = {
			prefix: '',
			attrGroupName: 'border',
		};

		getSelectedIBSettings.mockReturnValue(selectedSettings);
		getCleanResponseIBAttributes.mockReturnValue({
			cleanAttributesObject: {
				'border-width': '2px',
			},
			tempAttributes: {},
		});
		getIBStylesObj.mockReturnValue({});
		getIBStyles.mockReturnValue({
			'border-width': '2px',
		});

		updateRelationsRemotely({
			blockTriggerClientId: mockBlockTriggerClientId,
			blockTargetClientId: mockBlockTargetClientId,
			blockAttributes: mockBlockAttributes,
			breakpoint: mockBreakpoint,
		});

		expect(batchRelationsUpdater.addUpdate).not.toHaveBeenCalled();
	});
});
