/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
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
import ToggleSwitch from '@components/toggle-switch';
import TransitionControl from '@components/transition-control';
import BlockSelectControl from './BlockSelectControl';
import { createTransitionObj, getGroupAttributes } from '@extensions/styles';
import getClientIdFromUniqueId from '@extensions/attributes/getClientIdFromUniqueId';
import { getSiteEditorIframeBody } from '@extensions/fse';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';
import getCleanResponseIBAttributes from '@extensions/relations/getCleanResponseIBAttributes';
import getIBOptionsFromBlockData from '@extensions/relations/getIBOptionsFromBlockData';
import { getSelectedIBSettings } from '@extensions/relations/utils';
import getIBStylesObj from '@extensions/relations/getIBStylesObj';
import getIBStyles from '@extensions/relations/getIBStyles';

/**
 * External dependencies
 */
import {
	capitalize,
	cloneDeep,
	isEmpty,
	isEqual,
	isNil,
	merge,
	omitBy,
} from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const RelationControl = props => {
	const {
		updateBlockAttributes,
		__unstableMarkNextChangeAsNotPersistent: markNextChangeAsNotPersistent,
	} = useDispatch('core/block-editor');

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

	const relations = useMemo(
		() =>
			(rawRelations || []).filter(
				r => isEmpty(r.uniqueID) || !!getClientIdFromUniqueId(r.uniqueID)
			),
		[rawRelations]
	);

	const blockAttributesByClientId = useSelect(
		selectFn => {
			const { getBlockAttributes } = selectFn('core/block-editor');
			const attributesMap = new Map();

			relations.forEach(relation => {
				const clientId = getClientIdFromUniqueId(relation.uniqueID);
				if (clientId) {
					attributesMap.set(clientId, getBlockAttributes(clientId));
				}
			});

			return attributesMap;
		},
		[relations]
	);

	const transitionDefaultAttributes = createTransitionObj();
	const getDefaultTransitionAttribute = target =>
		transitionDefaultAttributes[`${target}-${deviceType}`];

	const getBlockElement = clientId => {
		const iframeBody = getSiteEditorIframeBody();
		const searchContexts = [iframeBody, document].filter(Boolean);

		return searchContexts
			.map(context => context.querySelector(`[data-block="${clientId}"]`))
			.find(Boolean);
	};

	const handleHighlight = (uid, isHighlighting) => {
		if (!uid) return;
		const targetClientId = getClientIdFromUniqueId(uid);
		if (!targetClientId) return;

		const blockElement = getBlockElement(targetClientId);
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
				const blockElement = getBlockElement(clientId);
				if (blockElement) {
					blockElement.classList.remove('maxi-block--highlighted');
				}
			});
		};
	}, []);

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
		const currentActualAttributes =
			blockAttributesByClientId.get(targetClientId);

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
					} catch (error) {
						// eslint-disable-next-line no-console
						console.error(
							'Failed to update relation block attributes:',
							error
						);
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

	const onAddRelation = () => {
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
		});
	};

	const displaySelectedSetting = item => {
		const targetClientId = getClientIdFromUniqueId(item.uniqueID);
		const selectedSettings = getSelectedIBSettings(targetClientId, item.sid);
		const blockAttributes = blockAttributesByClientId.get(targetClientId);

		if (!selectedSettings || !blockAttributes) return null;

		const mergedAttributes = merge(
			{},
			cloneDeep(blockAttributes),
			item.attributes
		);
		const attributesWithId = {
			...mergedAttributes,
			uniqueID: mergedAttributes?.uniqueID ?? item.uniqueID,
		};
		const blockAttributesWithId = {
			...cloneDeep(blockAttributes),
			uniqueID: blockAttributes?.uniqueID ?? item.uniqueID,
		};

		return (
			<div className='maxi-relation-control__interaction-setting'>
				{selectedSettings.component({
					...attributesWithId,
					...getGroupAttributes(
						mergedAttributes,
						selectedSettings.attrGroupName,
						false,
						selectedSettings?.prefix || ''
					),
					attributes: attributesWithId,
					blockAttributes: blockAttributesWithId,
					onChange: obj => {
						const newAttributesObj = { ...item.attributes, ...obj };
						const { cleanAttributesObject } =
							getCleanResponseIBAttributes(
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
				})}
			</div>
		);
	};

	return (
		<div className='maxi-relation-control'>
			{!isEmpty(relations) && (
				<ToggleSwitch
					label={__('Preview all interactions', 'maxi-blocks')}
					selected={props['relations-preview']}
					onChange={value => {
						markNextChangeAsNotPersistent();
						onChange({ 'relations-preview': value });
					}}
				/>
			)}
			<Button
				variant='secondary'
				onClick={onAddRelation}
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
											className='maxi-relation-control__interaction-tabs'
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
															getDefaultTransitionAttribute={
																getDefaultTransitionAttribute
															}
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

	const parseOptionsArray = options =>
		options?.map(({ sid, label }) => ({
			label,
			value: sid,
		})) ?? [];

	const defaultSetting = {
		label: __('Choose settings', 'maxi-blocks'),
		value: '',
	};

	const rawGroups = Object.keys(rawOptions);

	if (rawGroups.length > 1) {
		return {
			'': [defaultSetting],
			...Object.entries(rawOptions).reduce(
				(acc, [groupLabel, groupOptions]) => ({
					...acc,
					[capitalize(groupLabel)]: parseOptionsArray(groupOptions),
				}),
				{}
			),
		};
	}

	return [
		defaultSetting,
		...parseOptionsArray(rawOptions[rawGroups[0]]),
	];
};

export default RelationControl;
