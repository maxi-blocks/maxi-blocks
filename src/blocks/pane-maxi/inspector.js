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
import * as inspectorTabs from '@components/inspector-tabs';
import { withMaxiInspector } from '@extensions/inspector';
import { ariaLabelsCategories, customCss } from './data';

/**
 * Inspector
 */
const Inspector = props => {
	const { deviceType } = props;
	const { selectors, categories } = customCss;

	const getBaseSettings = (prefix, inlineTarget, label) => [
		...inspectorTabs.background({
			props,
			label,
			prefix,
			inlineTarget,
			disableImage: true,
			disableVideo: true,
			disableSVG: true,
			enableActiveState: true,
		}),
		...inspectorTabs.border({
			props,
			prefix,
			enableActiveState: true,
		}),
		...inspectorTabs.boxShadow({
			props,
			prefix,
			enableActiveState: true,
		}),
		...inspectorTabs.size({
			props,
			prefix,
		}),
		...inspectorTabs.marginPadding({
			props,
			customLabel: 'Padding',
			prefix,
			disableMargin: true,
		}),
	];

	return (
		<InspectorControls>
			{inspectorTabs.repeaterInfoBox({ props })}
			{inspectorTabs.responsiveInfoBox({ props })}
			{inspectorTabs.blockSettings({
				props: {
					...props,
				},
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
								items={[
									{
										label: __(
											'Pane settings',
											'maxi-blocks'
										),
										disablePadding: true,
										content: (
											<SettingTabsControl
												disablePadding
												isNestedAccordion
												hasBorder
												items={[
													{
														label: __(
															'Header',
															'maxi-blocks'
														),
														content: (
															<AccordionControl
																isNestedAccordion
																items={getBaseSettings(
																	'header-',
																	'.maxi-pane-block__header',
																	'Header'
																)}
															/>
														),
													},
													{
														label: __(
															'Content',
															'maxi-blocks'
														),
														content: (
															<AccordionControl
																isNestedAccordion
																items={getBaseSettings(
																	'content-',
																	'.maxi-pane-block__content',
																	'Content'
																)}
															/>
														),
													},
												]}
											/>
										),
									},
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
										contentType: 'pane',
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
											props: {
												...props,
											},
										}),
									},
									deviceType === 'general' && {
										...inspectorTabs.anchor({
											props: {
												...props,
											},
										}),
									},
									...inspectorTabs.customCss({
										props: {
											...props,
										},
										breakpoint: deviceType,
										selectors,
										categories,
									}),
									...inspectorTabs.advancedCss({
										props,
									}),
									...inspectorTabs.scrollEffects({
										props: {
											...props,
										},
									}),
									...inspectorTabs.transform({
										props: {
											...props,
										},
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
										props: {
											...props,
										},
									}),
									...inspectorTabs.opacity({
										props,
									}),
									...inspectorTabs.position({
										props: {
											...props,
										},
									}),
									deviceType !== 'general' && {
										...inspectorTabs.responsive({
											props: {
												...props,
											},
										}),
									},
									...inspectorTabs.overflow({
										props: {
											...props,
										},
									}),
									...inspectorTabs.flex({
										props: {
											...props,
										},
									}),
									...inspectorTabs.zindex({
										props: {
											...props,
										},
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
