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

const updateRelationsRemotely = async ({
	blockTriggerClientId,
	blockTargetClientId,
	blockAttributes,
	breakpoint,
}) => {
	// Block trigger relations
	const { relations } =
		select('core/block-editor').getBlockAttributes(blockTriggerClientId);

	if (!relations) return;

	const newRelations = [];
	let hasBeenUpdated = false;

	const { uniqueID } = blockAttributes;

	Object.entries(relations).forEach(([blockClientId, item]) => {
		if (item.uniqueID !== uniqueID) {
			newRelations.push(item);

			return;
		}

		hasBeenUpdated = true;

		const selectedSettings = getSelectedIBSettings(
			blockTargetClientId,
			item.sid
		);

		const prefix = selectedSettings?.prefix || '';

		const { cleanAttributesObject, tempAttributes } =
			getCleanResponseIBAttributes(
				item.attributes,
				blockAttributes,
				item.uniqueID,
				selectedSettings,
				breakpoint,
				prefix
			);

		const styles = getIBStyles({
			stylesObj: getIBStylesObj({
				clientId: blockTargetClientId,
				sid: item.sid,
				attributes: {
					...cleanAttributesObject,
					...tempAttributes,
				},
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

	if (hasBeenUpdated) {
		const {
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
			updateBlockAttributes,
		} = dispatch('core/block-editor');

		markNextChangeAsNotPersistent();
		updateBlockAttributes(blockTriggerClientId, {
			relations: newRelations,
		});
	}
};

export default updateRelationsRemotely;
