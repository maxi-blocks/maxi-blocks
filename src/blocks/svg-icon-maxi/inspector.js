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
	BlockStylesControl,
	CustomLabel,
	SettingTabsControl,
	SvgColorControl,
	SvgStrokeWidthControl,
	SvgWidthControl,
} from '../../components';
import {
	getColorRGBAString,
	getGroupAttributes,
} from '../../extensions/styles';
import {
	setSVGStrokeWidth,
	setSVGContent,
	setSVGContentHover,
	setSVGContentWithBlockStyle,
} from '../../extensions/svg';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsSvgIcon, categoriesSvgIcon } from './custom-css';
import ResponsiveTabsControl from '../../components/responsive-tabs-control';
import { withMaxiInspector } from '../../extensions/inspector';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
		inlineStylesTargets,
	} = props;
	const { blockStyle, customLabel, isFirstOnHierarchy, svgType } = attributes;

	return (
		<InspectorControls>
			{inspectorTabs.responsiveInfoBox({ props })}
			{deviceType === 'general' && (
				<div className='maxi-tab-content__box sidebar-block-info'>
					<CustomLabel
						customLabel={customLabel}
						onChange={customLabel =>
							maxiSetAttributes({
								customLabel,
							})
						}
					/>
					<BlockStylesControl
						blockStyle={blockStyle}
						isFirstOnHierarchy={isFirstOnHierarchy}
						onChange={obj => {
							const { blockStyle } = obj;

							const {
								'svg-fill-palette-color': svgPaletteFillColor,
								'svg-fill-palette-opacity':
									svgPaletteFillOpacity,
								'svg-fill-color': svgFillColor,
								'svg-line-palette-color': svgPaletteLineColor,
								'svg-line-palette-opacity':
									svgPaletteLineOpacity,
								'svg-line-color': svgLineColor,
							} = attributes;

							const fillColorStr = getColorRGBAString({
								firstVar: 'icon-fill',
								secondVar: `color-${svgPaletteFillColor}`,
								opacity: svgPaletteFillOpacity,
								blockStyle,
							});
							const lineColorStr = getColorRGBAString({
								firstVar: 'icon-stroke',
								secondVar: `color-${svgPaletteLineColor}`,
								opacity: svgPaletteLineOpacity,
								blockStyle,
							});

							maxiSetAttributes({
								...obj,
								content: setSVGContentWithBlockStyle(
									attributes.content,
									attributes['svg-fill-palette-status']
										? fillColorStr
										: svgFillColor,
									attributes['svg-line-palette-status']
										? lineColorStr
										: svgLineColor
								),
							});
						}}
						clientId={clientId}
					/>
				</div>
			)}
			<SettingTabsControl
				target='sidebar-settings-tabs'
				disablePadding
				deviceType={deviceType}
				depth={0}
				items={[
					{
						label: __('Settings', 'maxi-blocks'),
						content: (
							<AccordionControl
								isSecondary
								items={[
									...inspectorTabs.alignment({
										props,
										isAlignment: true,
										disableJustify: true,
									}),
									attributes.content && {
										label: __('Colour', 'maxi-blocks'),
										content: (
											<SvgColorControl
												{...getGroupAttributes(
													attributes,
													'svg'
												)}
												{...getGroupAttributes(
													attributes,
													'svgHover'
												)}
												svgType={svgType}
												maxiSetAttributes={
													maxiSetAttributes
												}
												onChangeInline={(
													obj,
													target
												) => {
													insertInlineStyles({
														obj,
														target,
														isMultiplySelector: true,
													});
												}}
												onChangeFill={obj => {
													maxiSetAttributes(obj);

													if (svgType !== 'Line') {
														const fillColorStr =
															getColorRGBAString({
																firstVar:
																	'icon-fill',
																secondVar: `color-${obj['svg-fill-palette-color']}`,
																opacity:
																	obj[
																		'svg-fill-palette-opacity'
																	],
																blockStyle,
															});
														maxiSetAttributes({
															content:
																setSVGContent(
																	attributes.content,
																	obj[
																		'svg-fill-palette-status'
																	]
																		? fillColorStr
																		: obj[
																				'svg-fill-color'
																		  ],
																	'fill'
																),
														});
														cleanInlineStyles(
															'[data-fill]'
														);
													}
												}}
												onChangeStroke={obj => {
													maxiSetAttributes(obj);

													if (svgType !== 'Shape') {
														const lineColorStr =
															getColorRGBAString({
																firstVar:
																	'icon-stroke',
																secondVar: `color-${obj['svg-line-palette-color']}`,
																opacity:
																	obj[
																		'svg-line-palette-opacity'
																	],
																blockStyle,
															});
														maxiSetAttributes({
															content:
																setSVGContent(
																	attributes.content,
																	obj[
																		'svg-line-palette-status'
																	]
																		? lineColorStr
																		: obj[
																				'svg-line-color'
																		  ],
																	'stroke'
																),
														});
														cleanInlineStyles(
															'[data-stroke]'
														);
													}
												}}
												onChangeHoverFill={obj => {
													maxiSetAttributes(obj);

													if (svgType === 'Filled') {
														const fillColorStrHover =
															getColorRGBAString({
																firstVar:
																	'icon-fill-hover',
																secondVar: `color-${obj['svg-fill-palette-color-hover']}`,
																opacity:
																	obj[
																		'svg-fill-palette-opacity-hover'
																	],
																blockStyle,
															});

														maxiSetAttributes({
															content:
																setSVGContentHover(
																	attributes.content,
																	obj[
																		'svg-fill-palette-status-hover'
																	]
																		? fillColorStrHover
																		: obj[
																				'svg-fill-color-hover'
																		  ],
																	'fill'
																),
														});
													}
												}}
												onChangeHoverStroke={obj => {
													maxiSetAttributes(obj);

													if (svgType === 'Filled') {
														const lineColorStrHover =
															getColorRGBAString({
																firstVar:
																	'icon-stroke-hover',
																secondVar: `color-${obj['svg-line-palette-color-hover']}`,
																opacity:
																	obj[
																		'svg-line-palette-opacity-hover'
																	],
																blockStyle,
															});

														maxiSetAttributes({
															content:
																setSVGContentHover(
																	attributes.content,
																	obj[
																		'svg-line-palette-status-hover'
																	]
																		? lineColorStrHover
																		: obj[
																				'svg-line-color-hover'
																		  ],
																	'stroke'
																),
														});
													}
												}}
											/>
										),
									},

									attributes.content &&
										svgType !== 'Shape' && {
											label: __(
												'Icon line width',
												'maxi-blocks'
											),
											content: (
												<ResponsiveTabsControl
													breakpoint={deviceType}
												>
													<SvgStrokeWidthControl
														{...getGroupAttributes(
															attributes,
															'svg'
														)}
														prefix='svg-'
														onChange={obj => {
															maxiSetAttributes({
																...obj,
																content:
																	setSVGStrokeWidth(
																		attributes.content,
																		obj[
																			`svg-stroke-${deviceType}`
																		]
																	),
															});
														}}
														breakpoint={deviceType}
													/>
												</ResponsiveTabsControl>
											),
										},
									...inspectorTabs.background({
										label: 'SVG',
										props: {
											...props,
										},
										disableImage: true,
										disableVideo: true,
										disableClipPath: true,
										disableSVG: true,
										prefix: 'svg-',
										inlineTarget:
											inlineStylesTargets.background,
									}),
									...inspectorTabs.border({
										props,
										prefix: 'svg-',
									}),
									...inspectorTabs.boxShadow({
										props,
										prefix: 'svg-',
									}),
									attributes.content && {
										label: __(
											'Height / Width',
											'maxi-blocks'
										),
										content: (
											<ResponsiveTabsControl
												breakpoint={deviceType}
											>
												<SvgWidthControl
													{...getGroupAttributes(
														attributes,
														'svg'
													)}
													onChange={obj => {
														maxiSetAttributes(obj);
													}}
													breakpoint={deviceType}
													prefix='svg-'
													enableResponsive
												/>
											</ResponsiveTabsControl>
										),
									},
									...inspectorTabs.marginPadding({
										props,
										prefix: 'svg-',
									}),
								]}
							/>
						),
					},
					{
						label: __('Canvas', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									...inspectorTabs.blockBackground({
										props,
										disableImage: true,
										disableVideo: true,
										disableGradient: true,
										disableSVG: true,
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
									...inspectorTabs.size({
										props,
										block: true,
									}),
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
									deviceType === 'general' && {
										...inspectorTabs.anchor({
											props,
										}),
									},
									...inspectorTabs.customCss({
										props,
										breakpoint: deviceType,
										selectors: selectorsSvgIcon,
										categories: categoriesSvgIcon,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
									}),
									...inspectorTabs.transition({
										props: {
											...props,
										},
									}),
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
									...inspectorTabs.flex({
										props,
									}),
									...inspectorTabs.zindex({
										props,
									}),
									...inspectorTabs.relation({
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
};

export default withMaxiInspector(Inspector);
