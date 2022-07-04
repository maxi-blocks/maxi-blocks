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
	SettingTabsControl,
	SliderControl,
	NavigationControl,
	NavigationDotControl,
	NavigationArrowControl,
} from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsSlider, categoriesSlider } from './custom-css';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * External dependencies
 */

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
	} = props;

	const { blockStyle, svgType } = attributes;

	const navigationType = getLastBreakpointAttribute({
		target: 'navigation-type',
		breakpoint: deviceType,
		attributes,
		forceSingle: true,
	});

	console.log('arrow');
	console.log(
		getGroupAttributes(attributes, [
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
		])
	);

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
								{inspectorTabs.blockSettings({
									props,
								})}
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
											label: __(
												'Navigation',
												'maxi-blocks'
											),
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
										...(navigationType.includes(
											'arrow'
										) && {
											label: __('Arrows', 'maxi-blocks'),
											content: (
												<NavigationArrowControl
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
													blockStyle={blockStyle}
													svgType={svgType}
												/>
											),
										}),
										...(navigationType.includes('dot') && {
											label: __('Dots', 'maxi-blocks'),
											content: (
												<NavigationDotControl
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
													blockStyle={blockStyle}
													svgType={svgType}
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
							</>
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
