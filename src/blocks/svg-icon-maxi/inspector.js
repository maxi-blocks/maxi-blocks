/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AlignmentControl,
	AxisControl,
	BackgroundControl,
	BlockStylesControl,
	BorderControl,
	BoxShadowControl,
	CustomLabel,
	DisplayControl,
	EntranceAnimationControl,
	FancyRadioControl,
	MotionControl,
	OpacityControl,
	PositionControl,
	ResponsiveControl,
	SettingTabsControl,
	SvgColor,
	SvgStrokeWidthControl,
	SvgWidthControl,
	TextControl,
	TransformControl,
	InfoBox,
	ZIndexControl,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		changeSVGContent,
		changeSVGContentWithBlockStyle,
		changeSVGSize,
		changeSVGStrokeWidth,
		clientId,
		deviceType,
		setAttributes,
	} = props;
	const {
		blockStyle,
		customLabel,
		extraClassName,
		isFirstOnHierarchy,
		uniqueID,
		fullWidth,
		parentBlockStyle,
	} = attributes;

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
						label: __('Style', 'maxi-blocks'),
						content: (
							<>
								{deviceType === 'general' && (
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
											isFirstOnHierarchy={
												isFirstOnHierarchy
											}
											onChange={obj => {
												setAttributes(obj);
												changeSVGContentWithBlockStyle(
													attributes[
														'svg-palette-fill-color-status'
													]
														? `var(--maxi-${obj.parentBlockStyle}-icon-fill, var(--maxi-${obj.parentBlockStyle}-color-${attributes['svg-palette-fill-color']}))`
														: attributes[
																'svg-fill-color'
														  ],
													attributes[
														'svg-palette-line-color-status'
													]
														? `var(--maxi-${obj.parentBlockStyle}-icon-line, var(--maxi-${obj.parentBlockStyle}-color-${attributes['svg-palette-line-color']}))`
														: attributes[
																'svg-line-color'
														  ]
												);
											}}
											clientId={clientId}
										/>
									</div>
								)}
								<AccordionControl
									isSecondary
									items={[
										isFirstOnHierarchy && {
											label: __(
												'Width / Height',
												'maxi-blocks'
											),
											content: (
												<FancyRadioControl
													label={__(
														'Full Width',
														'maxi-blocks'
													)}
													selected={fullWidth}
													options={[
														{
															label: __(
																'Yes',
																'maxi-blocks'
															),
															value: 'full',
														},
														{
															label: __(
																'No',
																'maxi-blocks'
															),
															value: 'normal',
														},
													]}
													optionType='string'
													onChange={fullWidth =>
														setAttributes({
															fullWidth,
														})
													}
												/>
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
														'alignment'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
													disableJustify
												/>
											),
										},
										attributes.content && {
											label: __(
												'SVG Colors',
												'maxi-blocks'
											),
											content: (
												<>
													<SvgColor
														{...getGroupAttributes(
															attributes,
															'svg'
														)}
														type='fill'
														label={__(
															'SVG Fill',
															'maxi-blocks'
														)}
														onChange={obj => {
															setAttributes(obj);

															changeSVGContent(
																obj[
																	'svg-palette-fill-color-status'
																]
																	? `var(--maxi-${parentBlockStyle}-icon-fill, var(--maxi-${parentBlockStyle}-color-${obj['svg-palette-fill-color']}))`
																	: obj[
																			'svg-fill-color'
																	  ],
																'fill'
															);
														}}
													/>
													<hr />
													<SvgColor
														{...getGroupAttributes(
															attributes,
															'svg'
														)}
														type='line'
														label={__(
															'SVG Line',
															'maxi-blocks'
														)}
														onChange={obj => {
															setAttributes(obj);

															changeSVGContent(
																obj[
																	'svg-palette-line-color-status'
																]
																	? `var(--maxi-${parentBlockStyle}-icon-line, var(--maxi-${parentBlockStyle}-color-${obj['svg-palette-line-color']}))`
																	: obj[
																			'svg-line-color'
																	  ],
																'stroke'
															);
														}}
													/>
												</>
											),
										},
										attributes.content && {
											label: __(
												'SVG Line Width',
												'maxi-blocks'
											),
											content: (
												<SvgStrokeWidthControl
													{...getGroupAttributes(
														attributes,
														'svg'
													)}
													onChange={obj => {
														setAttributes(obj);
														changeSVGStrokeWidth(
															obj['svg-stroke']
														);
													}}
												/>
											),
										},
										attributes.content && {
											label: __(
												'SVG Width',
												'maxi-blocks'
											),
											content: (
												<SvgWidthControl
													{...getGroupAttributes(
														attributes,
														'svg'
													)}
													onChange={obj => {
														setAttributes(obj);
														changeSVGSize(
															obj['svg-width']
														);
													}}
												/>
											),
										},
										{
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
																<>
																	<BackgroundControl
																		{...getGroupAttributes(
																			attributes,
																			[
																				'background',
																				'backgroundColor',
																			]
																		)}
																		onChange={obj =>
																			setAttributes(
																				obj
																			)
																		}
																		disableImage
																		disableVideo
																		disableGradient
																		disableSVG
																		disableClipPath
																		clientId={
																			clientId
																		}
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
																	<FancyRadioControl
																		label={__(
																			'Enable Background Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			attributes[
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
																					'background-status-hover':
																						val,
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
																			disableGradient
																			disableSVG
																			disableClipPath
																			isHover
																			clientId={
																				clientId
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
																	clientId={
																		clientId
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
																<>
																	<FancyRadioControl
																		label={__(
																			'Enable Border Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			attributes[
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
																					'border-status-hover':
																						val,
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
																			isHover
																			clientId={
																				clientId
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
																	clientId={
																		clientId
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
																<>
																	<FancyRadioControl
																		label={__(
																			'Enable Box Shadow Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			attributes[
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
																		onChange={val =>
																			setAttributes(
																				{
																					'box-shadow-status-hover':
																						val,
																				}
																			)
																		}
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
																			clientId={
																				clientId
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
										{
											label: __(
												'Padding / Margin',
												'maxi-blocks'
											),
											content: (
												<>
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
														breakpoint={deviceType}
														target='margin'
													/>
												</>
											),
										},
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
													onChange={val =>
														setAttributes({
															[`opacity-${deviceType}`]:
																val,
														})
													}
												/>
											),
										},
									]}
								/>
							</>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
