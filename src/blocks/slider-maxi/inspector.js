/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { AccordionControl, SettingTabsControl } from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsSlider, categoriesSlider } from './custom-css';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import SliderControl from './components/slider-control';
import NavigationControl from './components/navigation-control';
import NavigationIconsControl from './components/navigation-control/navigation-control';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		deviceType,
		maxiSetAttributes,
		setEditView,
		isEditView,
		attributes,
		insertInlineStyles,
		cleanInlineStyles,
		inlineStylesTargets,
	} = props;

	const { blockStyle, svgType } = attributes;

	const dotsEnabled = getLastBreakpointAttribute({
		target: 'navigation-dot-status',
		breakpoint: deviceType,
		attributes,
		forceSingle: true,
	});
	const arrowsEnabled = getLastBreakpointAttribute({
		target: 'navigation-arrow-both-status',
		breakpoint: deviceType,
		attributes,
		forceSingle: true,
	});

	return (
		<InspectorControls>
			{inspectorTabs.responsiveInfoBox({ props })}
			{inspectorTabs.blockSettings({
				props,
			})}
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
								isPrimary
								items={[
									{
										label: __(
											'Slider settings',
											'maxi-blocks'
										),
										content: (
											<SliderControl
												{...getGroupAttributes(
													attributes,
													'slider'
												)}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
												isEditView={isEditView}
												setEditView={setEditView}
											/>
										),
									},
									{
										label: __('Navigation', 'maxi-blocks'),
										content: (
											<NavigationControl
												{...getGroupAttributes(
													attributes,
													'navigation'
												)}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
												deviceType={deviceType}
												blockStyle={blockStyle}
											/>
										),
									},
									...(arrowsEnabled && {
										label: __('Arrows', 'maxi-blocks'),
										content: (
											<NavigationIconsControl
												{...getGroupAttributes(
													attributes,
													[
														'arrowIcon',
														'arrowIconBackground',
														'arrowIconBackgroundColor',
														'arrowIconBackgroundGradient',
														'arrowIconBorder',
														'arrowIconBorderRadius',
														'arrowIconBorderWidth',
														'arrowIconPadding',
														'arrowIconBoxShadow',
														'arrowIconHover',
														'arrowIconBackgroundHover',
														'arrowIconBackgroundColorHover',
														'arrowIconBackgroundGradientHover',
														'arrowIconBorderHover',
														'arrowIconBorderRadiusHover',
														'arrowIconBorderWidthHover',
														'arrowIconBoxShadowHover',
													]
												)}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
												deviceType={deviceType}
												insertInlineStyles={
													insertInlineStyles
												}
												cleanInlineStyles={
													cleanInlineStyles
												}
												normalInlineTarget={
													inlineStylesTargets.arrow
												}
												blockStyle={blockStyle}
												svgType={svgType}
												prefix='navigation-arrow-both-icon-'
											/>
										),
									}),
									...(dotsEnabled && {
										label: __('Dots', 'maxi-blocks'),
										content: (
											<NavigationIconsControl
												{...getGroupAttributes(
													attributes,
													[
														'dotIcon',
														'dotIconHover',
														'dotIconActive',
														'dotIconBackground',
														'dotIconBackgroundColor',
														'dotIconBackgroundGradient',
														'dotIconBorder',
														'dotIconBorderRadius',
														'dotIconBorderWidth',
														'dotIconPadding',
														'dotIconBoxShadow',
														'dotIconBackgroundHover',
														'dotIconBackgroundColorHover',
														'dotIconBackgroundGradientHover',
														'dotIconBorderHover',
														'dotIconBorderRadiusHover',
														'dotIconBorderWidthHover',
														'dotIconBoxShadowHover',
													]
												)}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
												deviceType={deviceType}
												insertInlineStyles={
													insertInlineStyles
												}
												cleanInlineStyles={
													cleanInlineStyles
												}
												normalInlineTarget={
													inlineStylesTargets.dot
												}
												activeInlineTarget={
													inlineStylesTargets.dotActive
												}
												blockStyle={blockStyle}
												svgType={svgType}
												prefix='navigation-dot-icon-'
											/>
										),
									}),
									...inspectorTabs.blockBackground({
										props,
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
										selectors: selectorsSlider,
										categories: categoriesSlider,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
										selectors: selectorsSlider,
										categories: categoriesSlider,
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
