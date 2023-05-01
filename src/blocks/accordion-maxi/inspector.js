/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	SettingTabsControl,
	AccordionControl,
	ResponsiveTabsControl,
} from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { withMaxiInspector } from '../../extensions/inspector';
import {
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import { customCss } from './data';
import {
	AccordionIconSettings,
	AccordionLineControl,
	AccordionSettings,
	AccordionTitleSettings,
} from './components';

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

	const blockStyle = getAttributesValue({
		target: '_bs',
		props: attributes,
	});

	const accordionLayout = getAttributesValue({
		target: '_acl',
		props: attributes,
	});
	const titleLevel = getAttributesValue({
		target: '_tl',
		props: attributes,
	});

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

	const { selectors, categories } = customCss;

	const iconGroupAttributes = [
		'icon',
		'iconHover',
		'iconBackgroundGradient',
		'iconBackgroundGradientHover',
		'iconBackgroundColor',
		'iconBackgroundColorHover',
		'iconBorder',
		'iconBackground',
		'iconBackgroundHover',
		'iconBorderWidth',
		'iconBorderRadius',
		'iconPadding',
	];

	return (
		<InspectorControls>
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
											/>
										),
									},
									{
										label: __('Icon', 'maxi-blocks'),
										content: (
											<AccordionIconSettings
												{...getGroupAttributes(
													attributes,
													iconGroupAttributes
												)}
												{...getGroupAttributes(
													attributes,
													iconGroupAttributes,
													false,
													'a-'
												)}
												disableIconOnly
												disableSpacing
												disablePosition
												disableIconInherit
												disableModal
												blockStyle={blockStyle}
												onChange={obj => {
													maxiSetAttributes(obj);
												}}
												breakpoint={deviceType}
											/>
										),
									},
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
																	prefix='he-'
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
																	prefix='c-'
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
