/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, select } from '@wordpress/data';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import InfoBox from '@components/info-box';
import ListControl from '@components/list-control';
import ListItemControl from '@components/list-control/list-item-control';
import SelectControl from '@components/select-control';
import SettingTabsControl from '@components/setting-tabs-control';
import TextControl from '@components/text-control';
import ToggleSwitch from '@components/toggle-switch';
import TransitionControl from '@components/transition-control';
import { openSidebarAccordion } from '@extensions/inspector';
import {
	createTransitionObj,
	getDefaultAttribute,
	getGroupAttributes,
} from '@extensions/styles';
import getClientIdFromUniqueId from '@extensions/attributes/getClientIdFromUniqueId';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';
import { getHoverStatus } from '@extensions/relations';
import getCleanResponseIBAttributes from '@extensions/relations/getCleanResponseIBAttributes';
import getIBOptionsFromBlockData from '@extensions/relations/getIBOptionsFromBlockData';
import { getSelectedIBSettings } from '@extensions/relations/utils';
import getIBStylesObj from '@extensions/relations/getIBStylesObj';
import getIBStyles from '@extensions/relations/getIBStyles';
import getCleanDisplayIBAttributes from '@extensions/relations/getCleanDisplayIBAttributes';
import RepeaterContext from '@blocks/row-maxi/repeaterContext';

/**
 * External dependencies
 */
