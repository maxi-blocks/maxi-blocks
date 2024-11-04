/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getCleanResponseIBAttributes from './getCleanResponseIBAttributes';
import { getSelectedIBSettings } from './utils';
import getIBStyles from './getIBStyles';
import getIBStylesObj from './getIBStylesObj';

/**
 * External dependencies
 */
import { diff } from 'deep-object-diff';
import { isEmpty, merge } from 'lodash';

const updateRelationsRemotely = ({
	blockTriggerClientId,
	blockTargetClientId,
	blockAttributes,
	breakpoint,
}) => {
	if (blockTriggerClientId === blockTargetClientId) return;

	// Block trigger relations
	const relations =
		select('core/block-editor')?.getBlockAttributes(
			blockTriggerClientId
		)?.relations;

	if (!relations) return;

	const newRelations = [];

	const { uniqueID } = blockAttributes;

	Object.values(relations).forEach(item => {
		if (isEmpty(item.attributes)) return;

		if (item.uniqueID !== uniqueID) {
			newRelations.push(item);

			return;
		}

		const selectedSettings = getSelectedIBSettings(
			blockTargetClientId,
			item.sid
		);

		const prefix = selectedSettings?.prefix || '';

		const relationsAttributes = item.attributes || {};

		// In case relation attributes contain background layers, check if there are the same
		// amount of layers in the block attributes. If not, remove the relation attributes.
		if (item.sid === 'bgl') {
			const relationBGLayers = relationsAttributes['background-layers'];
			const blockBGLayers = blockAttributes['background-layers'];

			if (
				relationBGLayers &&
				blockBGLayers &&
				relationBGLayers.length !== blockBGLayers.length
			) {
				if (blockBGLayers.length === 0)
					relationsAttributes['background-layers'] = [];
				else {
					relationBGLayers.forEach(({ id }) => {
						const index = blockBGLayers.findIndex(
							({ id: blockId }) => blockId === id
						);

						if (index === -1)
							relationsAttributes['background-layers'] =
								relationsAttributes['background-layers'].filter(
									({ id: relationId }) => relationId !== id
								);
					});
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

		const styles = getIBStyles({
			stylesObj: getIBStylesObj({
				clientId: blockTargetClientId,
				sid: item.sid,
				attributes: merge({}, cleanAttributesObject, tempAttributes),
				blockAttributes,
				breakpoint,
			}),
			blockAttributes,
			isFirst: true,
		});

		newRelations.push({
			...item,
			attributes: { ...item.attributes, ...cleanAttributesObject },
			css: styles,
			...(item.sid === 't' && {
				effects: {
					...item.effects,
					transitionTarget: Object.keys(styles),
				},
			}),
		});
	});

	if (!isEmpty(diff(relations, newRelations))) {
		const {
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
			updateBlockAttributes,
		} = dispatch('core/block-editor');

		markNextChangeAsNotPersistent();
		updateBlockAttributes(blockTriggerClientId, {
			relations: newRelations,
		});

		const getUniqueID = clientID =>
			select('core/block-editor').getBlockAttributes(clientID).uniqueID;

		// eslint-disable-next-line no-console
		console.log(
			`Relations updated for ${getUniqueID(
				blockTriggerClientId
			)} as a result of ${getUniqueID(
				blockTargetClientId
			)} change. The new 'relations' attribute is: `,
			newRelations
		);
	}
};

export default updateRelationsRemotely;
