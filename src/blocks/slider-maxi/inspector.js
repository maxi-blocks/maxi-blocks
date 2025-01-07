/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import AccordionControl from '@components/accordion-control';
import SettingTabsControl from '@components/setting-tabs-control';
import SliderControl from './components/slider-control';
import NavigationControl from './components/navigation-control';
import NavigationIconsControl from './components/navigation-control/navigation-control';
import * as inspectorTabs from '@components/inspector-tabs';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';

import { ariaLabelsCategories, customCss } from './data';
import { withMaxiInspector } from '@extensions/inspector';

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
			{inspectorTabs.blockSettings({
				props,
			})}
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
														'arrowIconHover',
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
									...inspectorTabs.contextLoop({
										props,
										contentType: 'slider',
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
										selectors: customCss.selectors,
										categories: customCss.categories,
									}),
									...inspectorTabs.advancedCss({
										props,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
										selectors: customCss.selectors,
										categories: customCss.categories,
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
