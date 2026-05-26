/**
 * Internal dependencies
 */
import {
	getRelationsForDisplay,
	getRelationsWithChangedTarget,
	getUnresolvedTargetRelations,
} from '@components/relation-control/utils';

describe('relation-control/utils', () => {
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
});
