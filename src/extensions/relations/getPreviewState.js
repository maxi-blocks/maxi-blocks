export const RELATION_PREVIEW_STATE_START = 'start';
export const RELATION_PREVIEW_STATE_END = 'end';

const getSelectedRelationIds = selectedRelationIds =>
	new Set((selectedRelationIds || []).map(id => String(id)));

const getSelectedRelations = (relations, selectedRelationIds) => {
	const relationIds = getSelectedRelationIds(selectedRelationIds);

	if (!relationIds.size) return [];

	return (relations || []).filter(relation =>
		relationIds.has(String(relation.id))
	);
};

const getPreviewState = ({
	relations = [],
	isPreview = false,
	selectedState = RELATION_PREVIEW_STATE_START,
	selectedRelationIds = [],
}) => {
	if (isPreview) {
		return {
			isPreview: true,
			shouldRenderRelations: true,
			staticState: RELATION_PREVIEW_STATE_START,
			relations,
		};
	}

	if (selectedState === RELATION_PREVIEW_STATE_END) {
		const selectedRelations = getSelectedRelations(
			relations,
			selectedRelationIds
		);

		return {
			isPreview: false,
			shouldRenderRelations: selectedRelations.length > 0,
			staticState: RELATION_PREVIEW_STATE_END,
			relations: selectedRelations,
		};
	}

	return {
		isPreview: false,
		shouldRenderRelations: false,
		staticState: RELATION_PREVIEW_STATE_START,
		relations: [],
	};
};

export default getPreviewState;
