import getPreviewState, {
	RELATION_PREVIEW_STATE_END,
	RELATION_PREVIEW_STATE_START,
} from '@extensions/relations/getPreviewState';

describe('getPreviewState', () => {
	const relations = [
		{ id: 1, title: 'First' },
		{ id: 2, title: 'Second' },
		{ id: 3, title: 'Third' },
	];

	it('renders only selected relations as a static end state when preview is off', () => {
		expect(
			getPreviewState({
				relations,
				isPreview: false,
				selectedState: RELATION_PREVIEW_STATE_END,
				selectedRelationIds: [2, 3],
			})
		).toEqual({
			isPreview: false,
			shouldRenderRelations: true,
			staticState: RELATION_PREVIEW_STATE_END,
			relations: [relations[1], relations[2]],
		});
	});

	it('renders all relations as animated preview when preview is on', () => {
		expect(
			getPreviewState({
				relations,
				isPreview: true,
				selectedState: RELATION_PREVIEW_STATE_END,
				selectedRelationIds: [2],
			})
		).toEqual({
			isPreview: true,
			shouldRenderRelations: true,
			staticState: RELATION_PREVIEW_STATE_START,
			relations,
		});
	});

	it('does not render relations while the static start state is selected', () => {
		expect(
			getPreviewState({
				relations,
				isPreview: false,
				selectedState: RELATION_PREVIEW_STATE_START,
				selectedRelationIds: [2],
			})
		).toEqual({
			isPreview: false,
			shouldRenderRelations: false,
			staticState: RELATION_PREVIEW_STATE_START,
			relations: [],
		});
	});
});
