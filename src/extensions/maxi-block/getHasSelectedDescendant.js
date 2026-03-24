/**
 * True when any selected block (single or multi) is a descendant of `ancestorClientId`.
 * Equivalent to deep `hasSelectedInnerBlock( ancestorClientId, true )` but uses the
 * selection + parent map only, avoiding recursive `getBlockOrder` reads that subscribe
 * to every inner list (and can re-run when sibling lists change even if the boolean
 * result is unchanged).
 *
 * @param {Function} registrySelect - `select` from the useSelect callback (registry.select).
 * @param {string}   ancestorClientId - Block client id.
 * @return {boolean}
 */
function getHasSelectedDescendant(registrySelect, ancestorClientId) {
	const {
		getBlockSelectionStart,
		getMultiSelectedBlockClientIds,
		getBlockParents,
	} = registrySelect('core/block-editor');

	const multiSelected = getMultiSelectedBlockClientIds();
	const selectedClientIds =
		multiSelected.length > 0
			? multiSelected
			: (() => {
					const start = getBlockSelectionStart();
					return start ? [start] : [];
			  })();

	for (let i = 0; i < selectedClientIds.length; i += 1) {
		const selectedId = selectedClientIds[i];
		const parentsAscending = getBlockParents(selectedId, true);
		if (parentsAscending.includes(ancestorClientId)) {
			return true;
		}
	}

	return false;
}

export default getHasSelectedDescendant;
