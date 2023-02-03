/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { select, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '../button';
import InfoBox from '../info-box';
import ListControl from '../list-control';
import ListItemControl from '../list-control/list-item-control';
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import TextControl from '../text-control';
import TransitionControl from '../transition-control';
import { openSidebarAccordion } from '../../extensions/inspector';
import {
	createTransitionObj,
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import getClientIdFromUniqueId from '../../extensions/attributes/getClientIdFromUniqueId';
import { goThroughMaxiBlocks } from '../../extensions/maxi-block';
import { getHoverStatus } from '../../extensions/relations';
import { getBlockData } from '../../extensions/attributes';

/**
 * External dependencies
 */
import { capitalize, cloneDeep, isEmpty, merge } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const RelationControl = props => {
	const { getBlock } = select('core/block-editor');

	const { selectBlock } = useDispatch('core/block-editor');

	const {
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

	const getOptions = clientId => {
		const blockName = getBlock(clientId)?.name.replace('maxi-blocks/', '');

		// TODO: without this line, the block may break after copy/pasting
		if (!blockName) return {};

		const blockOptions = getBlockData(blockName).interactionBuilderSettings;

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

		const getNewAttributesOnReset = obj => {
			const newAttributes = { ...item.attributes };
			const resetTargets = Object.keys({
				...obj,
				...transformGeneralAttributesToBaseBreakpoint(obj),
			});

			resetTargets.forEach(target => {
				delete newAttributes[target];
			});

			return newAttributes;
		};

		const getStylesObj = attributes => {
			const newGroupAttributes = getGroupAttributes(
				attributes,
				selectedSettingsObj.attrGroupName,
				false,
				prefix
			);

			return selectedSettingsObj?.helper({
				obj: newGroupAttributes,
				isIB: true,
				prefix,
				blockStyle: blockAttributes.blockStyle,
				deviceType,
				blockAttributes: {
					...blockAttributes,
					...attributes,
				},
				target: selectedSettingsObj?.target,
				clientId,
			});
		};

		const getStyles = (stylesObj, isFirst = false) => {
			if (Object.keys(stylesObj).some(key => key.includes('general'))) {
				const styles = Object.keys(stylesObj).reduce((acc, key) => {
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
				}, {});

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

		return settingsComponent({
			...getGroupAttributes(
				mergedAttributes,
				selectedSettingsObj.attrGroupName,
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

				const styles = getStyles(
					getStylesObj(merge({}, blockAttributes, newAttributesObj)),
					true
				);

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
		const arr = [];
		goThroughMaxiBlocks(block => {
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
		});
		return arr;
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
														transitionTrigger,
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
																transitionTrigger,
																hoverStatus:
																	!!hoverStatus,
																disableTransition:
																	!!selectedSettingsObj?.disableTransition,
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
										item.settings &&
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
