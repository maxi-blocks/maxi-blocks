/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import AccordionControl from '@components/accordion-control';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SettingTabsControl from '@components/setting-tabs-control';
import NumberCounterControl from './components/number-counter-control';
import { getGroupAttributes } from '@extensions/styles';
import * as inspectorTabs from '@components/inspector-tabs';
import { ariaLabelsCategories, customCss } from './data';
import { withMaxiInspector } from '@extensions/inspector';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;
	const { selectors, categories } = customCss;

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
									...inspectorTabs.alignment({
										props: {
											...props,
										},
										isAlignment: true,
										alignmentLabel: __(
											'Counter',
											'maxi-blocks'
										),
										disableJustify: true,
									}),
									{
										label: __('Number', 'maxi-blocks'),
										content: (
											<ResponsiveTabsControl
												breakpoint={deviceType}
											>
												<NumberCounterControl
													{...getGroupAttributes(
														attributes,
														'numberCounter'
													)}
													{...getGroupAttributes(
														attributes,
														'size',
														false,
														'number-counter-'
													)}
													onChangeInline={(
														obj,
														target
													) =>
														insertInlineStyles({
															obj,
															target,
														})
													}
													onChange={(obj, target) => {
														maxiSetAttributes(obj);
														if (!obj.meta?.inline) {
															cleanInlineStyles(
																target
															);
														}
													}}
													breakpoint={deviceType}
													setShowLoader={
														props.setShowLoader
													}
												/>
											</ResponsiveTabsControl>
										),
										ignoreIndicatorGroups: ['alignment'],
									},
									...inspectorTabs.border({
										props,
										prefix: 'number-counter-',
									}),
									...inspectorTabs.boxShadow({
										props,
										prefix: 'number-counter-',
									}),
									...inspectorTabs.marginPadding({
										props,
										prefix: 'number-counter-',
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
										props: {
											...props,
										},
										selectors,
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
