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
	ColumnSizeControl,
	SettingTabsControl,
} from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsColumn, categoriesColumn } from './custom-css';
import ResponsiveTabsControl from '../../components/responsive-tabs-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes, clientId, rowPattern } =
		props;

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
												'Column settings',
												'maxi-blocks'
											),
											content: (
												<ResponsiveTabsControl
													breakpoint={deviceType}
												>
													<ColumnSizeControl
														props
														{...getGroupAttributes(
															attributes,
															'flex'
														)}
														rowPattern={rowPattern}
														clientId={clientId}
														onChange={obj =>
															maxiSetAttributes(
																obj
															)
														}
														breakpoint={deviceType}
													/>
												</ResponsiveTabsControl>
											),
											extraIndicators: [
												`column-fit-content-${deviceType}`,
												`column-size-${deviceType}`,
											],
										},
										...inspectorTabs.blockBackground({
											props,
											disableVideo: true,
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
											hideWidth: true,
											hideMaxWidth: true,
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
										selectors: selectorsColumn,
										categories: categoriesColumn,
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
									deviceType !== 'general' && {
										...inspectorTabs.responsive({
											props,
										}),
									},
									...inspectorTabs.opacity({
										props,
									}),
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
