/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getCleanResponseIBAttributes from './getCleanResponseIBAttributes';
import { getSelectedIBSettings } from './utils';
import getIBStyles from './getIBStyles';
import getIBStylesObj from './getIBStylesObj';
import batchRelationsUpdater from './batchRelationsUpdater';

/**
 * External dependencies
 */
import { diff } from 'deep-object-diff';
import { isEmpty, merge } from 'lodash';

// Constants
const BLOCK_EDITOR = 'core/block-editor';
const BGL_SID = 'bgl';
const TRANSITION_SID = 't';

const updateRelationsRemotely = ({
	blockTriggerClientId,
	blockTargetClientId,
	blockAttributes,
	breakpoint,
}) => {
	if (blockTriggerClientId === blockTargetClientId) return;

	const blockEditor = select(BLOCK_EDITOR);
	const relations =
		blockEditor?.getBlockAttributes(blockTriggerClientId)?.relations;
	if (!relations) return;

	const { uniqueID } = blockAttributes;
	const newRelations = [];

	for (const item of Object.values(relations)) {
		if (isEmpty(item.attributes)) {
			// Preserve empty relations so in-progress IB setups aren't discarded
			newRelations.push(item);
			// eslint-disable-next-line no-continue
			continue;
		}

		if (item.uniqueID !== uniqueID) {
			newRelations.push(item);
			// eslint-disable-next-line no-continue
			continue;
		}

		const selectedSettings = getSelectedIBSettings(
			blockTargetClientId,
			item.sid
		);

		// Skip if selectedSettings is undefined (no matching option found)
		if (!selectedSettings) {
			// eslint-disable-next-line no-console
			console.warn(
				`Skipping relation processing for sid: ${item.sid} - no matching settings found`
			);
			// eslint-disable-next-line no-continue
			continue;
		}

		const prefix = selectedSettings?.prefix || '';
		const relationsAttributes = item.attributes || {};

		// Handle background layers special case
		if (item.sid === BGL_SID) {
			const relationBGLayers = relationsAttributes['background-layers'];
			const blockBGLayers = blockAttributes['background-layers'];

			if (
				relationBGLayers &&
				blockBGLayers &&
				relationBGLayers.length !== blockBGLayers.length
			) {
				if (blockBGLayers.length === 0) {
					relationsAttributes['background-layers'] = [];
				} else {
					// Use Set for O(1) lookup
					const blockLayerIds = new Set(
						blockBGLayers.map(layer => layer.id)
					);
					relationsAttributes['background-layers'] =
						relationBGLayers.filter(layer =>
							blockLayerIds.has(layer.id)
						);
				}
			}
		}

		const { cleanAttributesObject, tempAttributes } =
			getCleanResponseIBAttributes(
				item.attributes,
				blockAttributes,
				item.uniqueID,
				selectedSettings,
				breakpoint,
				prefix,
				item.sid,
				blockTriggerClientId
			);

		const mergedAttributes = merge(
			{},
			cleanAttributesObject,
			tempAttributes
		);

		const stylesObj = getIBStylesObj({
			clientId: blockTargetClientId,
			sid: item.sid,
			attributes: mergedAttributes,
			blockAttributes,
			breakpoint,
		});

		const styles = getIBStyles({
			stylesObj,
			blockAttributes,
			isFirst: true,
		});

		const newItem = {
			...item,
			attributes: { ...item.attributes, ...cleanAttributesObject },
			css: styles,
		};

		// Handle transition effects
		if (item.sid === TRANSITION_SID) {
			newItem.effects = {
				...item.effects,
				transitionTarget: Object.keys(styles),
			};
		}

		newRelations.push(newItem);
	}

	const diffResult = diff(relations, newRelations);
	const hasDiff = !isEmpty(diffResult);

	if (hasDiff) {
		// Add to batch queue instead of immediate update
		batchRelationsUpdater.addUpdate(blockTriggerClientId, newRelations);
	}
};

export default updateRelationsRemotely;