import { capitalize, cloneDeep, isEmpty, omitBy } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const RelationControl = props => {
	const { getBlock } = select('core/block-editor');
	const {
		selectBlock,
		__unstableMarkNextChangeAsNotPersistent: markNextChangeAsNotPersistent,
	} = useDispatch('core/block-editor');

	const repeaterContext = useContext(RepeaterContext);

	const {
		clientId,
		deviceType,
		isButton,
		onChange,
		relations: rawRelations,
		uniqueID,
	} = props;

	const cloneRelations = relations =>
		!isEmpty(relations) ? cloneDeep(relations) : [];

	// Ensure that each relation of `relations` array has a valid block
	const relations = cloneRelations(rawRelations).filter(
		relation =>
			isEmpty(relation.uniqueID) ||
			!!getClientIdFromUniqueId(relation.uniqueID)
	);

	const getRelationId = relations => {
		return relations && !isEmpty(relations)
			? Math.max(
					...relations.map(relation =>
						typeof relation.id === 'number' ? relation.id : 0
					)
			  ) + 1
			: 1;
	};

	const getParsedOptions = rawOptions => {
		const parseOptionsArray = options =>
			options?.map(({ sid, label }) => ({
				label,
				value: sid,
			})) ?? [];

		const defaultSetting = {
			label: __('Choose settings', 'maxi-blocks'),
			value: '',
		};

		const parsedOptions =
			Object.keys(rawOptions).length > 1
				? {
						'': [defaultSetting],
						...Object.entries(rawOptions).reduce(
							(acc, [groupLabel, groupOptions]) => ({
								...acc,
								[capitalize(groupLabel)]:
									parseOptionsArray(groupOptions),
							}),
							{}
						),
				  }
				: [
						...defaultSetting,
						...parseOptionsArray(
							rawOptions[Object.keys(rawOptions)[0]]
						),
				  ];

		return parsedOptions;
	};

	const transitionDefaultAttributes = createTransitionObj();

	const onAddRelation = relations => {
		const newRelations = cloneRelations(relations);

		const relation = {
			title: '',
			uniqueID: '',
			target: '',
			action: '',
			sid: '',
			attributes: {},
			css: {},
			id: getRelationId(relations),
			effects: transitionDefaultAttributes,
			isButton,
		};

		onChange({ relations: [...newRelations, relation] });
	};

	const onChangeRelation = (relations, id, obj) => {
		const newRelations = cloneRelations(relations);

		newRelations.forEach(relation => {
			if (relation.id === id) {
				Object.keys(obj).forEach(key => {
					relation[key] = obj[key];
				});
			}
		});

		onChange({ relations: newRelations });
	};

	const onRemoveRelation = (id, relations) => {
		const newRelations = cloneRelations(relations);

		onChange({
			relations: newRelations.filter(relation => relation.id !== id),
		});
	};

	const displaySelectedSetting = item => {
		if (!item) return null;

		const clientId = getClientIdFromUniqueId(item.uniqueID);

		const selectedSettings = getSelectedIBSettings(clientId, item.sid);

		if (!selectedSettings) return null;

		const settingsComponent = selectedSettings.component;
		const prefix = selectedSettings?.prefix || '';
		const blockAttributes = cloneDeep(getBlock(clientId)?.attributes);

		const mergedAttributes = getCleanDisplayIBAttributes(
			blockAttributes,
			item.attributes
		);

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

		const getNewAttributesOnReset = obj => {
			const newAttributes = { ...item.attributes };
			const resetTargets = Object.keys({
				...obj,
				...transformGeneralAttributesToBaseBreakpoint(obj),
			});

			resetTargets.forEach(target => {
				newAttributes[target] = undefined;
			});

			return newAttributes;
		};

		return settingsComponent({
			...blockAttributes,
			...getGroupAttributes(
				mergedAttributes,
				selectedSettings.attrGroupName,
				false,
				prefix
			),
			attributes: mergedAttributes,
			blockAttributes,
			onChange: ({ isReset, ...obj }) => {
				const newAttributesObj = isReset
					? getNewAttributesOnReset(obj)
					: {
							...item.attributes,
							...obj,
							...transformGeneralAttributesToBaseBreakpoint(obj),
					  };

				const { cleanAttributesObject, tempAttributes } =
					getCleanResponseIBAttributes(
						newAttributesObj,
						blockAttributes,
						item.uniqueID,
						selectedSettings,
						deviceType,
						prefix,
						item.sid,
						clientId
					);

				const styles = getIBStyles({
					stylesObj: getIBStylesObj({
						clientId,
						sid: item.sid,
						attributes: omitBy(
							{
								...tempAttributes,
								...cleanAttributesObject,
							},
							val => val === undefined
						),
						blockAttributes,
						breakpoint: deviceType,
					}),
					blockAttributes,
					isFirst: true,
				});

				onChangeRelation(relations, item.id, {
					attributes: omitBy(
						{
							...item.attributes,
							...cleanAttributesObject,
						},
						val => val === undefined
					),
					css: styles,
					...(item.sid === 't' && {
						effects: {
							...item.effects,
							transitionTarget: Object.keys(styles),
						},
					}),
				});
			},
			prefix,
			blockStyle: blockAttributes.blockStyle,
			breakpoint: deviceType,
			clientId,
		});
	};

	const getBlocksToAffect = () => {
		const arr = [];

		const {
			getBlockAttributes,
			getBlockOrder,
			getBlockParentsByBlockName,
		} = select('core/block-editor');

		const innerBlockPositions =
			repeaterContext?.getInnerBlocksPositions?.();

		const triggerParentRepeaterColumnClientId =
			repeaterContext?.repeaterStatus &&
			(innerBlockPositions?.[[-1]]?.includes(clientId)
				? clientId
				: getBlockParentsByBlockName(
						clientId,
						'maxi-blocks/column-maxi'
				  ).find(clientId =>
						innerBlockPositions?.[[-1]]?.includes(clientId)
				  ));

		goThroughMaxiBlocks(block => {
			if (
				block.attributes.customLabel !==
				getDefaultAttribute('customLabel', block.clientId)
			) {
				const targetParentRows = getBlockParentsByBlockName(
					block.clientId,
					'maxi-blocks/row-maxi'
				);

				const targetParentRepeaterRowClientId = targetParentRows.find(
					clientId => getBlockAttributes(clientId)['repeater-status']
				);

				const targetParentRepeaterColumnClientId =
					getBlockParentsByBlockName(
						block.clientId,
						'maxi-blocks/column-maxi'
					)[
						targetParentRows.indexOf(
							targetParentRepeaterRowClientId
						)
					] ||
					(block.name === 'maxi-blocks/column-maxi' &&
						block.clientId);

				const isBlockInRepeaterAndInAnotherColumn =
					repeaterContext?.repeaterStatus &&
					repeaterContext?.repeaterRowClientId ===
						targetParentRepeaterRowClientId &&
					triggerParentRepeaterColumnClientId !==
						targetParentRepeaterColumnClientId;

				const isTargetInRepeaterAndTriggerNot =
					!repeaterContext?.repeaterStatus &&
					targetParentRepeaterRowClientId;

				if (isBlockInRepeaterAndInAnotherColumn) {
					return;
				}

				arr.push({
					label: `${block.attributes.customLabel}${
						isTargetInRepeaterAndTriggerNot
							? `(${
									getBlockOrder(
										targetParentRepeaterRowClientId
									).indexOf(
										targetParentRepeaterColumnClientId
									) + 1
							  })`
							: ''
					}`,
					value: block.attributes.uniqueID,
				});
			}
		});
		return arr;
	};

	const blocksToAffect = getBlocksToAffect();

	const getDefaultTransitionAttribute = target =>
		transitionDefaultAttributes[`${target}-${deviceType}`];

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
				className='maxi-relation-control__button'
				type='button'
				variant='secondary'
				onClick={() => onAddRelation(relations)}
			>
				{__('Add new interaction', 'maxi-blocks')}
			</Button>
			{!isEmpty(relations) && (
				<ListControl>
					{relations.map(item => (
						<ListItemControl
							key={item.id}
							className='maxi-relation-control__item'
							title={
								item.title ||
								__('Untitled interaction', 'maxi-blocks')
							}
							content={
								<div className='maxi-relation-control__item__content'>
									<TextControl
										label={__('Name', 'maxi-blocks')}
										value={item.title}
										placeholder={__(
											'Give memorable name…',
											'maxi-blocks'
										)}
										newStyle
										onChange={value =>
											onChangeRelation(
												relations,
												item.id,
												{
													title: value,
												}
											)
										}
									/>
									{blocksToAffect.length === 0 && (
										<InfoBox
											className='maxi-relation-control__item__content__info-box'
											message={__(
												'Add names to blocks which you want to be able to select them here.',
												'maxi-blocks'
											)}
										/>
									)}
									<SelectControl
										__nextHasNoMarginBottom
										label={__(
											'Block to affect',
											'maxi-blocks'
										)}
										value={item.uniqueID}
										newStyle
										options={[
											{
												label: __(
													'Select block…',
													'maxi-blocks'
												),
												value: '',
											},
											...blocksToAffect,
										]}
										onChange={value =>
											onChangeRelation(
												relations,
												item.id,
												{
													uniqueID: value,
												}
											)
										}
									/>
									{item.uniqueID && (
										<>
											<SelectControl
												__nextHasNoMarginBottom
												label={__(
													'Action',
													'maxi-blocks'
												)}
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
												newStyle
												onChange={value =>
													onChangeRelation(
														relations,
														item.id,
														{
															action: value,
														}
													)
												}
											/>
											<SelectControl
												__nextHasNoMarginBottom
												label={__(
													'Settings',
													'maxi-blocks'
												)}
												value={item.sid}
												options={getParsedOptions(
													getIBOptionsFromBlockData(
														getClientIdFromUniqueId(
															item.uniqueID
														)
													)
												)}
												newStyle
												onChange={value => {
													const clientId =
														getClientIdFromUniqueId(
															item.uniqueID
														);

													const selectedSettings =
														getSelectedIBSettings(
															clientId,
															value
														) || {};
													const {
														transitionTarget,
														transitionTrigger,
														hoverProp,
													} = selectedSettings;

													const blockAttributes =
														getBlock(
															clientId
														)?.attributes;

													const hoverStatus =
														getHoverStatus(
															hoverProp,
															blockAttributes
														);

													const getTarget = () => {
														const clientId =
															getClientIdFromUniqueId(
																item.uniqueID
															);

														const target =
															selectedSettings?.target ||
															'';

														const textMaxiPrefix =
															getBlock(clientId)
																?.name ===
																'maxi-blocks/text-maxi' &&
															value === 'ty';

														if (textMaxiPrefix) {
															const blockAttributes =
																getBlock(
																	clientId
																)?.attributes;

															const {
																isList,
																typeOfList,
																textLevel,
															} = blockAttributes;

															const trimmedTarget =
																target.startsWith(
																	' '
																)
																	? target.slice(
																			1
																	  )
																	: target;

															return `${
																isList
																	? typeOfList
																	: textLevel
															}${trimmedTarget}`;
														}

														return target;
													};

													onChangeRelation(
														relations,
														item.id,
														{
															attributes: {},
															css: {},
															target: getTarget(),
															sid: value,
															effects: {
																...item.effects,
																transitionTarget,
																transitionTrigger,
																hoverStatus:
																	!!hoverStatus,
																disableTransition:
																	!!selectedSettings?.disableTransition,
															},
														}
													);
												}}
											/>
											<div className='maxi-relation-control__block-access maxi-warning-box__links'>
												<a
													onClick={() =>
														selectBlock(
															getClientIdFromUniqueId(
																item.uniqueID
															),
															openSidebarAccordion(
																0
															)
														)
													}
												>
													{__(
														'Open block settings',
														'maxi-blocks'
													)}
												</a>
											</div>
										</>
									)}
									{item.uniqueID &&
										item.sid &&
										(item.effects.disableTransition ? (
											displaySelectedSetting(item)
										) : (
											<SettingTabsControl
												deviceType={deviceType}
												items={[
													{
														label: __(
															'Settings',
															'maxi-blocks'
														),
														content:
															displaySelectedSetting(
																item
															),
													},
													{
														label: __(
															'Effects',
															'maxi-blocks'
														),
														content: (
															<TransitionControl
																className='maxi-relation-control__item__effects'
																newStyle
																onChange={(
																	obj,
																	splitMode
																) =>
																	onChangeRelation(
																		relations,
																		item.id,
																		{
																			effects:
																				splitMode ===
																				'out'
																					? {
																							...item.effects,
																							out: {
																								...item
																									.effects
																									.out,
																								...obj,
																							},
																					  }
																					: {
																							...item.effects,
																							...obj,
																					  },
																		}
																	)
																}
																transition={
																	item.effects
																}
																getDefaultTransitionAttribute={
																	getDefaultTransitionAttribute
																}
																breakpoint={
																	deviceType
																}
															/>
														),
													},
												]}
											/>
										))}
								</div>
							}
							id={item.id}
							onRemove={() =>
								onRemoveRelation(item.id, relations)
							}
						/>
					))}
				</ListControl>
			)}
		</div>
	);
};

export default RelationControl;
