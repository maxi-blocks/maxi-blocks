/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, select } from '@wordpress/data';
import { useRef, useEffect, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import ListControl from '@components/list-control';
import ListItemControl from '@components/list-control/list-item-control';
import SelectControl from '@components/select-control';
import SettingTabsControl from '@components/setting-tabs-control';
import TextControl from '@components/text-control';
import TransitionControl from '@components/transition-control';
import BlockSelectControl from './BlockSelectControl';
import { createTransitionObj, getGroupAttributes } from '@extensions/styles';
import getClientIdFromUniqueId from '@extensions/attributes/getClientIdFromUniqueId';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';
import getCleanResponseIBAttributes from '@extensions/relations/getCleanResponseIBAttributes';
import getIBOptionsFromBlockData from '@extensions/relations/getIBOptionsFromBlockData';
import { getSelectedIBSettings } from '@extensions/relations/utils';
import getIBStylesObj from '@extensions/relations/getIBStylesObj';
import getIBStyles from '@extensions/relations/getIBStyles';
import getCleanDisplayIBAttributes from '@extensions/relations/getCleanDisplayIBAttributes';

/**
 * External dependencies
 */
import { cloneDeep, isEmpty, isEqual, isNil, omitBy } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const RelationControl = props => {
	const { getBlock } = select('core/block-editor');
	const { updateBlockAttributes } = useDispatch('core/block-editor');

	// UseRef to prevent infinite loops during attribute updates
	const isUpdating = useRef(false);

	// Track highlighted blocks for cleanup
	const highlightedBlocks = useRef(new Set());

	const {
		deviceType,
		isButton,
		onChange,
		relations: rawRelations,
		uniqueID,
	} = props;

	const handleHighlight = (uid, isHighlighting) => {
		if (!uid) return;
		const targetClientId = getClientIdFromUniqueId(uid);
		if (!targetClientId) return;

		const blockElement = document.querySelector(
			`[data-block="${targetClientId}"]`
		);
		if (blockElement) {
			if (isHighlighting) {
				blockElement.classList.add('maxi-block--highlighted');
				highlightedBlocks.current.add(targetClientId);
			} else {
				blockElement.classList.remove('maxi-block--highlighted');
				highlightedBlocks.current.delete(targetClientId);
			}
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			highlightedBlocks.current.forEach(clientId => {
				const blockElement = document.querySelector(
					`[data-block="${clientId}"]`
				);
				if (blockElement) {
					blockElement.classList.remove('maxi-block--highlighted');
				}
			});
		};
	}, []);

	const relations = useMemo(
		() =>
			(rawRelations || []).filter(
				r => isEmpty(r.uniqueID) || !!getClientIdFromUniqueId(r.uniqueID)
			),
		[rawRelations]
	);

	useEffect(() => {
		if (!rawRelations) return;
		if (rawRelations.length !== relations.length) {
			onChange({ relations });
		}
	}, [rawRelations, relations, onChange]);

	const getRelationId = rels =>
		rels.length ? Math.max(...rels.map(r => r.id || 0)) + 1 : 1;

	const onChangeRelation = (rels, id, obj) => {
		const newRels = cloneDeep(rels).map(r =>
			r.id === id ? { ...r, ...obj } : r
		);
		onChange({ relations: newRels });
	};

	/**
	 * FIX: Proper Deletion Logic
	 * Ensures the filtered array is passed to onChange and resets preview if empty
	 */
	const onRemoveRelation = id => {
		const removedRelation = relations.find(relation => relation.id === id);
		if (removedRelation?.uniqueID) {
			handleHighlight(removedRelation.uniqueID, false);
		}

		// 1. Create a clean filtered array
		const newRelations = relations.filter(relation => relation.id !== id);

		// 2. Prepare the update object
		const updateObj = {
			relations: newRelations,
		};

		// 3. If no interactions left, kill the preview mode
		if (newRelations.length === 0) {
			updateObj['relations-preview'] = false;
		}

		// 4. Dispatch the change
		onChange(updateObj);
	};

	// Simplified block list logic
	const getBlocksToAffect = () => {
		const arr = [];
		goThroughMaxiBlocks(block => {
			if (block.attributes.customLabel) {
				arr.push({
					label:
						block.attributes.uniqueID === uniqueID
							? `${block.attributes.customLabel} (Current)`
							: block.attributes.customLabel,
					value: block.attributes.uniqueID,
				});
			}
		});
		return arr;
	};

	/**
	 * FIX: Deep Equality Sync
	 * Uses isEqual for nested object comparison to prevent false positives
	 */
	const displayBeforeSetting = item => {
		const targetClientId = getClientIdFromUniqueId(item.uniqueID);
		const selectedSettings = getSelectedIBSettings(targetClientId, item.sid);
		const currentActualAttributes = select('core/block-editor').getBlockAttributes(
			targetClientId
		);

		if (!selectedSettings || !currentActualAttributes) return null;

		const attributesWithId = {
			...currentActualAttributes,
			uniqueID: currentActualAttributes?.uniqueID ?? item.uniqueID,
		};

		return selectedSettings.component({
			...currentActualAttributes,
			...getGroupAttributes(
				currentActualAttributes,
				selectedSettings.attrGroupName,
				false,
				selectedSettings?.prefix || ''
			),
			attributes: attributesWithId,
			blockAttributes: currentActualAttributes,
			onChange: newValues => {
				if (isUpdating.current) return;

				const { isReset, ...cleanValues } = newValues || {};

				// USE DEEP EQUALITY: Prevents false positives with nested objects
				const hasChanged = Object.keys(cleanValues).some(
					key => !isEqual(cleanValues[key], currentActualAttributes[key])
				);

				if (hasChanged) {
					try {
						isUpdating.current = true;
						updateBlockAttributes(targetClientId, cleanValues);
					} finally {
						// Release lock immediately after the dispatch call
						isUpdating.current = false;
					}
				}
			},
			prefix: selectedSettings?.prefix || '',
			breakpoint: deviceType,
			clientId: targetClientId,
		});
	};

	const displaySelectedSetting = item => {
		const targetClientId = getClientIdFromUniqueId(item.uniqueID);
		const selectedSettings = getSelectedIBSettings(targetClientId, item.sid);
		const blockAttributes = cloneDeep(getBlock(targetClientId)?.attributes);

		if (!selectedSettings || !blockAttributes) return null;

		const mergedAttributes = getCleanDisplayIBAttributes(
			blockAttributes,
			item.attributes
		);
		const attributesWithId = {
			...mergedAttributes,
			uniqueID: mergedAttributes?.uniqueID ?? item.uniqueID,
		};

		return selectedSettings.component({
			...blockAttributes,
			...getGroupAttributes(
				mergedAttributes,
				selectedSettings.attrGroupName,
				false,
				selectedSettings?.prefix || ''
			),
			attributes: attributesWithId,
			onChange: obj => {
				const newAttributesObj = { ...item.attributes, ...obj };
				const { cleanAttributesObject } = getCleanResponseIBAttributes(
					newAttributesObj,
					blockAttributes,
					item.uniqueID,
					selectedSettings,
					deviceType,
					selectedSettings?.prefix || '',
					item.sid,
					targetClientId
				);
				const stylesObj = getIBStylesObj({
					clientId: targetClientId,
					sid: item.sid,
					attributes: omitBy(cleanAttributesObject, isNil),
					blockAttributes,
					breakpoint: deviceType,
				});
				const styles = getIBStyles({
					stylesObj,
					blockAttributes,
					isFirst: true,
				});
				onChangeRelation(relations, item.id, {
					attributes: omitBy(cleanAttributesObject, isNil),
					css: styles,
				});
			},
			prefix: selectedSettings?.prefix || '',
			breakpoint: deviceType,
			clientId: targetClientId,
		});
	};

	return (
		<div className='maxi-relation-control'>
			<Button
				variant='secondary'
				onClick={() =>
					onChange({
						relations: [
							...relations,
							{
								id: getRelationId(relations),
								title: '',
								uniqueID: '',
								target: '',
								action: '',
								sid: '',
								attributes: {},
								css: {},
								effects: createTransitionObj(),
								isButton,
							},
						],
					})
				}
			>
				{__('Add new interaction', 'maxi-blocks')}
			</Button>

			{!isEmpty(relations) && (
				<ListControl>
					{relations.map(item => (
						<ListItemControl
							key={item.id}
							title={
								item.title ||
								__('Untitled interaction', 'maxi-blocks')
							}
							onMouseEnter={() =>
								handleHighlight(item.uniqueID, true)
							}
							onMouseLeave={() =>
								handleHighlight(item.uniqueID, false)
							}
							content={
								<div className='maxi-relation-control__item__content'>
									<TextControl
										label={__('Name', 'maxi-blocks')}
										value={item.title}
										onChange={v =>
											onChangeRelation(relations, item.id, {
												title: v,
											})
										}
									/>
									<BlockSelectControl
										label={__('Block to affect', 'maxi-blocks')}
										value={item.uniqueID}
										options={[
											{
												label: __(
													'Select block…',
													'maxi-blocks'
												),
												value: '',
											},
											...getBlocksToAffect(),
										]}
										onOptionHover={handleHighlight}
										onChange={v =>
											onChangeRelation(relations, item.id, {
												uniqueID: v,
											})
										}
									/>
									<SelectControl
										label={__('Action', 'maxi-blocks')}
										value={item.action}
										options={[
											{
												label: __(
													'Choose action',
													'maxi-blocks'
												),
												value: '',
											},
											{
												label: __(
													'On click',
													'maxi-blocks'
												),
												value: 'click',
											},
											{
												label: __(
													'On hover',
													'maxi-blocks'
												),
												value: 'hover',
											},
										]}
										onChange={v =>
											onChangeRelation(relations, item.id, {
												action: v,
											})
										}
									/>
									{item.uniqueID && (
										<SelectControl
											label={__('Settings', 'maxi-blocks')}
											value={item.sid}
											options={getParsedOptions(
												getIBOptionsFromBlockData(
													getClientIdFromUniqueId(
														item.uniqueID
													)
												)
											)}
											onChange={v =>
												onChangeRelation(relations, item.id, {
													sid: v,
												})
											}
										/>
									)}
									{item.uniqueID && item.sid && (
										<SettingTabsControl
											deviceType={deviceType}
											items={[
												{
													label: __(
														'Current',
														'maxi-blocks'
													),
													content: displayBeforeSetting(item),
												},
												{
													label:
														item.action === 'hover'
															? __(
																	'On hover',
																	'maxi-blocks'
															)
															: __(
																	'On click',
																	'maxi-blocks'
															),
													content: displaySelectedSetting(item),
												},
												{
													label: __(
														'Effects',
														'maxi-blocks'
													),
													content: (
														<TransitionControl
															transition={item.effects}
															breakpoint={deviceType}
															onChange={obj =>
																onChangeRelation(
																	relations,
																	item.id,
																	{
																		effects: {
																			...item.effects,
																			...obj,
																		},
																	}
																)
															}
														/>
													),
												},
											]}
										/>
									)}
								</div>
							}
							onRemove={() => onRemoveRelation(item.id)}
						/>
					))}
				</ListControl>
			)}
		</div>
	);
};

// Helper for select options
const getParsedOptions = rawOptions => {
	if (!rawOptions) return [];
	const options = [];
	Object.entries(rawOptions).forEach(([group, opts]) => {
		opts.forEach(opt =>
			options.push({ label: `${group}: ${opt.label}`, value: opt.sid })
		);
	});
	return options;
};

export default RelationControl;
