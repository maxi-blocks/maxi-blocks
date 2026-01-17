/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AccordionControl from '../../components/accordion-control';
import BlockStylesControl from '../../components/block-styles-control';
import CustomLabel from '../../components/custom-label';
import ResponsiveTabsControl from '../../components/responsive-tabs-control';
import SettingTabsControl from '../../components/setting-tabs-control';
import SvgStrokeWidthControl from '../../components/svg-stroke-width-control';
import SvgWidthControl from '../../components/svg-width-control';
import SvgAltControl from './components/svg-alt-control';
import SvgColorControl from './components/svg-color-control';
import {
	getColorRGBAString,
	getGroupAttributes,
} from '../../extensions/styles';
import { setSVGContentWithBlockStyle } from '../../extensions/svg';
import * as inspectorTabs from '../../components/inspector-tabs';
import { ariaLabelsCategories, customCss } from './data';
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
	const { blockStyle, customLabel, isFirstOnHierarchy, svgType, content } =
		attributes;
	const { selectors, categories } = customCss;

	const onChangeAriaLabel = useCallback(
		({ obj, target, icon }) => {
			maxiSetAttributes({
				...obj,
				...(target === 'svg' && {
					content: icon,
				}),
			});
		},
		[maxiSetAttributes]
	);

	const getAriaIcon = useCallback(
		target => (target === 'svg' ? content : null),
		[content]
	);

	return (
		<InspectorControls>
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
								'svg-fill-palette-status': svgFillPaletteStatus,
								'svg-line-palette-status': svgLinePaletteStatus,
								'svg-fill-palette-sc-status':
									svgFillPaletteSCStatus,
								'svg-line-palette-sc-status':
									svgLinePaletteSCStatus,
							} = attributes;

							const fillColorStr = getColorRGBAString(
								svgFillPaletteSCStatus
									? {
											firstVar: `color-${svgPaletteFillColor}`,
											opacity: svgPaletteFillOpacity,
											blockStyle,
									  }
									: {
											firstVar: 'icon-fill',
											secondVar: `color-${svgPaletteFillColor}`,
											opacity: svgPaletteFillOpacity,
											blockStyle,
									  }
							);
							const lineColorStr = getColorRGBAString(
								svgLinePaletteSCStatus
									? {
											firstVar: `color-${svgPaletteLineColor}`,
											opacity: svgPaletteLineOpacity,
											blockStyle,
									  }
									: {
											firstVar: 'icon-stroke',
											secondVar: `color-${svgPaletteLineColor}`,
											opacity: svgPaletteLineOpacity,
											blockStyle,
									  }
							);

							maxiSetAttributes({
								...obj,
								content: setSVGContentWithBlockStyle(
									attributes.content,
									svgFillPaletteStatus
										? fillColorStr
										: svgFillColor,
									svgLinePaletteStatus
										? lineColorStr
										: svgLineColor
								),
							});
						}}
						clientId={clientId}
					/>
				</div>
			)}
			{inspectorTabs.repeaterInfoBox({ props })}
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
											],
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
										],
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
									...inspectorTabs.ariaLabel({
										props,
										targets: ariaLabelsCategories,
										blockName: props.name,
										onChange: onChangeAriaLabel,
										getIcon: getAriaIcon,
									}),
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
									...inspectorTabs.advancedCss({
										props,
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
