/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { RangeControl, SelectControl, TextControl } = wp.components;

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	BackgroundControl,
	BlockStylesControl,
	BorderControl,
	BoxShadowControl,
	SettingTabsControl,
	ZIndexControl,
	ResponsiveControl,
	OpacityControl,
	AxisControl,
	DisplayControl,
	TransformControl,
	FancyRadioControl,
	CustomLabel,
} from '../../components';
import { getDefaultProp, getLastBreakpointValue } from '../../utils';

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
			columnSize,
			verticalAlign,
			opacity,
			background,
			backgroundHover,
			border,
			borderHover,
			boxShadow,
			boxShadowHover,
			padding,
			margin,
			extraClassName,
			zIndex,
			breakpoints,
			display,
			transform,
		},
		deviceType,
		setAttributes,
		clientId,
	} = props;

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
										defaultBlockStyle={defaultBlockStyle}
										isFirstOnHierarchy={isFirstOnHierarchy}
										onChange={obj => setAttributes(obj)}
										disableHighlightText
										disableHighlightBackground
										disableHighlightBorder
										disableHighlightColor1
										disableHighlightColor2
										border={border}
									/>
								</div>
								<AccordionControl
									isPrimary
									items={[
										{
											label: __(
												'Column Settings',
												'maxi-blocks'
											),
											content: (
												<Fragment>
													<RangeControl
														className='maxi-column-size-control'
														label={__(
															'Column Size (%)',
															'maxi-blocks'
														)}
														value={columnSize}
														onChange={val => {
															console.log(val);
															columnSize[
																deviceType
															].size = val;
															document.querySelector(
																`.maxi-column-block__resizer__${uniqueID}`
															).style.width = `${val}%`;

															setAttributes({
																columnSize,
															});
														}}
														min='0'
														max='100'
														step={0.1}
														allowReset
														initialPosition={
															getDefaultProp(
																clientId,
																'columnSize'
															)[deviceType].size
														}
													/>
													<SelectControl
														label={__(
															'Vertical align',
															'maxi-blocks'
														)}
														value={verticalAlign}
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
															{
																label: __(
																	'Space between',
																	'maxi-blocks'
																),
																value:
																	'space-between',
															},
															{
																label: __(
																	'Space around',
																	'maxi-blocks'
																),
																value:
																	'space-around',
															},
														]}
														onChange={verticalAlign =>
															setAttributes({
																verticalAlign,
															})
														}
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
																		disableVideo
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
																			backgroundHover.status
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
																			backgroundHover.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					backgroundHover,
																				}
																			);
																		}}
																	/>
																	{!!backgroundHover.status && (
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
											label: __('Border', 'maxi-blocks'),
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
																	border={
																		border
																	}
																	defaultBorder={getDefaultProp(
																		clientId,
																		'border'
																	)}
																	onChange={border =>
																		setAttributes(
																			{
																				border,
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
																'maxi-blocks'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			borderHover.status
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
																			borderHover.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					borderHover,
																				}
																			);
																		}}
																	/>
																	{!!borderHover.status && (
																		<BorderControl
																			border={
																				borderHover
																			}
																			defaultBorder={getDefaultProp(
																				clientId,
																				'borderHover'
																			)}
																			onChange={borderHover =>
																				setAttributes(
																					{
																						borderHover,
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
																'maxi-blocks'
															),
															content: (
																<Fragment>
																	<FancyRadioControl
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={Number(
																			boxShadowHover.status
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
																			boxShadowHover.status = Number(
																				val
																			);
																			setAttributes(
																				{
																					boxShadowHover,
																				}
																			);
																		}}
																	/>
																	{!!boxShadowHover.status && (
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
												'Padding / Margin',
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
							<AccordionControl
								isPrimary
								items={[
									deviceType === 'general' && {
										label: __(
											'Custom classes',
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
										label: __('Transform', 'maxi-blocks'),
										content: (
											<TransformControl
												transform={transform}
												onChange={transform =>
													setAttributes({ transform })
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
													setAttributes({ display })
												}
												breakpoint={deviceType}
											/>
										),
									},
									deviceType !== 'general' && {
										label: __('Breakpoint', 'maxi-blocks'),
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
													setAttributes({ zIndex })
												}
												breakpoint={deviceType}
											/>
										),
									},
									{
										label: __('Opacity', 'maxi-blocks'),
										content: (
											<OpacityControl
												opacity={opacity}
												defaultOpacity={getDefaultProp(
													clientId,
													'opacity'
												)}
												onChange={opacity =>
													setAttributes({
														opacity,
													})
												}
												breakpoint={deviceType}
											/>
										),
									},
								]}
							/>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
