/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { TextControl } = wp.components;

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	BlockStylesControl,
	SettingTabsControl,
	FancyRadioControl,
	CustomLabel,
} from '../../components';

import BorderControl from '../../components/border-control/newBorderControl';
import BoxShadowControl from '../../components/box-shadow-control/newBoxShadowControl';
import AxisControl from '../../components/axis-control/newAxisControl';
import BackgroundControl from '../../components/new-background-control';
import MotionControl from '../../components/new-motion-control';
import EntranceAnimationControl from '../../components/entrance-animation-control/newEntranceControl';
import TransformControl from '../../components/new-transform-control';
import DisplayControl from '../../components/display-control/newDisplayControl';
import PositionControl from '../../components/position-control/newPositionControl';
import ResponsiveControl from '../../components/responsive-control/newResponsiveControl';
import ZIndexControl from '../../components/zindex-control/newIndexControl';
import AlignmentControl from '../../components/alignment-control/newAlignmentControl';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import FontIconControl from '../../components/font-icon-control/newFontIconControl';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, setAttributes } = props;
	const {
		customLabel,
		uniqueID,
		isFirstOnHierarchy,
		blockStyle,
		defaultBlockStyle,
		blockStyleBackground,
		extraClassName,
	} = attributes;

	return (
		<InspectorControls>
			{!isEmpty(attributes['icon-name']) && (
				<SettingTabsControl
					disablePadding
					items={[
						{
							label: __('Style', 'maxi-blocks'),
							content: (
								<Fragment>
									<div className='maxi-tab-content__box'>
										<CustomLabel
											customLabel={customLabel}
											onChange={customLabel =>
												setAttributes({ customLabel })
											}
										/>
										<hr />
										<BlockStylesControl
											blockStyle={blockStyle}
											blockStyleBackground={
												blockStyleBackground
											}
											defaultBlockStyle={
												defaultBlockStyle
											}
											isFirstOnHierarchy={
												isFirstOnHierarchy
											}
											onChange={obj => setAttributes(obj)}
											disableHighlightColor1
											disableHighlightColor2
											{...getGroupAttributes(attributes, [
												'border',
												'highlight',
											])}
										/>
									</div>
									<AccordionControl
										isSecondary
										items={[
											{
												label: __(
													'Alignment',
													'maxi-blocks'
												),
												content: (
													<Fragment>
														<AlignmentControl
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
															disableJustify
															type='text'
														/>
													</Fragment>
												),
											},
											{
												label: __(
													'Icon',
													'maxi-blocks'
												),
												content: (
													<FontIconControl
														{...getGroupAttributes(
															attributes,
															'icon'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
														simpleMode
														disableColor={
															!!attributes[
																'text-highlight'
															]
														}
													/>
												),
											},

											deviceType === 'general' && {
												label: __(
													'Background',
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
																	<Fragment>
																		<BackgroundControl
																			{...getGroupAttributes(
																				attributes,
																				[
																					'background',
																					'backgroundColor',
																					'backgroundGradient',
																				]
																			)}
																			onChange={obj =>
																				setAttributes(
																					obj
																				)
																			}
																			disableColor={
																				!!attributes[
																					'background-highlight'
																				]
																			}
																			disableVideo
																			disableSVG
																			disableImage
																		/>
																	</Fragment>
																),
															},
															{
																label: __(
																	'Hover',
																	'maxi-blocks'
																),
																content: (
																	<Fragment>
																		<FancyRadioControl
																			label={__(
																				'Enable Background Hover',
																				'maxi-blocks'
																			)}
																			selected={
																				+attributes[
																					'background-status-hover'
																				]
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
																			onChange={val =>
																				setAttributes(
																					{
																						'background-status-hover': !!+val,
																					}
																				)
																			}
																		/>
																		{attributes[
																			'background-status-hover'
																		] && (
																			<BackgroundControl
																				{...getGroupAttributes(
																					attributes,
																					[
																						'backgroundHover',
																						'backgroundColorHover',
																						'backgroundGradientHover',
																					]
																				)}
																				onChange={obj =>
																					setAttributes(
																						obj
																					)
																				}
																				disableColor={
																					!!attributes[
																						'background-Highlight'
																					]
																				}
																				disableImage
																				disableVideo
																				disableClipPath
																				disableSVG
																				disableLayers
																				isHover
																			/>
																		)}
																	</Fragment>
																),
															},
														]}
													/>
												),
											},
											{
												label: __(
													'Border',
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
																	<BorderControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'border',
																				'borderWidth',
																				'borderRadius',
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
																		disableColor={
																			!!attributes[
																				'border-highlight'
																			]
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
																	<Fragment>
																		<FancyRadioControl
																			label={__(
																				'Enable Border Hover',
																				'maxi-blocks'
																			)}
																			selected={
																				+attributes[
																					'border-status-hover'
																				]
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
																			onChange={val =>
																				setAttributes(
																					{
																						'border-status-hover': !!+val,
																					}
																				)
																			}
																		/>
																		{attributes[
																			'border-status-hover'
																		] && (
																			<BorderControl
																				{...getGroupAttributes(
																					attributes,
																					[
																						'borderHover',
																						'borderWidthHover',
																						'borderRadiusHover',
																					]
																				)}
																				onChange={obj =>
																					setAttributes(
																						obj
																					)
																				}
																				breakpoint={
																					deviceType
																				}
																				disableColor={
																					!!attributes[
																						'border-highlight'
																					]
																				}
																				isHover
																			/>
																		)}
																	</Fragment>
																),
															},
														]}
													/>
												),
											},
											{
												label: __(
													'Box Shadow',
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
																	<BoxShadowControl
																		{...getGroupAttributes(
																			attributes,
																			'boxShadow'
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
																),
															},
															{
																label: __(
																	'Hover',
																	'maxi-blocks'
																),
																content: (
																	<Fragment>
																		<FancyRadioControl
																			label={__(
																				'Enable Box Shadow Hover',
																				'maxi-blocks'
																			)}
																			selected={
																				+attributes[
																					'box-shadow-status-hover'
																				]
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
																			onChange={val => {
																				setAttributes(
																					{
																						'box-shadow-status-hover': !!+val,
																					}
																				);
																			}}
																		/>
																		{attributes[
																			'box-shadow-status-hover'
																		] && (
																			<BoxShadowControl
																				{...getGroupAttributes(
																					attributes,
																					'boxShadowHover'
																				)}
																				onChange={obj =>
																					setAttributes(
																						obj
																					)
																				}
																				breakpoint={
																					deviceType
																				}
																				isHover
																			/>
																		)}
																	</Fragment>
																),
															},
														]}
													/>
												),
											},
											{
												label: __(
													'Padding & Margin',
													'maxi-blocks'
												),
												content: (
													<Fragment>
														<AxisControl
															{...getGroupAttributes(
																attributes,
																'padding'
															)}
															label={__(
																'Padding',
																'maxi-blocks'
															)}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
															target='padding'
															disableAuto
														/>
														<AxisControl
															{...getGroupAttributes(
																attributes,
																'margin'
															)}
															label={__(
																'Margin',
																'maxi-blocks'
															)}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
															breakpoint={
																deviceType
															}
															target='margin'
														/>
													</Fragment>
												),
											},
										]}
									/>
								</Fragment>
							),
						},
						{
							label: __('Advanced', 'maxi-blocks'),
							content: (
								<Fragment>
									<AccordionControl
										isPrimary
										items={[
											deviceType === 'general' && {
												label: __(
													'Custom Classes',
													'maxi-blocks'
												),
												content: (
													<TextControl
														label={__(
															'Additional CSS Classes',
															'maxi-blocks'
														)}
														className='maxi-additional__css-classes'
														value={extraClassName}
														onChange={extraClassName =>
															setAttributes({
																extraClassName,
															})
														}
													/>
												),
											},
											{
												label: __(
													'Motion Effects',
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
													'Entrance Animation',
													'maxi-blocks'
												),
												content: (
													<EntranceAnimationControl
														{...getGroupAttributes(
															attributes,
															'entrance'
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
													'Display',
													'maxi-blocks'
												),
												content: (
													<DisplayControl
														{...getGroupAttributes(
															attributes,
															'display'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
														defaultDisplay='flex'
													/>
												),
											},
											{
												label: __(
													'Position',
													'maxi-blocks'
												),
												content: (
													<PositionControl
														{...getGroupAttributes(
															attributes,
															'position'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
													/>
												),
											},
											deviceType !== 'general' && {
												label: __(
													'Breakpoint',
													'maxi-blocks'
												),
												content: (
													<ResponsiveControl
														{...getGroupAttributes(
															attributes,
															'breakpoints'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
													/>
												),
											},
											{
												label: __(
													'Z-index',
													'maxi-blocks'
												),
												content: (
													<ZIndexControl
														{...getGroupAttributes(
															attributes,
															'zIndex'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
													/>
												),
											},
										]}
									/>
								</Fragment>
							),
						},
					]}
				/>
			)}
		</InspectorControls>
	);
};

export default Inspector;
