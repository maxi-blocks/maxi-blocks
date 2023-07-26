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
	FontLevelControl,
	SettingTabsControl,
} from '../../components';
import { ListOptionsControl } from './components';
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { customCss } from './data';
import { withMaxiInspector } from '../../extensions/inspector';

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
													onChange={obj =>
														maxiSetAttributes(obj)
													}
												/>
											),
											indicatorProps: ['textLevel'],
										},
									...(isList && {
										label: __(
											'List options',
											'maxi-blocks'
										),
										content: (
											<ListOptionsControl {...props} />
										),
									}),
									...inspectorTabs.alignment({
										props,
										isTextAlignment: true,
									}),
									...inspectorTabs.typography({
										props,
										styleCardPrefix: '',
										hideAlignment: true,
										showBottomGap: true,
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
										selectors,
										categories,
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
