/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import TextControl from '../text-control';
import ListControl from '../list-control';
import ListItemControl from '../list-control/list-item-control';
import SelectControl from '../select-control';
import settings from './settings';
import {
	getGroupAttributes,
	styleResolver,
	getResponsiveStyles,
} from '../../extensions/styles';
import getClientId from '../../extensions/attributes/getClientId';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const RelationControl = props => {
	const { getBlock } = select('core/block-editor');

	const { blockStyle, deviceType, onChange, uniqueID } = props;
	const relations = cloneDeep(props.relations) ?? [];

	const getRelationalStyles = styles => {
		const response = {};

		['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(breakpoint => {
			if (styles[breakpoint])
				response[breakpoint] = {
					content: getResponsiveStyles(styles[breakpoint].content),
					breakpoint:
						breakpoint === 'general'
							? null
							: styles[breakpoint].breakpoints[breakpoint],
				};
		});

		return response;
	};

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

		const clientId = getClientId(item.uniqueID);

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

				const resolvedStyles = styleResolver(
					mergedAttributes.uniqueID,
					stylesObj,
					false,
					breakpoints,
					false
				);

				const styles = resolvedStyles.general
					? getRelationalStyles(resolvedStyles)
					: {};

				onChangeRelationProperty(item.id, 'css', styles);
			},
			prefix,
			breakpoint: deviceType,
		});
	};

	return (
		<div className='maxi-relation-control'>
			<Button
				className='maxi-relation-control__button'
				type='button'
				variant='secondary'
				onClick={onAddRelation}
			>
				{__('Add new relation', 'maxi-blocks')}
			</Button>
			{!isEmpty(relations) && (
				<ListControl>
					{relations.map(item => (
						<ListItemControl
							key={item.id}
							className='maxi-relation-control__item'
							title={
								item.title ||
								__('Untitled relation', 'maxi-blocks')
							}
							content={
								<div className='maxi-relation-control__item__content'>
									<TextControl
										label={__('Title', 'maxi-blocks')}
										value={item.title}
										onChange={value =>
											onChangeRelationProperty(
												item.id,
												'title',
												value
											)
										}
									/>
									<div
										className={classnames(
											'maxi-relation-control__item__content__target',
											getClientId(item.uniqueID) &&
												'maxi-relation-control__item__content__target--has-block'
										)}
									>
										<TextControl
											label={__(
												'Block to affect',
												'maxi-blocks'
											)}
											value={item.uniqueID}
											onChange={value =>
												onChangeRelationProperty(
													item.id,
													'uniqueID',
													value
												)
											}
										/>
									</div>
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
													'Click',
													'maxi-blocks'
												),
												value: 'click',
											},
											{
												label: __(
													'Hover',
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
										label={__('Settings', 'maxi-blocks')}
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
												getClientId(item.uniqueID)
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
									{displaySelectedSetting(item)}
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
