/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AdvancedNumberControl,
	AlignmentControl,
	BlockStylesControl,
	CustomLabel,
	FontLevelControl,
	FullSizeControl,
	SelectControl,
	SettingTabsControl,
	ToggleSwitch,
	TypographyControl,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep } from 'lodash';

/**
 * Inspector
 */
const Inspector = memo(
	props => {
		const { attributes, deviceType, setAttributes, clientId } = props;
		const {
			blockFullWidth,
			blockStyle,
			customLabel,
			isFirstOnHierarchy,
			isList,
			listReversed,
			listStart,
			parentBlockStyle,
			textLevel,
			typeOfList,
		} = attributes;

		return (
			<InspectorControls>
				{inspectorTabs.infoBox({ props, deviceType })}
				<SettingTabsControl
					disablePadding
					deviceType={deviceType}
					items={[
						{
							label: __('Settings', 'maxi-blocks'),
							content: (
								<>
									{deviceType === 'general' && (
										<div className='maxi-tab-content__box'>
											<CustomLabel
												customLabel={customLabel}
												onChange={customLabel =>
													setAttributes({
														customLabel,
													})
												}
											/>
											<BlockStylesControl
												blockStyle={blockStyle}
												isFirstOnHierarchy={
													isFirstOnHierarchy
												}
												onChange={obj =>
													setAttributes(obj)
												}
												clientId={clientId}
											/>
										</div>
									)}
									<AccordionControl
										isSecondary
										items={[
											deviceType === 'general' &&
												!isList && {
													label: __(
														'Heading / Paragraph tag',
														'maxi-blocks'
													),
													content: (
														<FontLevelControl
															{...getGroupAttributes(
																attributes,
																'typography',
																true
															)}
															value={textLevel}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
														/>
													),
												},
											deviceType === 'general' &&
												isList && {
													label: __(
														'List options',
														'maxi-blocks'
													),
													content: (
														<>
															<SelectControl
																label={__(
																	'Type of list',
																	'maxi-blocks'
																)}
																value={
																	typeOfList
																}
																options={[
																	{
																		label: __(
																			'Unorganized',
																			'maxi-blocks'
																		),
																		value: 'ul',
																	},
																	{
																		label: __(
																			'Organized',
																			'maxi-blocks'
																		),
																		value: 'ol',
																	},
																]}
																onChange={typeOfList =>
																	setAttributes(
																		{
																			typeOfList,
																		}
																	)
																}
															/>
															{typeOfList ===
																'ol' && (
																<>
																	<AdvancedNumberControl
																		label={__(
																			'Start From',
																			'maxi-blocks'
																		)}
																		value={
																			listStart
																		}
																		onChangeValue={val => {
																			setAttributes(
																				{
																					listStart:
																						val !==
																							undefined &&
																						val !==
																							''
																							? val
																							: '',
																				}
																			);
																		}}
																		min={
																			-99
																		}
																		max={99}
																		onReset={() =>
																			setAttributes(
																				{
																					listStart:
																						'',
																				}
																			)
																		}
																	/>
																	<SelectControl
																		label={__(
																			'Reverse order',
																			'maxi-blocks'
																		)}
																		value={
																			listReversed
																		}
																		options={[
																			{
																				label: __(
																					'Yes',
																					'maxi-blocks'
																				),
																				value: 1,
																			},
																			{
																				label: __(
																					'No',
																					'maxi-blocks'
																				),
																				value: 0,
																			},
																		]}
																		onChange={value => {
																			setAttributes(
																				{
																					listReversed:
																						Number(
																							value
																						),
																				}
																			);
																		}}
																	/>
																</>
															)}
														</>
													),
												},
											{
												label: __(
													'Alignment',
													'maxi-blocks'
												),
												content: (
													<AlignmentControl
														{...getGroupAttributes(
															attributes,
															'textAlignment'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
														type='text'
													/>
												),
											},
											{
												label: __(
													'Typography',
													'maxi-blocks'
												),
												disablePadding: true,
												content: (
													<SettingTabsControl
														items={[
															{
																label: __(
																	'Normal',
																	'maxi-blocks'
																),
																content: (
																	<TypographyControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'typography',
																				'link',
																			]
																		)}
																		textLevel={
																			textLevel
																		}
																		onChange={obj =>
																			setAttributes(
																				obj
																			)
																		}
																		hideAlignment
																		breakpoint={
																			deviceType
																		}
																		clientId={
																			clientId
																		}
																		isList={
																			isList
																		}
																		blockStyle={
																			parentBlockStyle
																		}
																		allowLink
																	/>
																),
															},
															{
																label: __(
																	'Hover',
																	'maxi-blocks'
																),
																content: (
																	<>
																		<ToggleSwitch
																			label={__(
																				'Enable Typography Hover',
																				'maxi-blocks'
																			)}
																			selected={
																				attributes[
																					'typography-status-hover'
																				]
																			}
																			onChange={val =>
																				setAttributes(
																					{
																						'typography-status-hover':
																							val,
																					}
																				)
																			}
																		/>
																		{attributes[
																			'typography-status-hover'
																		] && (
																			<TypographyControl
																				{...getGroupAttributes(
																					attributes,
																					'typography',
																					true
																				)}
																				textLevel={
																					textLevel
																				}
																				onChange={obj =>
																					setAttributes(
																						obj
																					)
																				}
																				hideAlignment
																				breakpoint={
																					deviceType
																				}
																				clientId={
																					clientId
																				}
																				isList={
																					isList
																				}
																				isHover
																				blockStyle={
																					parentBlockStyle
																				}
																			/>
																		)}
																	</>
																),
															},
														]}
													/>
												),
											},
											...inspectorTabs.background({
												props,
											}),
											...inspectorTabs.border({
												props,
											}),
											...inspectorTabs.boxShadow({
												props,
											}),
											{
												label: __(
													'Height / Width',
													'maxi-blocks'
												),
												content: (
													<>
														{isFirstOnHierarchy && (
															<ToggleSwitch
																label={__(
																	'Set text to full-width',
																	'maxi-blocks'
																)}
																selected={
																	blockFullWidth ===
																	'full'
																}
																onChange={val =>
																	setAttributes(
																		{
																			blockFullWidth:
																				val
																					? 'full'
																					: 'normal',
																		}
																	)
																}
															/>
														)}
														<FullSizeControl
															{...getGroupAttributes(
																attributes,
																'size'
															)}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
														/>
													</>
												),
											},
											...inspectorTabs.marginPadding({
												props,
											}),
										]}
									/>
								</>
							),
						},
						{
							label: __('Advanced', 'maxi-blocks'),
							content: (
								<>
									<AccordionControl
										isPrimary
										items={[
											deviceType === 'general' && {
												...inspectorTabs.customClasses({
													props,
												}),
											},
											...inspectorTabs.motion({
												props,
											}),
											...inspectorTabs.transform({
												props,
											}),
											...inspectorTabs.transition({
												props,
												label: __(
													'Hyperlink hover transition',
													'maxi-blocks'
												),
											}),
											...inspectorTabs.display({
												props,
											}),
											...inspectorTabs.opacity({
												props,
											}),
											...inspectorTabs.position({
												props,
											}),
											deviceType !== 'general' && {
												...inspectorTabs.responsive({
													props,
												}),
											},
											...inspectorTabs.overflow({
												props,
											}),
											...inspectorTabs.zindex({
												props,
											}),
										]}
									/>
								</>
							),
						},
					]}
				/>
			</InspectorControls>
		);
	},
	// Avoids non-necessary renderings
	(
		{
			attributes: oldAttr,
			propsToAvoid,
			isSelected: wasSelected,
			deviceType: oldBreakpoint,
		},
		{ attributes: newAttr, isSelected, deviceType: breakpoint }
	) => {
		if (
			!wasSelected ||
			wasSelected !== isSelected ||
			oldBreakpoint !== breakpoint
		)
			return false;

		const oldAttributes = cloneDeep(oldAttr);
		const newAttributes = cloneDeep(newAttr);

		if (!isEmpty(propsToAvoid)) {
			propsToAvoid.forEach(prop => {
				delete oldAttributes[prop];
				delete newAttributes[prop];
			});

			return isEqual(oldAttributes, newAttributes);
		}

		return isEqual(oldAttributes, newAttributes);
	}
);

export default Inspector;
