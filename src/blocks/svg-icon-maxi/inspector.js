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
	SvgColor,
	SvgStrokeWidthControl,
	SvgWidthControl,
} from '../../components';
import {
	getColorRGBAString,
	getGroupAttributes,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsSvgIcon, categoriesSvgIcon } from './custom-css';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		changeSVGContent,
		changeSVGContentWithBlockStyle,
		changeSVGStrokeWidth,
		clientId,
		deviceType,
		maxiSetAttributes,
	} = props;
	const {
		blockStyle,
		customLabel,
		isFirstOnHierarchy,
		parentBlockStyle,
		svgType,
	} = attributes;

	return (
		<InspectorControls>
			{inspectorTabs.responsiveInfoBox({ props })}
			<SettingTabsControl
				target='sidebar-settings-tabs'
				disablePadding
				deviceType={deviceType}
				depth={0}
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
												maxiSetAttributes({
													customLabel,
												})
											}
										/>
										<BlockStylesControl
											blockStyle={blockStyle}
											isFirstOnHierarchy={
												isFirstOnHierarchy
											}
											onChange={obj => {
												maxiSetAttributes(obj);

												const { parentBlockStyle } =
													obj;

												const {
													'svg-fill-palette-color':
														svgPaletteFillColor,
													'svg-fill-palette-opacity':
														svgPaletteFillOpacity,
													'svg-fill-color':
														svgFillColor,
													'svg-line-palette-color':
														svgPaletteLineColor,
													'svg-line-palette-opacity':
														svgPaletteLineOpacity,
													'svg-line-color':
														svgLineColor,
												} = attributes;

												const fillColorStr =
													getColorRGBAString({
														firstVar: 'icon-fill',
														secondVar: `color-${svgPaletteFillColor}`,
														opacity:
															svgPaletteFillOpacity,
														blockStyle:
															parentBlockStyle,
													});
												const lineColorStr =
													getColorRGBAString({
														firstVar: 'icon-line',
														secondVar: `color-${svgPaletteLineColor}`,
														opacity:
															svgPaletteLineOpacity,
														blockStyle:
															parentBlockStyle,
													});

												changeSVGContentWithBlockStyle(
													attributes[
														'svg-fill-palette-status'
													]
														? fillColorStr
														: svgFillColor,
													attributes[
														'svg-line-palette-status'
													]
														? lineColorStr
														: svgLineColor
												);
											}}
											clientId={clientId}
										/>
									</div>
								)}
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
												<>
													{svgType !== 'Line' && (
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
																	maxiSetAttributes(
																		obj
																	);

																	const fillColorStr =
																		getColorRGBAString(
																			{
																				firstVar:
																					'icon-fill',
																				secondVar: `color-${obj['svg-fill-palette-color']}`,
																				opacity:
																					obj[
																						'svg-fill-palette-opacity'
																					],
																				blockStyle:
																					parentBlockStyle,
																			}
																		);

																	changeSVGContent(
																		obj[
																			'svg-fill-palette-status'
																		]
																			? fillColorStr
																			: obj[
																					'svg-fill-color'
																			  ],
																		'fill'
																	);
																}}
															/>
															{svgType ===
																'Filled' && (
																<hr />
															)}
														</>
													)}
													{svgType !== 'Shape' && (
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
																maxiSetAttributes(
																	obj
																);

																const lineColorStr =
																	getColorRGBAString(
																		{
																			firstVar:
																				'icon-line',
																			secondVar: `color-${obj['svg-line-palette-color']}`,
																			opacity:
																				obj[
																					'svg-line-palette-opacity'
																				],
																			blockStyle:
																				parentBlockStyle,
																		}
																	);

																changeSVGContent(
																	obj[
																		'svg-line-palette-status'
																	]
																		? lineColorStr
																		: obj[
																				'svg-line-color'
																		  ],
																	'stroke'
																);
															}}
														/>
													)}
												</>
											),
										},
										attributes.content &&
											svgType !== 'Shape' && {
												label: __(
													'Icon line width',
													'maxi-blocks'
												),
												content: (
													<SvgStrokeWidthControl
														{...getGroupAttributes(
															attributes,
															'svg'
														)}
														prefix='svg-'
														onChange={obj => {
															maxiSetAttributes(
																obj
															);
															changeSVGStrokeWidth(
																obj[
																	`svg-stroke-${deviceType}`
																]
															);
														}}
														breakpoint={deviceType}
													/>
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
											),
										},
										...inspectorTabs.marginPadding({
											props,
											prefix: 'svg-',
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
							<>
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
