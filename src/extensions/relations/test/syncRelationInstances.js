import syncRelationInstances from '@extensions/relations/syncRelationInstances';

const makeRelation = overrides => ({
	id: 'relation-1',
	uniqueID: 'target-1',
	action: 'hover',
	trigger: 'trigger-1',
	target: '',
	blockTarget: '.target-1',
	stylesString: '.target-1 { opacity: 0; }',
	inTransitionString: '.target-1 { transition: opacity 0.3s ease; }',
	outTransitionString: '.target-1 { transition: opacity 0.3s ease; }',
	sids: ['opacity'],
	effects: [{ transitionTarget: [''], hoverStatus: false }],
	attributes: [{ opacity: 0 }],
	setIsPreview: jest.fn(),
	enableStaticStartState: jest.fn(),
	removePreviousStylesAndTransitions: jest.fn(),
	...overrides,
});

describe('syncRelationInstances', () => {
	it('reuses equivalent preview instances without resetting active preview styles', () => {
		const firstRelation = makeRelation();

		const firstSync = syncRelationInstances({
			previousRelationInstances: null,
			nextRelationInstances: [firstRelation],
			shouldRenderRelations: true,
			isPreview: true,
			staticState: 'start',
		});

		expect(firstRelation.setIsPreview).toHaveBeenCalledTimes(1);
		expect(firstRelation.setIsPreview).toHaveBeenCalledWith(true, {
			staticState: 'start',
		});

		const equivalentNextRelation = makeRelation();
		const secondSync = syncRelationInstances({
			previousRelationInstances: firstSync.relationInstances,
			nextRelationInstances: [equivalentNextRelation],
			shouldRenderRelations: true,
			isPreview: true,
			staticState: 'start',
		});

		expect(secondSync.relationInstances).toEqual([firstRelation]);
		expect(firstRelation.setIsPreview).toHaveBeenCalledTimes(1);
		expect(firstRelation.enableStaticStartState).not.toHaveBeenCalled();
		expect(equivalentNextRelation.setIsPreview).not.toHaveBeenCalled();
		expect(
			equivalentNextRelation.removePreviousStylesAndTransitions
		).not.toHaveBeenCalled();
	});

	it('cleans the previous instance and applies preview when relation output changes', () => {
		const previousRelation = makeRelation();
		const changedRelation = makeRelation({
			stylesString: '.target-1 { opacity: 0.5; }',
		});

		const sync = syncRelationInstances({
			previousRelationInstances: [previousRelation],
			nextRelationInstances: [changedRelation],
			shouldRenderRelations: true,
			isPreview: true,
			staticState: 'start',
		});

		expect(sync.relationInstances).toEqual([changedRelation]);
		expect(
			previousRelation.removePreviousStylesAndTransitions
		).toHaveBeenCalledTimes(1);
		expect(changedRelation.setIsPreview).toHaveBeenCalledWith(true, {
			staticState: 'start',
		});
	});

	it('returns to static start and drops instances when relations should not render', () => {
		const previousRelation = makeRelation();

		const sync = syncRelationInstances({
			previousRelationInstances: [previousRelation],
			nextRelationInstances: null,
			shouldRenderRelations: false,
			isPreview: false,
			staticState: 'start',
		});

		expect(sync.relationInstances).toBeNull();
		expect(previousRelation.enableStaticStartState).toHaveBeenCalledTimes(1);
		expect(
			previousRelation.removePreviousStylesAndTransitions
		).not.toHaveBeenCalled();
	});

	it('reuses equivalent static end instances without reapplying the state every render', () => {
		const previousRelation = makeRelation();

		const firstSync = syncRelationInstances({
			previousRelationInstances: null,
			nextRelationInstances: [previousRelation],
			shouldRenderRelations: true,
			isPreview: false,
			staticState: 'end',
		});

		expect(previousRelation.setIsPreview).toHaveBeenCalledTimes(1);

		const equivalentNextRelation = makeRelation();
		const secondSync = syncRelationInstances({
			previousRelationInstances: firstSync.relationInstances,
			nextRelationInstances: [equivalentNextRelation],
			shouldRenderRelations: true,
			isPreview: false,
			staticState: 'end',
		});

		expect(secondSync.relationInstances).toEqual([previousRelation]);
		expect(previousRelation.setIsPreview).toHaveBeenCalledTimes(1);
		expect(equivalentNextRelation.setIsPreview).not.toHaveBeenCalled();
	});

	it('reuses the instance but reapplies state when switching from preview to static end', () => {
		const previousRelation = makeRelation();

		const previewSync = syncRelationInstances({
			previousRelationInstances: null,
			nextRelationInstances: [previousRelation],
			shouldRenderRelations: true,
			isPreview: true,
			staticState: 'start',
		});

		const equivalentNextRelation = makeRelation();
		const endSync = syncRelationInstances({
			previousRelationInstances: previewSync.relationInstances,
			nextRelationInstances: [equivalentNextRelation],
			shouldRenderRelations: true,
			isPreview: false,
			staticState: 'end',
		});

		expect(endSync.relationInstances).toEqual([previousRelation]);
		expect(previousRelation.setIsPreview).toHaveBeenCalledTimes(2);
		expect(previousRelation.setIsPreview).toHaveBeenLastCalledWith(false, {
			staticState: 'end',
		});
		expect(equivalentNextRelation.setIsPreview).not.toHaveBeenCalled();
	});

	it('removes previous instances that are no longer rendered', () => {
		const keptRelation = makeRelation({ id: 'relation-1' });
		const removedRelation = makeRelation({ id: 'relation-2' });
		const nextKeptRelation = makeRelation({ id: 'relation-1' });

		const sync = syncRelationInstances({
			previousRelationInstances: [keptRelation, removedRelation],
			nextRelationInstances: [nextKeptRelation],
			shouldRenderRelations: true,
			isPreview: false,
			staticState: 'end',
		});

		expect(sync.relationInstances).toEqual([keptRelation]);
		expect(removedRelation.removePreviousStylesAndTransitions).toHaveBeenCalledTimes(
			1
		);
	});
});
