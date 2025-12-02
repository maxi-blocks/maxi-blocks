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

	const totalStartTime = performance.now();

	const { uniqueID } = blockAttributes;
	const targetUniqueID =
		blockEditor.getBlockAttributes(blockTargetClientId)?.uniqueID;
	const triggerUniqueID =
		blockEditor.getBlockAttributes(blockTriggerClientId)?.uniqueID;
	const newRelations = [];

	// Performance tracking for each phase
	let cleanAttributesTime = 0;
	let stylesObjTime = 0;
	let stylesGenTime = 0;
	let bgLayersTime = 0;
	let processedRelations = 0;

	const loopStartTime = performance.now();

	for (const item of Object.values(relations)) {
		if (isEmpty(item.attributes)) {
			// Skip items with empty attributes
		} else if (item.uniqueID !== uniqueID) {
			newRelations.push(item);
		} else {
			processedRelations += 1;

			const settingsStartTime = performance.now();
			const selectedSettings = getSelectedIBSettings(
				blockTargetClientId,
				item.sid
			);
			const settingsDuration = performance.now() - settingsStartTime;

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
				const bgStartTime = performance.now();
				const relationBGLayers =
					relationsAttributes['background-layers'];
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
				bgLayersTime += performance.now() - bgStartTime;
			}

			const cleanStartTime = performance.now();
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
			cleanAttributesTime += performance.now() - cleanStartTime;

			const mergeStartTime = performance.now();
			const mergedAttributes = merge(
				{},
				cleanAttributesObject,
				tempAttributes
			);
			const mergeDuration = performance.now() - mergeStartTime;

			const stylesObjStartTime = performance.now();
			const stylesObj = getIBStylesObj({
				clientId: blockTargetClientId,
				sid: item.sid,
				attributes: mergedAttributes,
				blockAttributes,
				breakpoint,
			});
			stylesObjTime += performance.now() - stylesObjStartTime;

			const stylesStartTime = performance.now();
			const styles = getIBStyles({
				stylesObj,
				blockAttributes,
				isFirst: true,
			});
			stylesGenTime += performance.now() - stylesStartTime;

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

			// Log individual relation processing if it's slow
			const itemTotalTime = performance.now() - settingsStartTime;
			if (itemTotalTime > 20) {
				// eslint-disable-next-line no-console
				console.log(
					`[MaxiBlocks Relations] SLOW relation processing for ${triggerUniqueID} (sid: ${item.sid})`,
					JSON.stringify({
						duration: `${itemTotalTime.toFixed(2)}ms`,
						settingsDuration: `${settingsDuration.toFixed(2)}ms`,
						mergeDuration: `${mergeDuration.toFixed(2)}ms`,
						sid: item.sid,
					})
				);
			}
		}
	}

	const loopDuration = performance.now() - loopStartTime;

	const diffStartTime = performance.now();
	const hasDiff = !isEmpty(diff(relations, newRelations));
	const diffDuration = performance.now() - diffStartTime;

	if (hasDiff) {
		const totalDuration = performance.now() - totalStartTime;

		// Collect performance data for batch logging
		const performanceData = {
			totalDuration,
			loopDuration,
			cleanAttributesTime,
			stylesObjTime,
			stylesGenTime,
			bgLayersTime,
			diffDuration,
			processedRelations,
			totalRelations: Object.values(relations).length,
			newRelationsSize: JSON.stringify(newRelations).length,
			triggerUniqueID,
			targetUniqueID,
		};

		// Add to batch queue instead of immediate update
		batchRelationsUpdater.addUpdate(
			blockTriggerClientId,
			newRelations,
			performanceData
		);

		// Log individual processing if it was slow (before batching)
		if (totalDuration > 20) {
			// eslint-disable-next-line no-console
			console.log(
				`[MaxiBlocks Relations] Queued for batch: ${triggerUniqueID} ← ${targetUniqueID}`,
				JSON.stringify({
					processingTime: `${totalDuration.toFixed(2)}ms`,
					loopDuration: `${loopDuration.toFixed(2)}ms`,
					cleanAttributesTime: `${cleanAttributesTime.toFixed(2)}ms`,
					stylesObjTime: `${stylesObjTime.toFixed(2)}ms`,
					stylesGenTime: `${stylesGenTime.toFixed(2)}ms`,
					bgLayersTime: `${bgLayersTime.toFixed(2)}ms`,
					diffDuration: `${diffDuration.toFixed(2)}ms`,
					processedRelations,
					totalRelations: Object.values(relations).length,
					newRelationsSize: JSON.stringify(newRelations).length,
					batchQueueSize: batchRelationsUpdater.getPendingCount(),
				})
			);
		}
	}
};

export default updateRelationsRemotely;
