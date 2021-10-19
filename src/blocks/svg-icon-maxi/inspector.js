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
	BlockStylesControl,
	CustomLabel,
	FullSizeControl,
	InfoBox,
	SettingTabsControl,
	SvgColor,
	SvgStrokeWidthControl,
	SvgWidthControl,
	ToggleSwitch,
} from '../../components';
import {
	getColorRGBAString,
	getGroupAttributes,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';

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
		setAttributes,
	} = props;
	const {
		blockFullWidth,
		blockStyle,
		customLabel,
		isFirstOnHierarchy,
		parentBlockStyle,
		svgType,
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
						label: __('Settings', 'maxi-blocks'),
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
										<BlockStylesControl
											blockStyle={blockStyle}
											isFirstOnHierarchy={
												isFirstOnHierarchy
											}
											onChange={obj => {
												setAttributes(obj);

												const { parentBlockStyle } =
													obj;

												const {
													'svg-palette-fill-color':
														svgPaletteFillColor,
													'svg-palette-fill-opacity':
														svgPaletteFillOpacity,
													'svg-fill-color':
														svgFillColor,
													'svg-palette-line-color':
														svgPaletteLineColor,
													'svg-palette-line-opacity':
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
														'svg-palette-fill-color-status'
													]
														? fillColorStr
														: svgFillColor,
													attributes[
														'svg-palette-line-color-status'
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
																	setAttributes(
																		obj
																	);

																	const fillColorStr =
																		getColorRGBAString(
																			{
																				firstVar:
																					'icon-fill',
																				secondVar: `color-${obj['svg-palette-fill-color']}`,
																				opacity:
																					obj[
																						'svg-palette-fill-opacity'
																					],
																				blockStyle:
																					parentBlockStyle,
																			}
																		);

																	changeSVGContent(
																		obj[
																			'svg-palette-fill-color-status'
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
																setAttributes(
																	obj
																);

																const lineColorStr =
																	getColorRGBAString(
																		{
																			firstVar:
																				'icon-line',
																			secondVar: `color-${obj['svg-palette-line-color']}`,
																			opacity:
																				obj[
																					'svg-palette-line-opacity'
																				],
																			blockStyle:
																				parentBlockStyle,
																		}
																	);

																changeSVGContent(
																	obj[
																		'svg-palette-line-color-status'
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
															setAttributes(obj);
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
														setAttributes(obj);
													}}
													breakpoint={deviceType}
													prefix='svg-'
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
									...inspectorTabs.background({
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
									isFirstOnHierarchy && {
										label: __(
											'Height / Width',
											'maxi-blocks'
										),
										content: (
											<>
												{isFirstOnHierarchy && (
													<ToggleSwitch
														label={__(
															'Set svg icon to full-width',
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
							</>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
