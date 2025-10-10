/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import AccordionControl from '@components/accordion-control';
import FontLevelControl from '@components/font-level-control';
import SettingTabsControl from '@components/setting-tabs-control';
import ListOptionsControl from './components/list-options-control';
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
		context,
		disableCustomFormats,
	} = props;
	const { isList, textLevel } = attributes;
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
								isSecondary
								items={[
									...inspectorTabs.prompt({
										props,
									}),
									deviceType === 'general' &&
										!isList && {
											label: __(
												'Heading / Paragraph tag',
												'maxi-blocks'
											),
											content: (
												<FontLevelControl
													{...getGroupAttributes(
														attributes,
														'typography',
														true
													)}
													value={textLevel}
													onChange={obj => {
														const filteredObj =
															Object.fromEntries(
																Object.entries(
																	obj
																).filter(
																	([
																		key,
																		value,
																	]) =>
																		value !==
																		undefined
																)
															);
														maxiSetAttributes(
															filteredObj
														);
													}}
												/>
											),
											indicatorProps: ['textLevel'],
										},
									isList && {
										label: __(
											'List options',
											'maxi-blocks'
										),
										content: (
											<ListOptionsControl {...props} />
										),
									},
									...inspectorTabs.alignment({
										props,
										isTextAlignment: true,
									}),
									...inspectorTabs.typography({
										props,
										styleCardPrefix: '',
										hideAlignment: true,
										showBottomGap: !isList,
										allowLink: true,
										globalProps: {
											target: '',
											type: textLevel,
										},
										hoverGlobalProps: {
											target: 'hover',
											type: textLevel,
										},
										context,
										disableCustomFormats,
									}),
									...inspectorTabs.linkSettings({
										props,
										styleCardPrefix: '',
										prefix: '',
										classNamePanel:
											'maxi-link-settings-panel',
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
						ignoreIndicator: ['prompt'],
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
									...inspectorTabs.dc({
										props,
										contentType: 'text',
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
