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
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsText, categoriesText } from './custom-css';
import listTab from './list-tab';
import { withMaxiInspector } from '../../extensions/inspector';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes, context } = props;
	const { isList, textLevel } = attributes;

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
															maxiSetAttributes(
																obj
															)
														}
													/>
												),
												indicatorProps: ['textLevel'],
											},
										...(isList && listTab(props)),
										...inspectorTabs.alignment({
											props,
											isTextAlignment: true,
										}),
										...inspectorTabs.typography({
											props,
											styleCardPrefix: '',
											hideAlignment: true,
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
										selectors: selectorsText,
										categories: categoriesText,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
									}),
									...inspectorTabs.transition({
										props: {
											...props,
										},
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
