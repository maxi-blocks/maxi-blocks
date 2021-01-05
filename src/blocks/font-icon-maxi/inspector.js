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
	BorderControl,
	SettingTabsControl,
	AlignmentControl,
	ZIndexControl,
	AxisControl,
	ResponsiveControl,
	PositionControl,
	DisplayControl,
	MotionControl,
	TransformControl,
	EntranceAnimationControl,
	FancyRadioControl,
	FontIconControl,
	CustomLabel,
} from '../../components';
import { getDefaultProp } from '../../utils';

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
			background,
			boxShadow,
			border,
			padding,
			margin,
			extraClassName,
			zIndex,
			breakpoints,
			position,
			display,
			motion,
			transform,
			alignment,
		},
		deviceType,
		setAttributes,
		clientId,
	} = props;
	const backgroundHover = { ...props.attributes.backgroundHover };
	const icon = { ...props.attributes.icon };
	const boxShadowHover = { ...props.attributes.boxShadowHover };
	const borderHover = { ...props.attributes.borderHover };
	const highlight = { ...props.attributes.highlight };

	return (
		<InspectorControls>
			{icon.icon && (
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
											highlight={highlight}
											onChange={obj => setAttributes(obj)}
											disableHighlightColor1
											disableHighlightColor2
											border={border}
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
													<AlignmentControl
														label={__(
															'Alignment',
															'maxi-blocks'
														)}
														alignment={alignment}
														onChange={alignment =>
															setAttributes({
																alignment,
															})
														}
														breakpoint={deviceType}
														disableJustify
													/>
												),
											},
											{
												label: __(
													'Icon',
													'maxi-blocks'
												),
												content: (
													<Fragment>
														<FontIconControl
															icon={icon}
															onChange={obj => {
																setAttributes(
																	obj
																);
															}}
															breakpoint={
																deviceType
															}
															simpleMode
															disableColor={
																!!highlight.textHighlight
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
																			disableColor={
																				!!highlight.backgroundHighlight
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
																				disableColor={
																					!!highlight.backgroundHighlight
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
																		disableColor={
																			!!highlight.borderHighlight
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
																				disableColor={
																					!!highlight.borderHighlight
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
																				'Enable Box Shadow Hover',
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
															breakpoint={
																deviceType
															}
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
															breakpoint={
																deviceType
															}
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
												label: __(
													'Display',
													'maxi-blocks'
												),
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
														breakpoints={
															breakpoints
														}
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
												label: __(
													'Z-index',
													'maxi-blocks'
												),
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
			)}
		</InspectorControls>
	);
};

export default Inspector;
