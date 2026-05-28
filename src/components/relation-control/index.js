/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { dispatch, useDispatch, useSelect, select } from '@wordpress/data';
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
import getHoverStatus from '@extensions/relations/getHoverStatus';
import { debugPreview as debugRelationPreview } from '@extensions/relations/debugPreview';
import SettingTabsIndicatorContext from '@extensions/indicators/context';
import {
	createEmptyRelation,
	getChangedRelationTargetUpdates,
	getCommonIBSettings,
	getHighlightableBlockElements,
	getRelationBlockOption,
	getRelationControlId,
	getRelationId,
	getRelationStaticStateUpdate,
	getSyncedRelationPreviewIds,
	groupRelations,
	mergeRelationStartAttributeUpdates,
	removeRelationGroup,
	revealRelationBlockElement,
	syncRelationGroupTargets,
	updateRelationsInGroup,
} from './utils';

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

	const {
		deviceType,
		isButton,
		onChange,
		relations: rawRelations,
		uniqueID,
	} = props;

	// UseRef to prevent infinite loops during attribute updates
	const isUpdating = useRef(false);
	const pendingStartAttributeUpdatesRef = useRef(null);
	const prevRawRelationsRef = useRef(rawRelations);

	useEffect(() => {
		if (prevRawRelationsRef.current !== rawRelations) {
			prevRawRelationsRef.current = rawRelations;
		}
	}, [rawRelations]);

	// Track highlighted blocks for cleanup
	const highlightedBlocks = useRef(new Set());
	const hoveredUniqueIdRef = useRef(null);
	const onChangeRef = useRef(null);
	const lastCleanedRef = useRef(null);

	const relations = useMemo(() => {
		const filtered = (rawRelations || []).filter(
			r => isEmpty(r.uniqueID) || !!getClientIdFromUniqueId(r.uniqueID)
		);
		return filtered;
	}, [rawRelations]);
	const relationGroups = useMemo(
		() => groupRelations(relations),
		[relations]
	);

	const blockDataByClientId = useSelect(
		selectFn => {
			const { getBlock } = selectFn('core/block-editor');
			const blockMap = new Map();

			relations.forEach(relation => {
				const clientId = getClientIdFromUniqueId(relation.uniqueID);
				if (clientId) {
					const block = getBlock(clientId);
					if (block) {
						blockMap.set(clientId, {
							attributes: block.attributes,
							name: block.name,
						});
					}
				}
			});

			return blockMap;
		},
		[relations]
	);

	const transitionDefaultAttributes = createTransitionObj();
	const getDefaultTransitionAttribute = target =>
		transitionDefaultAttributes[`${target}-${deviceType}`];

	const getBlockElements = clientId => {
		const iframeBody = getSiteEditorIframeBody();
		const searchContexts = [iframeBody, document].filter(Boolean);

		return getHighlightableBlockElements({
			clientId,
			searchContexts,
		});
	};

	const getTargetClientId = targetId => {
		if (!targetId) return null;

		return (
			select('core/block-editor').getBlock(targetId)?.clientId ||
			getClientIdFromUniqueId(targetId)
		);
	};

	const removeHighlightClass = blockElement => {
		blockElement.classList.remove('maxi-block--highlighted');
	};

	const handleHighlight = (targetId, isHighlighting) => {
		const targetClientId = getTargetClientId(targetId);
		if (!targetClientId) return;

		const blockElements = getBlockElements(targetClientId);
		if (blockElements.length) {
			blockElements.forEach(blockElement => {
				if (isHighlighting) {
					blockElement.classList.add('maxi-block--highlighted');
					return;
				}
				removeHighlightClass(blockElement);
			});

			if (isHighlighting) {
				highlightedBlocks.current.add(targetClientId);
			} else {
				highlightedBlocks.current.delete(targetClientId);
			}
		}
	};

	/**
	 * Reveals the target block on the canvas (scroll + pulse) and also
	 * opens the List View sidebar with the tree expanded to the target
	 * row highlighted. Does NOT select the block so the user keeps the
	 * current IB context.
	 */
	const handleReveal = targetId => {
		const targetClientId = getTargetClientId(targetId);
		if (!targetClientId) return;

		const [blockElement] = getBlockElements(targetClientId);
		revealRelationBlockElement(blockElement);

		const editorDispatch = dispatch('core/editor');
		const editPostDispatch = dispatch('core/edit-post');

		if (editorDispatch?.setIsListViewOpened) {
			editorDispatch.setIsListViewOpened(true);
		} else if (editPostDispatch?.setIsListViewOpened) {
			editPostDispatch.setIsListViewOpened(true);
		}

		const parents = select('core/block-editor').getBlockParents(
			targetClientId
		);
		const REVEAL_CLASS = 'maxi-block--list-view-revealed';

		const findRow = (tree, id) =>
			tree.querySelector(`a[href$="#block-${id}"]`)?.closest('tr');

		const expandedSet = new Set();

		const revealInListView = (attempt = 0) => {
			if (attempt > 30) return;

			const tree = document.querySelector(
				'.block-editor-list-view-tree'
			);
			if (!tree) {
				setTimeout(() => revealInListView(attempt + 1), 120);
				return;
			}

			// Expand one collapsed parent per pass
			for (let i = 0; i < parents.length; i++) {
				const pid = parents[i];
				if (expandedSet.has(pid)) continue;

				const row = findRow(tree, pid);
				if (!row) continue;

				const nextId =
					i < parents.length - 1
						? parents[i + 1]
						: targetClientId;

				if (findRow(tree, nextId)) continue;

				// This parent's child isn't visible yet — expand it
				const expander = row.querySelector(
					'.block-editor-list-view__expander'
				);
				if (!expander) continue;

				const svg = expander.querySelector('svg') || expander;
				svg.dispatchEvent(
					new MouseEvent('click', { bubbles: true, cancelable: true })
				);
				expandedSet.add(pid);

				console.log(JSON.stringify({
					event: 'listViewReveal:expanded',
					pid,
					attempt,
				}));

				setTimeout(() => revealInListView(attempt + 1), 200);
				return;
			}

			// All parents done — find and highlight the target
			const targetRow = findRow(tree, targetClientId);
			if (!targetRow) {
				setTimeout(() => revealInListView(attempt + 1), 200);
				return;
			}

			console.log(JSON.stringify({
				event: 'listViewReveal:found',
				attempt,
			}));

			targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
			targetRow.classList.add(REVEAL_CLASS);
			setTimeout(() => targetRow.classList.remove(REVEAL_CLASS), 2500);
		};

		setTimeout(() => revealInListView(), 300);
	};

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			for (const clientId of Array.from(highlightedBlocks.current)) {
				getBlockElements(clientId).forEach(removeHighlightClass);
			}
			highlightedBlocks.current.clear();
		};
	}, []);

	useEffect(() => {
		if (!rawRelations || !onChangeRef.current) return;

		// Only clean up relations if blocks were actually deleted
		// Don't trigger on every render or attribute change
		const hasInvalidRelations = rawRelations.some(
			r =>
				r.uniqueID &&
				!isEmpty(r.uniqueID) &&
				!getClientIdFromUniqueId(r.uniqueID)
		);

		if (hasInvalidRelations && rawRelations.length !== relations.length) {
			// Prevent infinite loop by checking if we've already processed this cleanup
			if (isEqual(lastCleanedRef.current, relations)) {
				return;
			}

			lastCleanedRef.current = cloneDeep(relations);
			onChangeRef.current({ relations });
		}
	}, [rawRelations, relations]);

	useEffect(() => {
		const currentHovered = hoveredUniqueIdRef.current;
		if (!currentHovered) return;
		handleHighlight(currentHovered, true);

		for (const clientId of Array.from(highlightedBlocks.current)) {
			const currentClientId = getTargetClientId(currentHovered);
			if (currentClientId && clientId === currentClientId) {
				continue;
			}
			getBlockElements(clientId).forEach(removeHighlightClass);
			highlightedBlocks.current.delete(clientId);
		}
	}, [relations]);

	const getBlockDataForClientId = clientId => {
		if (!clientId) return null;

		const cachedBlockData = blockDataByClientId.get(clientId);
		if (cachedBlockData) return cachedBlockData;

		const block = select('core/block-editor').getBlock(clientId);
		if (!block) return null;

		return {
			attributes: block.attributes,
			name: block.name,
		};
	};

	const getGroupOptions = relationGroup => {
		const optionsList = relationGroup.uniqueIDs
			.map(uid => getClientIdFromUniqueId(uid))
			.map(clientId => getIBOptionsFromBlockData(clientId))
			.filter(options => options && Object.keys(options).length);

		return getCommonIBSettings(optionsList);
	};

	const isSidAvailableForGroup = (sid, relationGroup, uniqueIDs) => {
		if (!sid) return true;

		const groupToCheck = {
			...relationGroup,
			uniqueIDs,
		};
		const commonOptions = getGroupOptions(groupToCheck);

		return Object.values(commonOptions)
			.flat()
			.some(option => option.sid === sid);
	};

	const normalizeRelationForTarget = relation => {
		if (!relation.uniqueID) return relation;
		if (!relation.sid) {
			return {
				...relation,
				target: '',
				attributes: {},
				css: {},
			};
		}

		const targetClientId = getClientIdFromUniqueId(relation.uniqueID);
		const blockData = getBlockDataForClientId(targetClientId);
		const blockAttributes = blockData?.attributes;
		const selectedSettings = getSelectedIBSettings(
			targetClientId,
			relation.sid
		);

		if (!targetClientId || !blockAttributes || !selectedSettings) {
			return {
				...relation,
				sid: '',
				target: '',
				attributes: {},
				css: {},
			};
		}

		const prefix = selectedSettings?.prefix || '';
		const { cleanAttributesObject, tempAttributes } =
			getCleanResponseIBAttributes(
				relation.attributes || {},
				blockAttributes,
				relation.uniqueID,
				selectedSettings,
				deviceType,
				prefix,
				relation.sid,
				targetClientId
			);
		const mergedAttributes = merge(
			{},
			cleanAttributesObject,
			tempAttributes
		);
		const stylesObj = getIBStylesObj({
			clientId: targetClientId,
			sid: relation.sid,
			attributes: mergedAttributes,
			blockAttributes,
			breakpoint: deviceType,
		});
		const styles = getIBStyles({
			stylesObj,
			blockAttributes,
			isFirst: true,
		});

		if (styles.xxl?.styles?.border === 'none') {
			delete styles.xxl.styles.border;
			if (Object.keys(styles.xxl.styles).length === 0) {
				delete styles.xxl;
			}
		}

		const newAttributes = omitBy(
			{
				...relation.attributes,
				...cleanAttributesObject,
			},
			isNil
		);

		Object.keys(newAttributes).forEach(key => {
			if (key.includes('-unit-') && newAttributes[key] === '') {
				newAttributes[key] = 'px';
			}
		});

		return {
			...relation,
			target: selectedSettings?.target || '',
			attributes: newAttributes,
			css: styles,
		};
	};

	const onChangeRelationGroup = (relationGroup, updates) => {
		const newRelations = updateRelationsInGroup(
			relations,
			relationGroup,
			updates
		);
		onChange({ relations: newRelations });
	};

	const onChangeRelationStaticState = (relationGroup, state) => {
		markNextChangeAsNotPersistent();
		onChange(
			getRelationStaticStateUpdate({
				relationGroup,
				state,
				isPreviewActive: !!props['relations-preview'],
			})
		);
	};

	/**
	 * FIX: Proper Deletion Logic
	 * Ensures the filtered array is passed to onChange and resets preview if empty
	 */
	const onRemoveRelationGroup = relationGroup => {
		relationGroup.uniqueIDs.forEach(uid => handleHighlight(uid, false));

		// 1. Create a clean filtered array
		const newRelations = removeRelationGroup(relations, relationGroup);

		// 2. Prepare the update object
		const updateObj = {
			relations: newRelations,
		};
		const activeRelationIds = new Set(
			(props['relations-preview-relation-ids'] || []).map(String)
		);
		const removesActiveStaticState = relationGroup.relationIds.some(id =>
			activeRelationIds.has(String(id))
		);

		// 3. If no interactions left, kill the preview mode
		if (newRelations.length === 0) {
			updateObj['relations-preview'] = false;
		}

		if (removesActiveStaticState) {
			updateObj['relations-preview'] = false;
			updateObj['relations-preview-state'] = 'start';
			updateObj['relations-preview-relation-ids'] = [];
		}

		// 4. Dispatch the change
		onChange(updateObj);
	};

	const getStartUpdateDebugDetails = (
		relationGroup,
		cleanValues,
		targetUpdates = []
	) => ({
		groupId: relationGroup.id,
		relationIds: relationGroup.relationIds,
		uniqueIDs: relationGroup.uniqueIDs,
		keys: Object.keys(cleanValues || {}),
		cleanValues,
		targetUpdates: targetUpdates.map(({ clientId, cleanValues }) => ({
			clientId,
			keys: Object.keys(cleanValues || {}),
		})),
	});

	const applyRelationStartAttributeUpdates = async (
		relationGroup,
		cleanValues
	) => {
		const targetUpdates = getChangedRelationTargetUpdates({
			uniqueIDs: relationGroup.uniqueIDs,
			cleanValues,
			getClientIdFromUniqueId,
			getBlockDataForClientId,
			isEqual,
		});

		debugRelationPreview(
			targetUpdates.length
				? 'relation-control:start-change:apply'
				: 'relation-control:start-change:unchanged',
			getStartUpdateDebugDetails(
				relationGroup,
				cleanValues,
				targetUpdates
			)
		);

		if (!targetUpdates.length) return;

		await Promise.all(
			targetUpdates.map(({ clientId, cleanValues }) =>
				Promise.resolve(updateBlockAttributes(clientId, cleanValues))
			)
		);
	};

	const flushRelationStartAttributeUpdates = async (
		relationGroup,
		initialCleanValues
	) => {
		let cleanValues = initialCleanValues;

		while (!isEmpty(cleanValues)) {
			pendingStartAttributeUpdatesRef.current = null;
			await applyRelationStartAttributeUpdates(
				relationGroup,
				cleanValues
			);
			cleanValues = pendingStartAttributeUpdatesRef.current;
		}
	};

	const getCleanRelationControlValues = values => {
		const cleanValues = { ...(values || {}) };
		delete cleanValues.isReset;
		delete cleanValues.meta;

		return cleanValues;
	};

	// Simplified block list logic
	const getBlocksToAffect = () => {
		const arr = [];
		const { getBlock, getBlockParentsByBlockName } =
			select('core/block-editor');

		goThroughMaxiBlocks(block => {
			const option = getRelationBlockOption({
				block,
				currentUniqueID: uniqueID,
				currentLabel: __('Current', 'maxi-blocks'),
				fallbackGroupLabel: __('Canvas', 'maxi-blocks'),
				getBlockParentsByBlockName,
				getBlock,
			});

			if (option) arr.push(option);
		});
		return arr;
	};

	/**
	 * FIX: Deep Equality Sync
	 * Uses isEqual for nested object comparison to prevent false positives
	 */
	const displayBeforeSetting = relationGroup => {
		const item =
			relationGroup.relations.find(relation => relation.uniqueID) ||
			relationGroup.item;
		const targetClientId = getClientIdFromUniqueId(item.uniqueID);
		const blockData = getBlockDataForClientId(targetClientId);
		if (!targetClientId || !blockData) return null;
		const selectedSettings = getSelectedIBSettings(
			targetClientId,
			item.sid
		);
		const currentActualAttributes = blockData?.attributes;

		if (!selectedSettings || !currentActualAttributes) return null;

		const mergedAttributes = merge(
			{},
			cloneDeep(currentActualAttributes),
			item.attributes
		);
		const attributesWithId = {
			...currentActualAttributes,
			uniqueID: currentActualAttributes?.uniqueID ?? item.uniqueID,
		};

		return (
			<SettingTabsIndicatorContext.Provider
				value={{
					currentAttributes: mergedAttributes,
					blockName: blockData?.name,
				}}
			>
				<div className='maxi-relation-control__interaction-setting'>
					{selectedSettings.component({
						...currentActualAttributes,
						...getGroupAttributes(
							currentActualAttributes,
							selectedSettings.attrGroupName,
							false,
							selectedSettings?.prefix || ''
						),
						attributes: attributesWithId,
						blockAttributes: currentActualAttributes,
						onChange: async newValues => {
							const cleanValues =
								getCleanRelationControlValues(newValues);

							if (isUpdating.current) {
								if (!isEmpty(cleanValues)) {
									pendingStartAttributeUpdatesRef.current =
										mergeRelationStartAttributeUpdates(
											pendingStartAttributeUpdatesRef.current,
											cleanValues
										);

									debugRelationPreview(
										'relation-control:start-change:queued',
										getStartUpdateDebugDetails(
											relationGroup,
											pendingStartAttributeUpdatesRef.current
										)
									);
								}

								return;
							}

							if (isEmpty(cleanValues)) return;

							try {
								isUpdating.current = true;
								await flushRelationStartAttributeUpdates(
									relationGroup,
									cleanValues
								);
							} catch (error) {
								// eslint-disable-next-line no-console
								console.error(
									'Failed to update relation block attributes:',
									error
								);
							} finally {
								isUpdating.current = false;
							}
						},
						prefix: selectedSettings?.prefix || '',
						breakpoint: deviceType,
						clientId: targetClientId,
					})}
				</div>
			</SettingTabsIndicatorContext.Provider>
		);
	};

	const onAddRelation = () => {
		const id = getRelationId(relations);

		onChange({
			relations: [
				...relations,
				{
					...createEmptyRelation({
						id,
						groupId: `relation-group-${id}`,
						isButton,
					}),
					effects: createTransitionObj(),
				},
			],
		});
	};

	const displaySelectedSetting = relationGroup => {
		const item =
			relationGroup.relations.find(relation => relation.uniqueID) ||
			relationGroup.item;
		const targetClientId = getClientIdFromUniqueId(item.uniqueID);
		const blockData = getBlockDataForClientId(targetClientId);
		if (!targetClientId || !blockData) return null;
		const selectedSettings = getSelectedIBSettings(
			targetClientId,
			item.sid
		);
		const blockAttributes = blockData?.attributes;

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

		const transformGeneralAttributesToBaseBreakpoint = obj => {
			if (deviceType !== 'general') return {};

			const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

			if (!baseBreakpoint) return {};

			return Object.keys(obj).reduce((acc, key) => {
				if (key.includes('-general')) {
					const newKey = key.replace('general', baseBreakpoint);
					acc[newKey] = obj[key];
				}
				return acc;
			}, {});
		};

		return (
			<SettingTabsIndicatorContext.Provider
				value={{
					currentAttributes: mergedAttributes,
					blockName: blockData?.name,
				}}
			>
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
							const newRelations = updateRelationsInGroup(
								relations,
								relationGroup,
								relation =>
									normalizeRelationForTarget({
										...relation,
										attributes: {
											...relation.attributes,
											...obj,
											...transformGeneralAttributesToBaseBreakpoint(
												obj
											),
										},
									})
							);

							onChange({ relations: newRelations });
						},
						prefix: selectedSettings?.prefix || '',
						breakpoint: deviceType,
						clientId: targetClientId,
					})}
				</div>
			</SettingTabsIndicatorContext.Provider>
		);
	};

	const getRelationGroupItem = relationGroup =>
		relationGroup.relations.find(relation => relation.uniqueID) ||
		relationGroup.item;

	const onChangeRelationGroupTargets = (relationGroup, uniqueIDs) => {
		const item = getRelationGroupItem(relationGroup);
		const selectedUniqueIDs = Array.isArray(uniqueIDs)
			? uniqueIDs
			: [uniqueIDs].filter(Boolean);
		const keepSid = isSidAvailableForGroup(
			item.sid,
			relationGroup,
			selectedUniqueIDs
		);
		const sid = keepSid ? item.sid : '';

		const newRelations = syncRelationGroupTargets({
			relations,
			relationGroup,
			uniqueIDs: selectedUniqueIDs,
			isButton,
			normalizeRelation: relation =>
				normalizeRelationForTarget({
					...relation,
					sid,
					target: sid ? relation.target : '',
					attributes: sid ? relation.attributes : {},
					css: sid ? relation.css : {},
					effects: sid ? relation.effects : createTransitionObj(),
				}),
		});

		const updateObj = { relations: newRelations };

		if (
			!props['relations-preview'] &&
			props['relations-preview-state'] === 'end'
		) {
			const nextPreviewRelationIds = getSyncedRelationPreviewIds({
				relationGroup,
				relations: newRelations,
				selectedRelationIds:
					props['relations-preview-relation-ids'] || [],
			});

			if (
				!isEqual(
					nextPreviewRelationIds,
					props['relations-preview-relation-ids'] || []
				)
			) {
				updateObj['relations-preview-relation-ids'] =
					nextPreviewRelationIds;
			}
		}

		onChange(updateObj);
	};

	const onChangeRelationGroupSettings = (relationGroup, sid) => {
		const newRelations = updateRelationsInGroup(
			relations,
			relationGroup,
			relation => {
				const targetClientId = getClientIdFromUniqueId(
					relation.uniqueID
				);
				const selectedSettings = getSelectedIBSettings(
					targetClientId,
					sid
				);
				const { transitionTarget, transitionTrigger, hoverProp } =
					selectedSettings || {};
				const blockData = getBlockDataForClientId(targetClientId);
				const hoverStatus =
					hoverProp &&
					getHoverStatus(
						hoverProp,
						blockData?.attributes || {},
						relation.attributes
					);

				return normalizeRelationForTarget({
					...relation,
					sid,
					target: selectedSettings?.target || '',
					effects: {
						...relation.effects,
						transitionTarget,
						transitionTrigger,
						hoverStatus: !!hoverStatus,
						disableTransition:
							!!selectedSettings?.disableTransition,
					},
				});
			}
		);

		onChange({ relations: newRelations });
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

		if (rawGroups.length === 0) {
			return [defaultSetting];
		}

		if (rawGroups.length > 1) {
			return {
				'': [defaultSetting],
				...Object.entries(rawOptions).reduce(
					(acc, [groupLabel, groupOptions]) => ({
						...acc,
						[capitalize(groupLabel)]:
							parseOptionsArray(groupOptions),
					}),
					{}
				),
			};
		}

		return [defaultSetting, ...parseOptionsArray(rawOptions[rawGroups[0]])];
	};

	return (
		<div className='maxi-relation-control'>
			{!isEmpty(relations) && (
				<ToggleSwitch
					label={__('Preview all interactions', 'maxi-blocks')}
					selected={props['relations-preview']}
					onChange={value => {
						debugRelationPreview(
							'relation-control:preview-toggle',
							{
								value,
								relationCount: relations.length,
								groupCount: relationGroups.length,
								selectedState: props['relations-preview-state'],
								selectedRelationIds:
									props['relations-preview-relation-ids'],
							}
						);
						markNextChangeAsNotPersistent();
						onChange({ 'relations-preview': value });
					}}
				/>
			)}
			<Button
				className='maxi-relation-control__button'
				variant='secondary'
				onClick={onAddRelation}
			>
				{__('Add new interaction', 'maxi-blocks')}
			</Button>

			{!isEmpty(relations) && (
				<ListControl debugName='relation-control:interaction-list'>
					{relationGroups.map(relationGroup => {
						const item = getRelationGroupItem(relationGroup);
						const groupOptions = getGroupOptions(relationGroup);
						const selectedUniqueIDs = relationGroup.uniqueIDs;
						const relationControlId =
							getRelationControlId(relationGroup);
						const relationGroupTitle =
							relationGroup.title || item.title;

						return (
							<ListItemControl
								key={relationControlId}
								id={relationControlId}
								title={
									relationGroupTitle ||
									__('Untitled interaction', 'maxi-blocks')
								}
								onMouseEnter={() => {
									relationGroup.uniqueIDs.forEach(uid =>
										handleHighlight(uid, true)
									);
								}}
								onMouseLeave={() => {
									hoveredUniqueIdRef.current = null;
									relationGroup.uniqueIDs.forEach(uid =>
										handleHighlight(uid, false)
									);
								}}
								content={
									<div className='maxi-relation-control__item__content'>
										<TextControl
											label={__('Name', 'maxi-blocks')}
											value={relationGroupTitle}
											placeholder={__(
												'Give memorable name…',
												'maxi-blocks'
											)}
											onChange={v =>
												onChangeRelationGroup(
													relationGroup,
													{
														title: v,
													}
												)
											}
										/>
										<BlockSelectControl
											label={__(
												'Blocks to affect',
												'maxi-blocks'
											)}
											value={selectedUniqueIDs}
											multiple
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
											onOptionReveal={handleReveal}
											onChange={v =>
												onChangeRelationGroupTargets(
													relationGroup,
													v
												)
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
												onChangeRelationGroup(
													relationGroup,
													{
														action: v,
													}
												)
											}
										/>
										{!isEmpty(selectedUniqueIDs) && (
											<SelectControl
												label={__(
													'Settings',
													'maxi-blocks'
												)}
												value={item.sid}
												options={getParsedOptions(
													groupOptions
												)}
												onChange={v =>
													onChangeRelationGroupSettings(
														relationGroup,
														v
													)
												}
											/>
										)}
										{!isEmpty(selectedUniqueIDs) &&
											item.sid && (
												<SettingTabsControl
													depth={`interaction-${relationControlId}`}
													deviceType={deviceType}
													className='maxi-relation-control__interaction-tabs'
													callback={(...args) => {
														const tabIndex =
															args[1];
														if (tabIndex === 0) {
															onChangeRelationStaticState(
																relationGroup,
																'start'
															);
														}
														if (tabIndex === 1) {
															onChangeRelationStaticState(
																relationGroup,
																'end'
															);
														}
													}}
													items={[
														{
															label: __(
																'Start',
																'maxi-blocks'
															),
															content:
																displayBeforeSetting(
																	relationGroup
																),
														},
														{
															label: __(
																'End',
																'maxi-blocks'
															),
															content:
																displaySelectedSetting(
																	relationGroup
																),
														},
														{
															label: __(
																'Effects',
																'maxi-blocks'
															),
															content: (
																<TransitionControl
																	transition={
																		item.effects
																	}
																	breakpoint={
																		deviceType
																	}
																	getDefaultTransitionAttribute={
																		getDefaultTransitionAttribute
																	}
																	onChange={obj =>
																		onChangeRelationGroup(
																			relationGroup,
																			relation => ({
																				effects:
																					{
																						...relation.effects,
																						...obj,
																					},
																			})
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
								onRemove={() =>
									onRemoveRelationGroup(relationGroup)
								}
							/>
						);
					})}
				</ListControl>
			)}
		</div>
	);
};

export default RelationControl;
