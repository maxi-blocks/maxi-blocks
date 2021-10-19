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
	AlignmentControl,
	BackgroundControl,
	BlockStylesControl,
	CustomLabel,
	DefaultStylesControl,
	FullSizeControl,
	Icon,
	IconControl,
	InfoBox,
	MotionControl,
	SettingTabsControl,
	ToggleSwitch,
	TransformControl,
	TransitionControl,
	TypographyControl,
} from '../../components';
import * as defaultPresets from './defaults';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep } from 'lodash';

/**
 * Icons
 */
import {
	presetOne,
	presetTwo,
	presetThree,
	presetFour,
	presetFive,
	presetSix,
	presetSeven,
	presetEight,
	presetNine,
	presetTen,
	presetEleven,
} from '../../icons';

/**
 * Inspector
 */
const Inspector = memo(
	props => {
		const { attributes, deviceType, setAttributes, clientId } = props;

		const {
			blockStyle,
			customLabel,
			fullWidth,
			isFirstOnHierarchy,
			parentBlockStyle,
			blockFullWidth,
			uniqueID,
		} = attributes;

		const onChangePreset = (number, type = 'normal') => {
			const newDefaultPresets = cloneDeep({ ...defaultPresets });

			if (
				type === 'icon' &&
				!isEmpty(attributes['icon-content']) &&
				attributes['icon-content'] !==
					defaultPresets[`preset${number}`]['icon-content']
			)
				newDefaultPresets[`preset${number}`]['icon-content'] =
					attributes['icon-content'];

			setAttributes({
				...newDefaultPresets[`preset${number}`],
			});
		};

		return (
			<InspectorControls>
				{deviceType !== 'general' && (
					<InfoBox
						message={__(
							'You are currently in responsive editing mode. Select Base to continue editing general settings.',
							'maxi-blocks'
						)}
					/>
				)}
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
											deviceType === 'general' && {
												label: __(
													'Style shortcut',
													'maxi-blocks'
												),
												content: (
													<DefaultStylesControl
														className='maxi-button-default-styles'
														items={[
															{
																label: __(
																	'Button shortcut 1',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetOne
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		1
																	),
															},
															{
																label: __(
																	'Button shortcut 2',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetTwo
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		2
																	),
															},
															{
																label: __(
																	'Button shortcut 3',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetThree
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		3
																	),
															},
															{
																label: __(
																	'Button shortcut 4',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetFour
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		4,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 5',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetFive
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		5,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 6',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetSix
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		6,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 7',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetSeven
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		7,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 8',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetEight
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		8,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 9',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetNine
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		9,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 10',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetTen
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		10,
																		'icon'
																	),
															},
															{
																label: __(
																	'Button shortcut 11',
																	'maxi-blocks'
																),
																content: (
																	<Icon
																		icon={
																			presetEleven
																		}
																	/>
																),
																onChange: () =>
																	onChangePreset(
																		11,
																		'icon'
																	),
															},
														]}
													/>
												),
											},
											{
												label: __(
													'Icon',
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
																	<IconControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'icon',
																				'iconBackgroundGradient',
																				'iconBackgroundColor',
																				'iconBorder',
																				'iconBorderWidth',
																				'iconBorderRadius',
																				'iconPadding',
																			]
																		)}
																		onChange={obj => {
																			setAttributes(
																				obj
																			);
																		}}
																		breakpoint={
																			deviceType
																		}
																		clientId={
																			clientId
																		}
																		parentBlockStyle={
																			parentBlockStyle
																		}
																	/>
																),
															},
															{
																label: __(
																	'Hover',
																	'maxi-blocks'
																),
																content: (
																	<IconControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'icon',
																				'iconBackgroundGradient',
																				'iconBackgroundColor',
																				'iconBorder',
																				'iconBorderWidth',
																				'iconBorderRadius',
																			],
																			true
																		)}
																		onChange={obj => {
																			setAttributes(
																				obj
																			);
																		}}
																		breakpoint={
																			deviceType
																		}
																		clientId={
																			clientId
																		}
																		parentBlockStyle={
																			parentBlockStyle
																		}
																		isHover
																	/>
																),
															},
														]}
													/>
												),
											},
											{
												label: __(
													'Alignment',
													'maxi-blocks'
												),
												content: (
													<>
														<AlignmentControl
															label={__(
																'Button',
																'maxi-blocks'
															)}
															{...getGroupAttributes(
																attributes,
																'alignment'
															)}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
															disableJustify
														/>
														<AlignmentControl
															label={__(
																'Text',
																'maxi-blocks'
															)}
															{...getGroupAttributes(
																attributes,
																'textAlignment'
															)}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
															type='text'
														/>
													</>
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
																			'typography'
																		)}
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
																		disableCustomFormats
																		blockStyle={
																			parentBlockStyle
																		}
																		styleCardPrefix='button'
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
																					[
																						'typography',
																						'typographyHover',
																					]
																				)}
																				onChange={obj =>
																					setAttributes(
																						obj
																					)
																				}
																				hideAlignment
																				breakpoint={
																					deviceType
																				}
																				isHover
																				clientId={
																					clientId
																				}
																				disableCustomFormats
																				blockStyle={
																					parentBlockStyle
																				}
																				styleCardPrefix='button'
																			/>
																		)}
																	</>
																),
															},
														]}
													/>
												),
											},
											deviceType === 'general' && {
												label: __(
													'Button background',
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
																	<>
																		<BackgroundControl
																			{...getGroupAttributes(
																				attributes,
																				[
																					'background',
																					'backgroundColor',
																					'backgroundGradient',
																				],
																				false,
																				'button-'
																			)}
																			prefix='button-'
																			onChange={obj =>
																				setAttributes(
																					obj
																				)
																			}
																			disableImage
																			disableVideo
																			disableClipPath
																			disableSVG
																			disableLayers
																			clientId={
																				clientId
																			}
																			isButton
																		/>
																	</>
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
																				'Enable Background Hover',
																				'maxi-blocks'
																			)}
																			selected={
																				attributes[
																					'button-background-hover-status'
																				]
																			}
																			className='maxi-background-status-hover'
																			onChange={val =>
																				setAttributes(
																					{
																						...(val &&
																							setHoverAttributes(
																								{
																									...getGroupAttributes(
																										attributes,
																										[
																											'background',
																											'backgroundColor',
																											'backgroundGradient',
																										],
																										false,
																										'button-'
																									),
																								},
																								{
																									...getGroupAttributes(
																										attributes,
																										[
																											'background',
																											'backgroundColor',
																											'backgroundGradient',
																										],
																										true,
																										'button-'
																									),
																								}
																							)),
																						'button-background-hover-status':
																							val,
																					}
																				)
																			}
																		/>
																		{attributes[
																			'button-background-hover-status'
																		] && (
																			<BackgroundControl
																				{...getGroupAttributes(
																					attributes,
																					[
																						'background',
																						'backgroundColor',
																						'backgroundGradient',
																					],
																					true,
																					'button-'
																				)}
																				prefix='button-'
																				onChange={obj =>
																					setAttributes(
																						obj
																					)
																				}
																				disableImage
																				disableVideo
																				disableClipPath
																				disableSVG
																				disableLayers
																				isHover
																				clientId={
																					clientId
																				}
																				isButton
																			/>
																		)}
																	</>
																),
															},
														]}
													/>
												),
											},
											...inspectorTabs.border({
												props,
												prefix: 'button-',
											}),
											...inspectorTabs.boxShadow({
												props,
												prefix: 'button-',
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
																	'Set button to full-width',
																	'maxi-blocks'
																)}
																selected={
																	fullWidth ===
																	'full'
																}
																onChange={val =>
																	setAttributes(
																		{
																			fullWidth:
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
																'size',
																false,
																'button-'
															)}
															prefix='button-'
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
												prefix: 'button-',
											}),
										]}
									/>
								</>
							),
						},
						{
							label: __('Canvas', 'maxi-blocks'),
							content: (
								<AccordionControl
									isPrimary
									items={[
										...inspectorTabs.background({
											props,
										}),
										...inspectorTabs.border({
											props,
										}),
										...inspectorTabs.boxShadow({
											props,
										}),
										...inspectorTabs.opacity({
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
																'Set button canvas to full-width',
																'maxi-blocks'
															)}
															selected={
																blockFullWidth ===
																'full'
															}
															onChange={val =>
																setAttributes({
																	blockFullWidth:
																		val
																			? 'full'
																			: 'normal',
																})
															}
														/>
													)}
													<FullSizeControl
														{...getGroupAttributes(
															attributes,
															'size'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
													/>
												</>
											),
										},
										...inspectorTabs.marginPadding({
											props,
										}),
									]}
								/>
							),
						},
						{
							label: __('Advanced', 'maxi-blocks'),
							content: (
								<AccordionControl
									isPrimary
									items={[
										deviceType === 'general' && {
											...inspectorTabs.customClasses({
												props,
											}),
										},
										{
											label: __(
												'Motion effect',
												'maxi-blocks'
											),
											content: (
												<MotionControl
													{...getGroupAttributes(
														attributes,
														'motion'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
												/>
											),
										},
										{
											label: __(
												'Transform',
												'maxi-blocks'
											),
											content: (
												<TransformControl
													{...getGroupAttributes(
														attributes,
														'transform'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													uniqueID={uniqueID}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __(
												'Hover transition',
												'maxi-blocks'
											),
											content: (
												<TransitionControl
													{...getGroupAttributes(
														attributes,
														'transitionDuration'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
										...inspectorTabs.display({
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
