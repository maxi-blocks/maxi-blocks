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
	ResponsiveTabsControl,
	SettingTabsControl,
	SvgStrokeWidthControl,
	SvgWidthControl,
} from '../../components';
import { SvgAltControl, SvgColorControl } from './components';
import {
	getAttributeKey,
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import { getColorRGBAString } from '../../extensions/styles';
import { setSVGContentWithBlockStyle } from '../../extensions/svg';
import * as inspectorTabs from '../../components/inspector-tabs';
import { customCss } from './data';
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
	const { blockStyle, customLabel, isFirstOnHierarchy, svgType } =
		getAttributesValue({
			target: [
				'blockStyle',
				'customLabel',
				'isFirstOnHierarchy',
				'svgType',
			],
			props: attributes,
		});
	const { selectors, categories } = customCss;

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
							} = getAttributesValue({
								target: [
									'svg-fill-palette-color',
									'svg-fill-palette-opacity',
									'svg-fill-color',
									'svg-line-palette-color',
									'svg-line-palette-opacity',
									'svg-line-color',
								],
								props: attributes,
							});

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
									getAttributesValue({
										target: 'palette-status',
										prefix: 'svg-fill-',
										props: attributes,
									})
										? fillColorStr
										: svgFillColor,
									getAttributesValue({
										target: 'palette-status',
										prefix: 'svg-line-',
										props: attributes,
									})
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
									{
										label: __('Icon alt', 'maxi-blocks'),
										content: deviceType === 'general' && (
											<SvgAltControl
												altTitle={attributes.altTitle}
												altDescription={
													attributes.altDescription
												}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
											/>
										),
									},
									attributes.content && {
										label: __('Icon colour', 'maxi-blocks'),
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
												cleanInlineStyles={
													cleanInlineStyles
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
												blockStyle={blockStyle}
												content={attributes.content}
											/>
										),
										ignoreIndicator: [
											`svg-width-${deviceType}`,
											`svg-stroke-${deviceType}`,
										],
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
														maxiSetAttributes(obj);
													}}
													content={attributes.content}
													breakpoint={deviceType}
												/>
											),
											ignoreIndicator: [
												'svg-fill-palette-color',
												'svg-fill-palette-status',
												'svg-fill-color',
												'svg-line-palette-color',
												'svg-line-palette-status',
												'svg-line-color',
												`svg-width-${deviceType}`,
											].map(attributeKey =>
												getAttributeKey(attributeKey)
											),
										},
									...inspectorTabs.background({
										label: 'Icon',
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
													content={attributes.content}
													onChange={obj => {
														maxiSetAttributes(obj);
													}}
													breakpoint={deviceType}
													prefix='svg-'
												/>
											</ResponsiveTabsControl>
										),
										ignoreIndicator: [
											'svg-fill-palette-color',
											'svg-fill-palette-status',
											'svg-fill-color',
											'svg-line-palette-color',
											'svg-line-palette-status',
											'svg-line-color',
											`svg-stroke-${deviceType}`,
										].map(attributeKey =>
											getAttributeKey(attributeKey)
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
										selectors,
										categories,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
										selectors,
										categories,
									}),
									...inspectorTabs.transition({
										props,
									}),
									...inspectorTabs.display({
										props,
									}),
									...inspectorTabs.opacity({
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
