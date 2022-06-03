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
import settings from './settings';
import SettingTabsControl from '../setting-tabs-control';
import TextControl from '../text-control';
import TransitionControl from '../transition-control';
import {
	getGroupAttributes,
	getDefaultAttribute,
} from '../../extensions/styles';
import getClientIdFromUniqueId from '../../extensions/attributes/getClientIdFromUniqueId';

/**
 * External dependencies
 */
import { cloneDeep, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const RelationControl = props => {
	const { getBlock } = select('core/block-editor');

	const { blockStyle, deviceType, onChange, uniqueID } = props;
	const relations = cloneDeep(props.relations) ?? [];

	const getRelationId = () =>
		relations && !isEmpty(relations)
			? Math.max(
					...relations.map(relation =>
						typeof relation.id === 'number' ? relation.id : 0
					)
			  ) + 1
			: 1;

	const getOptions = clientId => {
		const blockName = getBlock(clientId)?.name;
		const blockOptions = settings[blockName] || [];

		if (!blockOptions) {
			return [];
		}

		return blockOptions;
	};

	const onAddRelation = () => {
		const relation = {
			title: '',
			uniqueID: '',
			trigger: uniqueID,
			target: '',
			action: '',
			settings: '',
			attributes: {},
			css: {},
			id: getRelationId(),
			effects: {
				'transition-duration-general': 0.3,
				'transition-delay-general': 0,
				'transition-timing-function-general': 'ease',
			},
		};

		onChange({ relations: [...relations, relation] });
	};

	const onChangeRelationProperty = (id, property, value) => {
		relations.forEach(relation => {
			if (relation.id === id) {
				relation[property] = value;
			}
		});

		onChange({ relations });
	};

	const onRemoveRelation = id => {
		onChange({
			relations: relations.filter(relation => relation.id !== id),
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
		const blockAttributes = getBlock(clientId)?.attributes;

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

		if (
			selectedSettingsObj?.target &&
			item.target !== selectedSettingsObj?.target
		) {
			onChangeRelationProperty(
				item.id,
				'target',
				selectedSettingsObj?.target
			);
		}

		const mergedAttributes = {
			...blockAttributes,
			...item.attributes,
		};

		return settingsComponent({
			...getGroupAttributes(
				mergedAttributes,
				selectedSettingsObj.attrGroupName,
				false,
				prefix
			),
			attributes: mergedAttributes,
			onChange: obj => {
				const newAttributesObj = {
					...item.attributes,
					...obj,
				};

				onChangeRelationProperty(
					item.id,
					'attributes',
					newAttributesObj
				);

				const newGroupAttributes = getGroupAttributes(
					{ ...blockAttributes, ...newAttributesObj },
					selectedSettingsObj.attrGroupName,
					false,
					prefix
				);

				const stylesObj = selectedSettingsObj?.helper({
					obj: newGroupAttributes,
					prefix,
					blockStyle,
					deviceType,
					blockAttributes: {
						...blockAttributes,
						...newAttributesObj,
					},
				});

				const styles = Object.keys(stylesObj).reduce((acc, key) => {
					if (key !== 'label') {
						acc[key] = {
							styles: stylesObj[key],
							breakpoint: breakpoints[key] || null,
						};

						return acc;
					}

					acc[key] = stylesObj[key];

					return acc;
				}, {});

				onChangeRelationProperty(item.id, 'css', styles);
			},
			prefix,
			breakpoint: deviceType,
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

	return (
		<div className='maxi-relation-control'>
			<Button
				className='maxi-relation-control__button'
				type='button'
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
											onChangeRelationProperty(
												item.id,
												'title',
												value
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
											onChangeRelationProperty(
												item.id,
												'uniqueID',
												value
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
													onChangeRelationProperty(
														item.id,
														'action',
														value
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
													onChangeRelationProperty(
														item.id,
														'attributes',
														{}
													);
													onChangeRelationProperty(
														item.id,
														'settings',
														value
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
																{...item.effects}
																onChange={value =>
																	onChangeRelationProperty(
																		item.id,
																		'effects',
																		{
																			...item.effects,
																			...value,
																		}
																	)
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
							onRemove={() => onRemoveRelation(item.id)}
						/>
					))}
				</ListControl>
			)}
		</div>
	);
};

export default RelationControl;
