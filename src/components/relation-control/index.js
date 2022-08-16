/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
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
import settings from './settings';

/**
 * External dependencies
 */
import { cloneDeep, isEmpty, merge } from 'lodash';

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
		const blockName = getBlock(clientId)?.name;
		const blockOptions = settings[blockName] || [];

		return blockOptions || [];
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

	const displaySelectedSetting = item => {
		if (!item) return null;

		const clientId = getClientIdFromUniqueId(item.uniqueID);

		const selectedSettingsObj = getOptions(clientId).find(
			option => option.label === item.settings
		);

		if (!selectedSettingsObj) return null;

		const settingsComponent = selectedSettingsObj.component;
		const prefix = selectedSettingsObj?.prefix || '';
		const blockAttributes = cloneDeep(getBlock(clientId)?.attributes);

		const storeBreakpoints = select('maxiBlocks').receiveMaxiBreakpoints();
		const blockBreakpoints = getGroupAttributes(
			blockAttributes,
			'breakpoints'
		);

		const breakpoints = {
			...storeBreakpoints,
			...Object.keys(blockBreakpoints).reduce((acc, key) => {
				if (blockAttributes[key]) {
					const newKey = key.replace('breakpoints-', '');
					acc[newKey] = blockBreakpoints[key];
				}
				return acc;
			}, {}),
		};

		const textMaxiPrefix =
			getBlock(clientId)?.name === 'maxi-blocks/text-maxi' &&
			item?.settings === 'Typography';

		if (
			selectedSettingsObj?.target &&
			item.target !== selectedSettingsObj?.target
		) {
			onChangeRelation(relations, item.id, {
				target: `${
					textMaxiPrefix
						? blockAttributes?.isList
							? blockAttributes?.typeOfList
							: blockAttributes?.textLevel
						: ''
				}${selectedSettingsObj?.target}`,
			});
		}

		const mergedAttributes = merge(blockAttributes, item.attributes);

		const transformGeneralAttributesToWinBreakpoint = obj => {
			if (deviceType !== 'general') return {};

			const winBreakpoint = select('maxiBlocks').receiveWinBreakpoint();

			if (!winBreakpoint) return {};

			return Object.keys(obj).reduce((acc, key) => {
				if (key.includes('-general')) {
					const newKey = key.replace('general', winBreakpoint);

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
					...transformGeneralAttributesToWinBreakpoint(obj),
				};

				const newGroupAttributes = getGroupAttributes(
					{ ...blockAttributes, ...newAttributesObj },
					selectedSettingsObj.attrGroupName,
					false,
					prefix
				);

				const stylesObj = selectedSettingsObj?.helper({
					obj: newGroupAttributes,
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
												options={[
													{
														label: __(
															'Choose settings',
															'maxi-blocks'
														),
														value: '',
													},
													...getOptions(
														getClientIdFromUniqueId(
															item.uniqueID
														)
													).map(option => ({
														label: option.label,
														value: option.label,
													})),
												]}
												onChange={value => {
													onChangeRelation(
														relations,
														item.id,
														{
															attributes: {},
															target: '',
															settings: value,
														}
													);
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
