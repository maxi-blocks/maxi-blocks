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
	const [blockStyle, customLabel, isFirstOnHierarchy, svgType] =
		getAttributesValue({
			target: ['_bs', '_cl', '_ioh', '_st'],
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
								_cl: customLabel,
							})
						}
					/>
					<BlockStylesControl
						blockStyle={blockStyle}
						isFirstOnHierarchy={isFirstOnHierarchy}
						onChange={obj => {
							const { blockStyle } = obj;

							const [
								svgPaletteFillColor,
								svgPaletteFillOpacity,
								svgFillColor,
								svgPaletteLineColor,
								svgPaletteLineOpacity,
								svgLineColor,
							] = getAttributesValue({
								target: [
									's-f_pc',
									's-f_po',
									's-f_cc',
									's-l_pc',
									's-l_po',
									's-l_cc',
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
								_c: setSVGContentWithBlockStyle(
									attributes._c,
									getAttributesValue({
										target: '_ps',
										prefix: 's-f-',
										props: attributes,
									})
										? fillColorStr
										: svgFillColor,
									getAttributesValue({
										target: '_ps',
										prefix: 's-l-',
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
									attributes._c && {
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
												content={attributes._c}
											/>
										),
										ignoreIndicator: [
											`s_w-${deviceType}`,
											`s-str-${deviceType}`,
										],
									},

									attributes._c &&
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
													prefix='s-'
													onChange={obj => {
														maxiSetAttributes(obj);
													}}
													content={attributes._c}
													breakpoint={deviceType}
												/>
											),
											ignoreIndicator: [
												's-f_pc',
												's-f_ps',
												's-f_cc',
												's-l_pc',
												's-l_ps',
												's-l_cc',
												`s_w-${deviceType}`,
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
										prefix: 's-',
										inlineTarget:
											inlineStylesTargets.background,
									}),
									...inspectorTabs.border({
										props,
										prefix: 's-',
									}),
									...inspectorTabs.boxShadow({
										props,
										prefix: 's-',
									}),
									attributes._c && {
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
													content={attributes._c}
													onChange={obj => {
														maxiSetAttributes(obj);
													}}
													breakpoint={deviceType}
													prefix='s-'
												/>
											</ResponsiveTabsControl>
										),
										ignoreIndicator: [
											's-f_pc',
											's-f_ps',
											's-f_cc',
											's-l_pc',
											's-l_ps',
											's-l_cc',
											`s-str-${deviceType}`,
										].map(attributeKey =>
											getAttributeKey(attributeKey)
										),
									},
									...inspectorTabs.marginPadding({
										props,
										prefix: 's-',
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
