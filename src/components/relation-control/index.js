/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '../button';
import InfoBox from '../info-box';
import ListControl from '../list-control';
import ListItemControl from '../list-control/list-item-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import TextControl from '../text-control';
import TransitionControl from '../transition-control';
import {
	createTransitionObj,
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import getClientIdFromUniqueId from '../../extensions/attributes/getClientIdFromUniqueId';
import { getHoverStatus } from '../../extensions/relations';
import * as blocksData from '../../blocks/data';

/**
 * External dependencies
 */
import { capitalize, cloneDeep, isEmpty, isNil, merge } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const RelationControl = props => {
	const { getBlock } = select('core/block-editor');

	const { deviceType, isButton, onChange, relations, uniqueID } = props;

	const cloneRelations = relations =>
		!isEmpty(relations) ? cloneDeep(relations) : [];

	const getRelationId = relations => {
		return relations && !isEmpty(relations)
			? Math.max(
					...relations.map(relation =>
						typeof relation.id === 'number' ? relation.id : 0
					)
			  ) + 1
			: 1;
	};

	const getOptions = clientId => {
		const blockName = getBlock(clientId)?.name.replace('maxi-blocks/', '');

		// TODO: without this line, the block may break after copy/pasting
		if (!blockName) return {};

		const blockOptions = Object.values(blocksData).find(
			data => data.name === blockName
		).interactionBuilderSettings;

		return blockOptions || {};
	};

	const getParsedOptions = rawOptions => {
		const parseOptionsArray = options =>
			options.map(({ label }) => ({
				label,
				value: label,
			}));

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
			settings: '',
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

	const getSelectedSettingsObj = (clientId, settingsLabel) =>
		Object.values(getOptions(clientId))
			.flat()
			.find(option => option.label === settingsLabel);

	const displaySelectedSetting = item => {
		if (!item) return null;

		const clientId = getClientIdFromUniqueId(item.uniqueID);

		const selectedSettingsObj = getSelectedSettingsObj(
			clientId,
			item.settings
		);

		if (!selectedSettingsObj) return null;

		const settingsComponent = selectedSettingsObj.component;
		const prefix = selectedSettingsObj?.prefix || '';
		const blockAttributes = cloneDeep(getBlock(clientId)?.attributes);

		const { receiveMaxiBreakpoints, receiveXXLSize } = select('maxiBlocks');

		const storeBreakpoints = receiveMaxiBreakpoints();
		const blockBreakpoints = getGroupAttributes(
			blockAttributes,
			'breakpoints'
		);

		const breakpoints = {
			...storeBreakpoints,
			xxl: receiveXXLSize(),
			...Object.keys(blockBreakpoints).reduce((acc, key) => {
				if (blockAttributes[key]) {
					const newKey = key.replace('breakpoints-', '');
					acc[newKey] = blockBreakpoints[key];
				}
				return acc;
			}, {}),
		};

		// As an alternative to a migrator... Remove after used!
		if (
			!(
				'transitionTrigger' in item.effects &&
				'transitionTarget' in item.effects &&
				'hoverStatus' in item.effects
			) ||
			item.effects.hoverStatus !==
				getHoverStatus(selectedSettingsObj.hoverProp, blockAttributes)
		) {
			const {
				transitionTarget: rawTransitionTarget,
				transitionTrigger,
				hoverProp,
			} = selectedSettingsObj;
			const transitionTarget =
				item.settings === 'Transform'
					? Object.keys(item.css)
					: rawTransitionTarget;

			let hoverStatus = null;

			if (!('hoverStatus' in item.effects))
				hoverStatus = getHoverStatus(
					hoverProp,
					blockAttributes,
					item.attributes
				);

			if (transitionTarget || transitionTrigger)
				onChangeRelation(relations, item.id, {
					effects: {
						...item.effects,
						...(transitionTarget && { transitionTarget }),
						...(transitionTrigger && { transitionTrigger }),
						...(!isNil(hoverStatus) && { hoverStatus }),
					},
				});
		}

		// Merging into empty object because lodash `merge` mutates first argument
		const mergedAttributes = merge({}, blockAttributes, item.attributes);

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

		return settingsComponent({
			...getGroupAttributes(
				mergedAttributes,
				selectedSettingsObj.attrGroupName,
				false,
				prefix
			),
			attributes: mergedAttributes,
			blockAttributes,
			onChange: obj => {
				const newAttributesObj = {
					...item.attributes,
					...obj,
					...transformGeneralAttributesToBaseBreakpoint(obj),
				};

				const newGroupAttributes = getGroupAttributes(
					merge(blockAttributes, newAttributesObj),
					selectedSettingsObj.attrGroupName,
					false,
					prefix
				);

				const stylesObj = selectedSettingsObj?.helper({
					obj: newGroupAttributes,
					isIB: true,
					prefix,
					blockStyle: blockAttributes.blockStyle,
					deviceType,
					blockAttributes: {
						...blockAttributes,
						...newAttributesObj,
					},
					target: selectedSettingsObj?.target,
					clientId,
				});

				const getStyles = (stylesObj, isFirst = false) => {
					if (
						Object.keys(stylesObj).some(key =>
							key.includes('general')
						)
					) {
						const styles = Object.keys(stylesObj).reduce(
							(acc, key) => {
								if (
									breakpoints[key] ||
									key === 'xxl' ||
									key === 'general'
								) {
									acc[key] = {
										styles: stylesObj[key],
										breakpoint: breakpoints[key] || null,
									};

									return acc;
								}

								return acc;
							},
							{}
						);

						return styles;
					}

					const styles = Object.keys(stylesObj).reduce((acc, key) => {
						if (isFirst) {
							if (!key.includes(':hover'))
								acc[key] = getStyles(stylesObj[key]);

							return acc;
						}

						const newAcc = merge(acc, getStyles(stylesObj[key]));

						return newAcc;
					}, {});

					return styles;
				};

				const styles = getStyles(stylesObj, true);

				onChangeRelation(relations, item.id, {
					attributes: newAttributesObj,
					css: styles,
					...(item.settings === 'Transform' && {
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
		const { getBlocks } = select('core/block-editor');
		const maxiBlocks = getBlocks().filter(block =>
			block.name.includes('maxi-blocks')
		);

		const blocksToAffect = (blocks, arr = []) => {
			blocks.forEach(block => {
				if (
					block.attributes.customLabel !==
						getDefaultAttribute('customLabel', block.clientId) &&
					block.attributes.uniqueID !== uniqueID
				) {
					arr.push({
						label: block.attributes.customLabel,
						value: block.attributes.uniqueID,
					});
				}

				if (block.innerBlocks.length) {
					blocksToAffect(block.innerBlocks, arr);
				}
			});

			return arr;
		};

		return blocksToAffect(maxiBlocks);
	};

	const blocksToAffect = getBlocksToAffect();

	const getDefaultTransitionAttribute = target =>
		transitionDefaultAttributes[`${target}-${deviceType}`];

	return (
		<div className='maxi-relation-control'>
			<Button
				className='maxi-relation-control__button'
				type='button'
				variant='secondary'
				onClick={() => onAddRelation(props.relations)}
			>
				{__('Add new interaction', 'maxi-blocks')}
			</Button>
			{!isEmpty(props.relations) && (
				<ListControl>
					{props.relations.map(item => (
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
										placeholder={__('Give memorable name…')}
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
										label={__(
											'Block to affect',
											'maxi-blocks'
										)}
										value={item.uniqueID}
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
												label={__(
													'Settings',
													'maxi-blocks'
												)}
												value={item.settings}
												options={getParsedOptions(
													getOptions(
														getClientIdFromUniqueId(
															item.uniqueID
														)
													)
												)}
												onChange={value => {
													const clientId =
														getClientIdFromUniqueId(
															item.uniqueID
														);

													const selectedSettingsObj =
														getSelectedSettingsObj(
															clientId,
															value
														) || {};
													const {
														transitionTarget,
														hoverProp,
													} = selectedSettingsObj;

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
															selectedSettingsObj?.target ||
															'';

														const textMaxiPrefix =
															getBlock(clientId)
																?.name ===
																'maxi-blocks/text-maxi' &&
															value ===
																'Typography';

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
															settings: value,
															effects: {
																...item.effects,
																transitionTarget,
																hoverStatus:
																	!!hoverStatus,
															},
														}
													);

													const getShouldTargetBlockUpdate =
														() => {
															const {
																prefix,
																shouldTargetBlockUpdate,
															} = selectedSettingsObj;

															if (
																shouldTargetBlockUpdate?.(
																	{
																		blockAttributes,
																		prefix,
																	}
																)
															)
																return true;

															const previousSelectedSettingsObj =
																getSelectedSettingsObj(
																	clientId,
																	item.settings
																) || {};
															const {
																prefix: previousPrefix,
																shouldTargetBlockUpdate:
																	previousShouldTargetBlockUpdate,
															} = previousSelectedSettingsObj;

															return (
																previousShouldTargetBlockUpdate?.(
																	{
																		blockAttributes,
																		prefix: previousPrefix,
																	}
																) ?? false
															);
														};

													if (
														getShouldTargetBlockUpdate()
													) {
														const targetBlockClientId =
															getClientIdFromUniqueId(
																item.uniqueID
															);
														const previousRerenderValue =
															select(
																'maxiBlocks'
															).receiveRelationRerenderValue(
																item.uniqueID
															);
														const newRerenderValue =
															previousRerenderValue ===
															1
																? 2
																: 1;

														dispatch(
															'core/block-editor'
														).updateBlockAttributes(
															targetBlockClientId,
															{
																're-render':
																	newRerenderValue,
															}
														);
														dispatch(
															'maxiBlocks'
														).updateRelationRerenderValue(
															item.uniqueID,
															newRerenderValue
														);
													}
												}}
											/>
										</>
									)}
									{item.uniqueID && item.settings && (
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
														<ResponsiveTabsControl
															breakpoint={
																deviceType
															}
														>
															<TransitionControl
																className='maxi-relation-control__item__effects'
																onChange={obj =>
																	onChangeRelation(
																		relations,
																		item.id,
																		{
																			effects:
																				{
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
														</ResponsiveTabsControl>
													),
												},
											]}
										/>
									)}
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
