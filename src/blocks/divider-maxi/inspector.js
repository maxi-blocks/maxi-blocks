/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { TextControl } = wp.components;

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

import FullSizeControl from '../../components/full-size-control/newFullSize';
import DividerControl from '../../components/divider-control/newDividerControl';
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
import OpacityControl from '../../components/opacity-control/newOpacityControl';

import getDefaultAttribute from '../../extensions/styles/getDefaultAttribute';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, setAttributes, clientId } = props;
	const {
		customLabel,
		uniqueID,
		isFirstOnHierarchy,
		blockStyle,
		defaultBlockStyle,
		blockStyleBackground,
		fullWidth,
		extraClassName,
		lineOrientation,
		lineVertical,
		lineHorizontal,
	} = attributes;

	return (
		<InspectorControls>
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
										{...getGroupAttributes(attributes, [
											'border',
											'highlight',
										])}
										blockStyle={blockStyle}
										blockStyleBackground={
											blockStyleBackground
										}
										defaultBlockStyle={defaultBlockStyle}
										isFirstOnHierarchy={isFirstOnHierarchy}
										onChange={obj => setAttributes(obj)}
										disableHighlightText
										disableHighlightBackground
										disableHighlightColor1
										disableHighlightColor2
									/>
								</div>
								<AccordionControl
									isSecondary
									items={[
										deviceType === 'general' && {
											label: __('Line', 'maxi-blocks'),
											content: (
												<Fragment>
													<FancyRadioControl
														fullWidthMode
														label={__(
															'Line Orientation',
															'maxi-blocks'
														)}
														selected={
															lineOrientation
														}
														options={[
															{
																label: __(
																	'Horizontal',
																	'maxi-blocks'
																),
																value:
																	'horizontal',
															},
															{
																label: __(
																	'Vertical',
																	'maxi-blocks'
																),
																value:
																	'vertical',
															},
														]}
														onChange={lineOrientation =>
															setAttributes({
																lineOrientation,
															})
														}
													/>
													<FancyRadioControl
														fullWidthMode
														label={__(
															'Line Vertical Position',
															'maxi-blocks'
														)}
														selected={lineVertical}
														options={[
															{
																label: __(
																	'Top',
																	'maxi-blocks'
																),
																value:
																	'flex-start',
															},
															{
																label: __(
																	'Center',
																	'maxi-blocks'
																),
																value: 'center',
															},
															{
																label: __(
																	'Bottom',
																	'maxi-blocks'
																),
																value:
																	'flex-end',
															},
														]}
														onChange={lineVertical =>
															setAttributes({
																lineVertical,
															})
														}
													/>
													<FancyRadioControl
														fullWidthMode
														label={__(
															'Line Horizontal Position',
															'maxi-blocks'
														)}
														selected={
															lineHorizontal
														}
														options={[
															{
																label: __(
																	'Left',
																	'maxi-blocks'
																),
																value:
																	'flex-start',
															},
															{
																label: __(
																	'Center',
																	'maxi-blocks'
																),
																value: 'center',
															},
															{
																label: __(
																	'Right',
																	'maxi-blocks'
																),
																value:
																	'flex-end',
															},
														]}
														onChange={lineHorizontal =>
															setAttributes({
																lineHorizontal,
															})
														}
													/>
													<DividerControl
														{...getGroupAttributes(
															attributes,
															['divider', 'size']
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														lineOrientation={
															lineOrientation
														}
														breakpoint={deviceType}
														disableColor={
															!!attributes[
																'border-highlight'
															]
														}
													/>
												</Fragment>
											),
										},
										{
											label: __(
												'Width / Height',
												'maxi-blocks'
											),
											content: (
												<Fragment>
													{isFirstOnHierarchy && (
														<FancyRadioControl
															label={__(
																'Full Width',
																'maxi-blocks'
															)}
															selected={fullWidth}
															options={[
																{
																	label: __(
																		'No',
																		'maxi-blocks'
																	),
																	value:
																		'normal',
																},
																{
																	label: __(
																		'Yes',
																		'maxi-blocks'
																	),
																	value:
																		'full',
																},
															]}
															onChange={fullWidth =>
																setAttributes({
																	fullWidth,
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
												</Fragment>
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
																		disableImage
																		disableVideo
																		disableSVG
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
																				'background-hover-status'
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
																					'background-hover-status': !!+val,
																				}
																			)
																		}
																	/>
																	{attributes[
																		'background-hover-status'
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
																			onChange={backgroundHover =>
																				setAttributes(
																					{
																						backgroundHover,
																					}
																				)
																			}
																			disableImage
																			disableVideo
																			disableSVG
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
																			boxShadow={
																				boxShadowHover
																			}
																			defaultBoxShadow={getDefaultProp(
																				clientId,
																				'boxShadowHover'
																			)}
																			onChange={boxShadowHover =>
																				setAttributes(
																					{
																						boxShadowHover,
																					}
																				)
																			}
																			breakpoint={
																				deviceType
																			}
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
															setAttributes(obj)
														}
														breakpoint={deviceType}
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
															setAttributes(obj)
														}
														target='margin'
														breakpoint={deviceType}
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
													onChange={transform =>
														setAttributes({
															transform,
														})
													}
													uniqueID={uniqueID}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __('Display', 'maxi-blocks'),
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
											label: __('Z-index', 'maxi-blocks'),
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
										{
											label: __('Opacity', 'maxi-blocks'),
											content: (
												<OpacityControl
													opacity={
														attributes[
															`opacity-${deviceType}`
														]
													}
													defaultOpacity={getDefaultAttribute(
														`opacity-${deviceType}`,
														clientId
													)}
													onChange={val =>
														setAttributes({
															[`opacity-${deviceType}`]: val,
														})
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
		</InspectorControls>
	);
};

export default Inspector;
