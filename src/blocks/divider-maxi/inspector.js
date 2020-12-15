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
	BackgroundControl,
	BlockStylesControl,
	BoxShadowControl,
	FullSizeControl,
	SettingTabsControl,
	DividerControl,
	ZIndexControl,
	AxisControl,
	ResponsiveControl,
	PositionControl,
	DisplayControl,
	MotionControl,
	TransformControl,
	EntranceAnimationControl,
	FancyRadioControl,
	CustomLabel,
} from '../../components';
import { getDefaultProp } from '../../utils';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes: {
			customLabel,
			uniqueID,
			isFirstOnHierarchy,
			blockStyle,
			defaultBlockStyle,
			blockStyleBackground,
			isHighlight,
			lineVertical,
			lineHorizontal,
			lineOrientation,
			divider,
			fullWidth,
			size,
			background,
			backgroundHover,
			boxShadow,
			boxShadowHover,
			padding,
			margin,
			extraClassName,
			zIndex,
			breakpoints,
			position,
			display,
			motion,
			transform,
		},
		deviceType,
		setAttributes,
		clientId,
	} = props;

	const backgroundHoverValue = !isObject(backgroundHover)
		? JSON.parse(backgroundHover)
		: backgroundHover;

	const boxShadowHoverValue = !isObject(boxShadowHover)
		? JSON.parse(boxShadowHover)
		: boxShadowHover;

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
										blockStyle={blockStyle}
										blockStyleBackground={
											blockStyleBackground
										}
										isHighlight={isHighlight}
										defaultBlockStyle={defaultBlockStyle}
										isFirstOnHierarchy={isFirstOnHierarchy}
										onChange={obj => setAttributes(obj)}
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
														divider={divider}
														defaultDivider={getDefaultProp(
															clientId,
															'divider'
														)}
														onChange={divider =>
															setAttributes({
																divider,
															})
														}
														lineOrientation={
															lineOrientation
														}
														breakpoint={deviceType}
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
														size={size}
														defaultSize={getDefaultProp(
															clientId,
															'size'
														)}
														onChange={size =>
															setAttributes({
																size,
															})
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
																'gutenberg-extra'
															),
															content: (
																<Fragment>
																	<BackgroundControl
																		background={
																			background
																		}
																		defaultBackground={getDefaultProp(
																			clientId,
																			'background'
																		)}
																		onChange={background =>
																			setAttributes(
																				{
																					background,
																				}
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
																'gutenberg-extra'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Background Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			backgroundHoverValue.status
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
																			backgroundHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					backgroundHover: JSON.stringify(
																						backgroundHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!backgroundHoverValue.status && (
																		<BackgroundControl
																			background={
																				backgroundHover
																			}
																			defaultBackground={getDefaultProp(
																				clientId,
																				'backgroundHover'
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
																'gutenberg-extra'
															),
															content: (
																<BoxShadowControl
																	boxShadow={
																		boxShadow
																	}
																	defaultBoxShadow={getDefaultProp(
																		clientId,
																		'boxShadow'
																	)}
																	onChange={boxShadow =>
																		setAttributes(
																			{
																				boxShadow,
																			}
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
																'gutenberg-extra'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			boxShadowHoverValue.status
																		)}
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
																			boxShadowHoverValue.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					boxShadowHover: JSON.stringify(
																						boxShadowHoverValue
																					),
																				}
																			);
																		}}
																	/>
																	{!!boxShadowHoverValue.status && (
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
														values={padding}
														defaultValues={getDefaultProp(
															clientId,
															'padding'
														)}
														onChange={padding =>
															setAttributes({
																padding,
															})
														}
														breakpoint={deviceType}
														disableAuto
													/>
													<AxisControl
														values={margin}
														defaultValues={getDefaultProp(
															clientId,
															'margin'
														)}
														onChange={margin =>
															setAttributes({
																margin,
															})
														}
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
													motion={motion}
													onChange={motion =>
														setAttributes({
															motion,
														})
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
													motion={motion}
													defaultMotion={getDefaultProp(
														clientId,
														'motion'
													)}
													onChange={motion =>
														setAttributes({
															motion,
														})
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
													transform={transform}
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
													display={display}
													onChange={display =>
														setAttributes({
															display,
														})
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
													position={position}
													defaultPosition={getDefaultProp(
														clientId,
														'position'
													)}
													onChange={position =>
														setAttributes({
															position,
														})
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
													breakpoints={breakpoints}
													defaultBreakpoints={getDefaultProp(
														clientId,
														'breakpoints'
													)}
													onChange={breakpoints =>
														setAttributes({
															breakpoints,
														})
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __('Z-index', 'maxi-blocks'),
											content: (
												<ZIndexControl
													zIndex={zIndex}
													defaultZIndex={getDefaultProp(
														clientId,
														'zIndex'
													)}
													onChange={zIndex =>
														setAttributes({
															zIndex,
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
