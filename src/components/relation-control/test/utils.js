import {
	getCommonIBSettings,
	getChangedRelationTargetUpdates,
	getHighlightableBlockElements,
	getRelationBlockOption,
	getRelationControlId,
	getRelationId,
	getRelationStaticStateUpdate,
	getSyncedRelationPreviewIds,
	groupRelations,
	mergeRelationStartAttributeUpdates,
	revealRelationBlockElement,
	removeRelationGroup,
	syncRelationGroupTargets,
	updateRelationsInGroup,
	getRelationsForDisplay,
	getRelationsWithChangedTarget,
	getUnresolvedTargetRelations,
} from '../utils';

describe('relation-control utils', () => {
	const baseRelation = {
		id: 1,
		title: 'Fade items',
		uniqueID: 'target-a',
		action: 'hover',
		sid: 'bg',
		attributes: { 'background-status-hover': true },
		css: { general: { styles: { color: 'red' } } },
		effects: { 'transition-status-general': true },
		isButton: false,
	};

	describe('getRelationsForDisplay', () => {
		it('preserves unresolved relations instead of filtering them out', () => {
			const relations = [
				{
					id: 1,
					uniqueID: 'missing-target',
				},
				{
					id: 2,
					uniqueID: 'existing-target',
				},
			];

			expect(getRelationsForDisplay(relations)).toEqual(relations);
		});

		it('returns an empty array when relations are missing', () => {
			expect(getRelationsForDisplay()).toEqual([]);
		});
	});

	describe('getUnresolvedTargetRelations', () => {
		it('returns relations whose target uniqueID cannot be resolved', () => {
			const relations = [
				{
					id: 1,
					uniqueID: 'missing-target',
				},
				{
					id: 2,
					uniqueID: 'existing-target',
				},
				{
					id: 3,
					uniqueID: '',
				},
			];
			const getClientIdFromUniqueId = uniqueID =>
				uniqueID === 'existing-target' ? 'existing-client-id' : false;

			expect(
				getUnresolvedTargetRelations(relations, getClientIdFromUniqueId)
			).toEqual([
				{
					id: 1,
					uniqueID: 'missing-target',
				},
			]);
		});
	});

	describe('getRelationsWithChangedTarget', () => {
		it('swaps an existing same-setting target to prevent duplicate conflicting relations', () => {
			const relations = [
				{
					id: 1,
					uniqueID: 'image-1',
					action: 'click',
					sid: 'o',
					target: '',
					attributes: {
						'opacity-general': 1,
					},
				},
				{
					id: 2,
					uniqueID: 'image-2',
					action: 'click',
					sid: 'o',
					target: '',
					attributes: {
						'opacity-general': 0,
					},
				},
				{
					id: 3,
					uniqueID: 'image-3',
					action: 'click',
					sid: 'o',
					target: '',
					attributes: {
						'opacity-general': 0,
					},
				},
			];

			expect(
				getRelationsWithChangedTarget(relations, 1, {
					uniqueID: 'image-3',
				})
			).toEqual([
				{
					id: 1,
					uniqueID: 'image-3',
					action: 'click',
					sid: 'o',
					target: '',
					attributes: {
						'opacity-general': 1,
					},
				},
				{
					id: 2,
					uniqueID: 'image-2',
					action: 'click',
					sid: 'o',
					target: '',
					attributes: {
						'opacity-general': 0,
					},
				},
				{
					id: 3,
					uniqueID: 'image-1',
					action: 'click',
					sid: 'o',
					target: '',
					attributes: {
						'opacity-general': 0,
					},
				},
			]);
		});

		it('does not swap relations for different settings on the same target', () => {
			const relations = [
				{
					id: 1,
					uniqueID: 'image-1',
					action: 'click',
					sid: 'o',
					target: '',
				},
				{
					id: 2,
					uniqueID: 'image-2',
					action: 'click',
					sid: 't',
					target: '',
				},
			];

			expect(
				getRelationsWithChangedTarget(relations, 1, {
					uniqueID: 'image-2',
				})
			).toEqual([
				{
					id: 1,
					uniqueID: 'image-2',
					action: 'click',
					sid: 'o',
					target: '',
				},
				{
					id: 2,
					uniqueID: 'image-2',
					action: 'click',
					sid: 't',
					target: '',
				},
			]);
		});
	});

	it('groups legacy single relations and grouped relations', () => {
		const relations = [
			baseRelation,
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-10',
			},
			{
				...baseRelation,
				id: 3,
				uniqueID: 'target-c',
				groupId: 'relation-group-10',
			},
		];

		const groups = groupRelations(relations);

		expect(groups).toHaveLength(2);
		expect(groups[0]).toMatchObject({
			id: 'relation-single-1',
			groupId: null,
			uniqueIDs: ['target-a'],
		});
		expect(groups[1]).toMatchObject({
			id: 'relation-group-10',
			groupId: 'relation-group-10',
			uniqueIDs: ['target-b', 'target-c'],
		});
	});

	it('groups matching legacy relations without groupId', () => {
		const relations = [
			baseRelation,
			{
				...baseRelation,
				id: 2,
				title: 'Same behavior on another block',
				uniqueID: 'target-b',
			},
			{
				...baseRelation,
				id: 3,
				uniqueID: 'target-c',
				sid: 'border',
			},
		];

		const groups = groupRelations(relations);

		expect(groups).toHaveLength(2);
		expect(groups[0].id).toMatch(/^relation-legacy-/);
		expect(groups[0]).toMatchObject({
			groupId: null,
			relationIds: [1, 2],
			uniqueIDs: ['target-a', 'target-b'],
		});
		expect(groups[1]).toMatchObject({
			id: 'relation-single-3',
			uniqueIDs: ['target-c'],
		});
	});

	it('groups legacy pattern rows by interaction type and gives generated group titles', () => {
		const relations = [
			{
				...baseRelation,
				id: 1,
				title: 'Linkedin',
				target: 'button',
				sid: 'opacity',
				attributes: { 'opacity-general': 0.6 },
				effects: { 'transition-duration-general': 0.2 },
			},
			{
				...baseRelation,
				id: 2,
				title: 'Facebook',
				uniqueID: 'target-b',
				target: 'button',
				sid: 'opacity',
				attributes: { 'opacity-general': 0.3 },
				effects: { 'transition-duration-general': 0.4 },
			},
			{
				...baseRelation,
				id: 3,
				title: 'Instagram transform',
				uniqueID: 'target-c',
				target: 'button',
				sid: 'transform',
				attributes: { 'transform-scale-general': 1.2 },
			},
		];

		const groups = groupRelations(relations);

		expect(groups).toHaveLength(2);
		expect(groups[0]).toMatchObject({
			title: 'Group 1',
			relationIds: [1, 2],
			uniqueIDs: ['target-a', 'target-b'],
		});
		expect(groups[1]).toMatchObject({
			id: 'relation-single-3',
			uniqueIDs: ['target-c'],
		});
	});

	it('adds multiple targets to a relation group while preserving unrelated relations', () => {
		const unrelated = {
			...baseRelation,
			id: 9,
			uniqueID: 'other',
			sid: 'border',
		};
		const relations = [baseRelation, unrelated];
		const [group] = groupRelations(relations);

		const nextRelations = syncRelationGroupTargets({
			relations,
			relationGroup: group,
			uniqueIDs: ['target-a', 'target-b', 'target-c'],
			isButton: false,
		});

		expect(nextRelations).toHaveLength(4);
		expect(nextRelations[0]).toMatchObject({
			id: 1,
			uniqueID: 'target-a',
			groupId: 'relation-group-1',
		});
		expect(nextRelations[1]).toMatchObject({
			id: 10,
			uniqueID: 'target-b',
			groupId: 'relation-group-1',
		});
		expect(nextRelations[2]).toMatchObject({
			id: 11,
			uniqueID: 'target-c',
			groupId: 'relation-group-1',
		});
		expect(nextRelations[3]).toEqual(unrelated);
	});

	it('keeps the rendered control id stable when a single relation becomes a multi-target group', () => {
		const [singleGroup] = groupRelations([baseRelation]);
		const groupedRelations = syncRelationGroupTargets({
			relations: [baseRelation],
			relationGroup: singleGroup,
			uniqueIDs: ['target-a', 'target-b'],
			isButton: false,
		});
		const [multiTargetGroup] = groupRelations(groupedRelations);

		expect(singleGroup.id).toBe('relation-single-1');
		expect(multiTargetGroup.id).toBe('relation-group-1');
		expect(getRelationControlId(singleGroup)).toBe('relation-group-1');
		expect(getRelationControlId(multiTargetGroup)).toBe(
			'relation-group-1'
		);
	});

	it('keeps the rendered control id stable when a legacy group becomes an explicit group', () => {
		const legacyRelations = [
			baseRelation,
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
			},
		];
		const [legacyGroup] = groupRelations(legacyRelations);
		const groupedRelations = syncRelationGroupTargets({
			relations: legacyRelations,
			relationGroup: legacyGroup,
			uniqueIDs: ['target-a', 'target-b', 'target-c'],
			isButton: false,
		});
		const [explicitGroup] = groupRelations(groupedRelations);

		expect(legacyGroup.id).toMatch(/^relation-legacy-/);
		expect(explicitGroup.id).toBe('relation-group-1');
		expect(getRelationControlId(legacyGroup)).toBe('relation-group-1');
		expect(getRelationControlId(explicitGroup)).toBe('relation-group-1');
	});

	it('removes deselected targets from a group', () => {
		const relations = [
			{ ...baseRelation, groupId: 'relation-group-1' },
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-1',
			},
			{
				...baseRelation,
				id: 3,
				uniqueID: 'target-c',
				groupId: 'relation-group-1',
			},
		];
		const [group] = groupRelations(relations);

		const nextRelations = syncRelationGroupTargets({
			relations,
			relationGroup: group,
			uniqueIDs: ['target-a', 'target-c'],
			isButton: false,
		});

		expect(nextRelations.map(relation => relation.uniqueID)).toEqual([
			'target-a',
			'target-c',
		]);
		expect(nextRelations.map(relation => relation.id)).toEqual([1, 3]);
	});

	it('propagates updates across all relations in a group', () => {
		const relations = [
			{ ...baseRelation, groupId: 'relation-group-1' },
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-1',
			},
		];
		const [group] = groupRelations(relations);

		const nextRelations = updateRelationsInGroup(relations, group, {
			action: 'click',
			effects: { 'transition-duration-general': 0.5 },
		});

		expect(nextRelations).toEqual([
			expect.objectContaining({
				id: 1,
				action: 'click',
				effects: { 'transition-duration-general': 0.5 },
			}),
			expect.objectContaining({
				id: 2,
				action: 'click',
				effects: { 'transition-duration-general': 0.5 },
			}),
		]);
	});

	it('keeps the latest queued start transform update for rapid rotate changes', () => {
		const firstUpdate = {
			'transform-rotate-xl': {
				canvas: {
					normal: {
						x: 0,
						y: 0,
						z: 9,
					},
				},
			},
		};
		const latestUpdate = {
			'transform-rotate-xl': {
				canvas: {
					normal: {
						z: 90,
					},
				},
			},
		};

		expect(
			mergeRelationStartAttributeUpdates(firstUpdate, latestUpdate)
		).toEqual({
			'transform-rotate-xl': {
				canvas: {
					normal: {
						x: 0,
						y: 0,
						z: 90,
					},
				},
			},
		});
	});

	it('detects non-zero start rotate values as target block updates', () => {
		const updates = getChangedRelationTargetUpdates({
			uniqueIDs: ['target-a', 'target-b'],
			cleanValues: {
				'transform-rotate-xl': {
					canvas: {
						normal: {
							x: 0,
							y: 0,
							z: 90,
						},
					},
				},
			},
			getClientIdFromUniqueId: uid => `client-${uid}`,
			getBlockDataForClientId: clientId => ({
				attributes: {
					uniqueID: clientId.replace('client-', ''),
					'transform-rotate-xl': {
						canvas: {
							normal: {
								x: 0,
								y: 0,
								z: 0,
							},
						},
					},
				},
			}),
			isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
		});

		expect(updates).toEqual([
			{
				clientId: 'client-target-a',
				cleanValues: {
					'transform-rotate-xl': {
						canvas: {
							normal: {
								x: 0,
								y: 0,
								z: 90,
							},
						},
					},
				},
			},
			{
				clientId: 'client-target-b',
				cleanValues: {
					'transform-rotate-xl': {
						canvas: {
							normal: {
								x: 0,
								y: 0,
								z: 90,
							},
						},
					},
				},
			},
		]);
	});

	it('preserves unique relation IDs and a stable groupId when targets change', () => {
		const relations = [
			{ ...baseRelation, groupId: 'relation-group-7' },
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-7',
			},
		];
		const [group] = groupRelations(relations);

		const nextRelations = syncRelationGroupTargets({
			relations,
			relationGroup: group,
			uniqueIDs: ['target-b', 'target-c'],
			isButton: false,
		});

		expect(nextRelations).toEqual([
			expect.objectContaining({
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-7',
			}),
			expect.objectContaining({
				id: 3,
				uniqueID: 'target-c',
				groupId: 'relation-group-7',
			}),
		]);
	});

	it('syncs static end preview IDs when a selected relation group target is replaced', () => {
		const relations = [baseRelation];
		const [group] = groupRelations(relations);
		const nextRelations = syncRelationGroupTargets({
			relations,
			relationGroup: group,
			uniqueIDs: ['target-b'],
			isButton: false,
		});

		expect(
			getSyncedRelationPreviewIds({
				relationGroup: group,
				relations: nextRelations,
				selectedRelationIds: [1],
			})
		).toEqual([2]);
	});

	it('keeps static end preview IDs when another relation group changes', () => {
		const relations = [baseRelation];
		const [group] = groupRelations(relations);
		const nextRelations = syncRelationGroupTargets({
			relations,
			relationGroup: group,
			uniqueIDs: ['target-b'],
			isButton: false,
		});

		expect(
			getSyncedRelationPreviewIds({
				relationGroup: group,
				relations: nextRelations,
				selectedRelationIds: [9],
			})
		).toEqual([9]);
	});

	it('keeps one empty relation when every target is deselected', () => {
		const relations = [
			{ ...baseRelation, groupId: 'relation-group-1' },
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-1',
			},
		];
		const [group] = groupRelations(relations);

		const nextRelations = syncRelationGroupTargets({
			relations,
			relationGroup: group,
			uniqueIDs: [],
			isButton: false,
		});

		expect(nextRelations).toEqual([
			expect.objectContaining({
				id: 1,
				uniqueID: '',
				groupId: 'relation-group-1',
			}),
		]);
	});

	it('removes every relation in a group', () => {
		const unrelated = { ...baseRelation, id: 4, uniqueID: 'other' };
		const relations = [
			{ ...baseRelation, groupId: 'relation-group-1' },
			{
				...baseRelation,
				id: 2,
				uniqueID: 'target-b',
				groupId: 'relation-group-1',
			},
			unrelated,
		];
		const [group] = groupRelations(relations);

		expect(removeRelationGroup(relations, group)).toEqual([unrelated]);
	});

	it('returns the next relation id', () => {
		expect(getRelationId([{ id: 3 }, { id: 7 }])).toBe(8);
		expect(getRelationId([])).toBe(1);
	});

	it('returns only settings shared by every selected target', () => {
		const firstOptions = {
			style: [
				{ sid: 'bg', label: 'Background' },
				{ sid: 'border', label: 'Border' },
			],
			content: [{ sid: 'typography', label: 'Typography' }],
		};
		const secondOptions = {
			style: [
				{ sid: 'bg', label: 'Background' },
				{ sid: 'shadow', label: 'Shadow' },
			],
			content: [{ sid: 'typography', label: 'Typography' }],
		};

		expect(getCommonIBSettings([firstOptions, secondOptions])).toEqual({
			style: [{ sid: 'bg', label: 'Background' }],
			content: [{ sid: 'typography', label: 'Typography' }],
		});
	});

	it('builds a static end-state update for the selected relation group', () => {
		const relationGroup = {
			relationIds: [1, 3],
		};

		expect(
			getRelationStaticStateUpdate({
				relationGroup,
				state: 'end',
				isPreviewActive: true,
			})
		).toEqual({
			'relations-preview': false,
			'relations-preview-state': 'end',
			'relations-preview-relation-ids': [1, 3],
		});
	});

	it('builds a static start-state update without changing preview when it is already off', () => {
		const relationGroup = {
			relationIds: [2],
		};

		expect(
			getRelationStaticStateUpdate({
				relationGroup,
				state: 'start',
				isPreviewActive: false,
			})
		).toEqual({
			'relations-preview-state': 'start',
			'relations-preview-relation-ids': [2],
		});
	});

	it('builds block picker options grouped by the closest container label', () => {
		const containerBlock = {
			clientId: 'container-client',
			name: 'maxi-blocks/container-maxi',
			attributes: {
				customLabel: 'Hero container',
				uniqueID: 'container-uid',
			},
		};
		const textBlock = {
			clientId: 'text-client',
			name: 'maxi-blocks/text-maxi',
			attributes: {
				customLabel: 'Headline',
				uniqueID: 'text-uid',
			},
		};
		const columnBlock = {
			clientId: 'column-client',
			name: 'maxi-blocks/column-maxi',
			attributes: {
				customLabel: 'Hero column',
				uniqueID: 'column-uid',
			},
		};

		expect(
			getRelationBlockOption({
				block: textBlock,
				currentUniqueID: 'text-uid',
				currentLabel: 'Current',
				fallbackGroupLabel: 'Canvas',
				getBlockParentsByBlockName: (_clientId, blockName) =>
					blockName === 'maxi-blocks/container-maxi'
						? ['container-client']
						: ['column-client'],
				getBlock: clientId => {
					if (clientId === 'container-client') return containerBlock;
					if (clientId === 'column-client') return columnBlock;
					return null;
				},
			})
		).toEqual({
			label: 'Headline',
			value: 'text-uid',
			blockType: 'text',
			blockTypeLabel: 'Text',
			hoverValue: 'text-client',
			groupLabel: 'Hero container',
			groupValue: 'container-uid',
			groupHoverValue: 'container-client',
			columnLabel: 'Hero column',
			columnValue: 'column-uid',
			columnHoverValue: 'column-client',
			isCurrentBlock: true,
			isCurrentGroup: true,
			isCurrentColumn: true,
		});
	});

	it('groups blocks without a container under the canvas label', () => {
		const looseBlock = {
			clientId: 'text-client',
			name: 'maxi-blocks/text-maxi',
			attributes: {
				customLabel: 'Loose text',
				uniqueID: 'text-uid',
			},
		};

		expect(
			getRelationBlockOption({
				block: looseBlock,
				fallbackGroupLabel: 'Canvas',
				getBlockParentsByBlockName: () => [],
				getBlock: () => null,
			})
		).toEqual({
			label: 'Loose text',
			value: 'text-uid',
			blockType: 'text',
			blockTypeLabel: 'Text',
			hoverValue: 'text-client',
			groupLabel: 'Canvas',
			groupValue: '',
			groupHoverValue: '',
			columnLabel: '',
			columnValue: '',
			columnHoverValue: '',
			isCurrentBlock: false,
			isCurrentGroup: false,
			isCurrentColumn: false,
		});
	});

	it('finds the text content element for nested group child highlights instead of list view duplicates', () => {
		document.body.innerHTML = `
			<div class="block-editor-list-view__block" data-block="text-client"></div>
			<div class="editor-styles-wrapper">
				<div class="block-editor-block-list__layout">
					<div class="wp-block" data-block="group-client">
						<div class="wp-block" data-block="text-client">
							<div class="maxi-block maxi-text-block">
								<p class="maxi-text-block__content">Grouped text</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		const textContentElement = document.querySelector(
			'.editor-styles-wrapper [data-block="text-client"] .maxi-text-block__content'
		);

		expect(
			getHighlightableBlockElements({
				clientId: 'text-client',
				searchContexts: [document],
			})
		).toEqual([textContentElement]);

		document.body.innerHTML = '';
	});

	it('finds the text content element when the editor data-block is on the text block wrapper', () => {
		document.body.innerHTML = `
			<div class="editor-styles-wrapper">
				<div class="block-editor-block-list__layout">
					<div class="maxi-block maxi-text-block" data-block="text-client">
						<p class="maxi-text-block__content">Direct text</p>
					</div>
				</div>
			</div>
		`;

		const textContentElement = document.querySelector(
			'.editor-styles-wrapper [data-block="text-client"] > .maxi-text-block__content'
		);

		expect(
			getHighlightableBlockElements({
				clientId: 'text-client',
				searchContexts: [document],
			})
		).toEqual([textContentElement]);

		document.body.innerHTML = '';
	});

	it('keeps group highlight targets on the group wrapper even when it contains text blocks', () => {
		document.body.innerHTML = `
			<div class="editor-styles-wrapper">
				<div class="block-editor-block-list__layout">
					<div class="wp-block" data-block="group-client">
						<div class="maxi-block maxi-group-block">
							<div class="wp-block" data-block="text-client">
								<div class="maxi-block maxi-text-block">
									<p class="maxi-text-block__content">Grouped text</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		const groupCanvasElement = document.querySelector(
			'.editor-styles-wrapper [data-block="group-client"]'
		);

		expect(
			getHighlightableBlockElements({
				clientId: 'group-client',
				searchContexts: [document],
			})
		).toEqual([groupCanvasElement]);

		document.body.innerHTML = '';
	});

	it('scrolls to a revealed block and removes the reveal pulse after the animation window', () => {
		jest.useFakeTimers();

		const element = document.createElement('div');
		element.scrollIntoView = jest.fn();
		element.getBoundingClientRect = jest.fn(() => ({}));

		revealRelationBlockElement(element);

		expect(element.scrollIntoView).toHaveBeenCalledWith({
			behavior: 'smooth',
			block: 'center',
			inline: 'center',
		});
		expect(element.classList.contains('maxi-block--revealed')).toBe(true);

		jest.advanceTimersByTime(1200);

		expect(element.classList.contains('maxi-block--revealed')).toBe(false);

		jest.useRealTimers();
	});
});
