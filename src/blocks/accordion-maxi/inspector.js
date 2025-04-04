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
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import AccordionLineControl from './components/accordion-line-control';
import AccordionSettings from './components/accordion-settings-control';
import AccordionTitleSettings from './components/accordion-title-control';
import * as inspectorTabs from '@components/inspector-tabs';
import { withMaxiInspector } from '@extensions/inspector';
import { getGroupAttributes } from '@extensions/styles';
import { ariaLabelsCategories, customCss } from './data';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		deviceType,
		maxiSetAttributes,
		clientId,
		insertInlineStyles,
		cleanInlineStyles,
		inlineStylesTargets,
	} = props;

	const { accordionLayout, blockStyle, titleLevel } = attributes;
	const { selectors, categories } = customCss;

	const iconTabsProps = {
		props,
		disableIconOnly: true,
		disableSpacing: true,
		disableIconInherit: true,
		disableHeightFitContent: true,
	};

	const lineSettingsProps = {
		...getGroupAttributes(attributes, 'accordionLine'),
		onChangeInline: obj => {
			insertInlineStyles({
				obj,
				target: inlineStylesTargets.headerLine,
				isMultiplySelector: true,
			});
			if (accordionLayout === 'simple')
				insertInlineStyles({
					obj,
					target: inlineStylesTargets.contentLine,
					isMultiplySelector: true,
				});
		},
		onChange: obj => {
			maxiSetAttributes(obj);
			cleanInlineStyles(inlineStylesTargets.headerLine);
			if (accordionLayout === 'simple')
				cleanInlineStyles(inlineStylesTargets.contentLine);
		},
		breakpoint: deviceType,
		clientId,
	};

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
											'Accordion settings',
											'maxi-blocks'
										),
										content: (
											<AccordionSettings
												clientId={clientId}
												{...getGroupAttributes(
													attributes,
													['accordion', 'flex']
												)}
												breakpoint={deviceType}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
											/>
										),
									},
									{
										label: __('Title', 'maxi-blocks'),
										content: (
											<AccordionTitleSettings
												onChange={obj => {
													maxiSetAttributes(obj);
												}}
												{...getGroupAttributes(
													attributes,
													'accordionTitle'
												)}
												disableCustomFormats
												hideAlignment
												breakpoint={deviceType}
												clientId={clientId}
												blockStyle={blockStyle}
												textLevel={titleLevel}
												globalProps={{
													target: '',
													type: titleLevel,
												}}
												hoverGlobalProps={{
													target: 'hover',
													type: titleLevel,
												}}
												styleCardPrefix=''
												setShowLoader={
													props.setShowLoader
												}
											/>
										),
									},
									...inspectorTabs.icon({
										...iconTabsProps,
										type: 'accordion-icon',
										disablePositionY: true,
									}),
									...inspectorTabs.icon({
										...iconTabsProps,
										label: __('Active Icon', 'maxi-blocks'),
										prefix: 'active-',
										type: 'accordion-icon-active',
										disablePosition: true,
									}),
									{
										label: __(
											'Line settings',
											'maxi-blocks'
										),
										content: (
											<ResponsiveTabsControl
												breakpoint={deviceType}
											>
												<SettingTabsControl
													depth={2}
													items={[
														{
															label: __(
																'Header line',
																'maxi-blocks'
															),
															content: (
																<AccordionLineControl
																	{...lineSettingsProps}
																	prefix='header-'
																/>
															),
														},
														{
															label: __(
																'Content line',
																'maxi-blocks'
															),
															content: (
																<AccordionLineControl
																	{...lineSettingsProps}
																	prefix='content-'
																/>
															),
														},
													]}
												/>
											</ResponsiveTabsControl>
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
									}),
									...inspectorTabs.savedStyles({
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
