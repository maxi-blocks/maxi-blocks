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
import ColumnSizeControl from './components/column-size-control';
import * as inspectorTabs from '@components/inspector-tabs';
import { ariaLabelsCategories, customCss } from './data';
import { getGroupAttributes } from '@extensions/styles';
import { withMaxiInspector } from '@extensions/inspector';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes, clientId, rowPattern } =
		props;
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
									{
										label: __(
											'Column settings',
											'maxi-blocks'
										),
										content: (
											<ColumnSizeControl
												{...getGroupAttributes(
													attributes,
													['columnSize', 'flex']
												)}
												rowPattern={rowPattern}
												clientId={clientId}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
												breakpoint={deviceType}
											/>
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
										hideFit: true,
									}),
									...inspectorTabs.marginPadding({
										props,
									}),
									...inspectorTabs.contextLoop({
										props,
										contentType: 'column',
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
										props,
										selectors,
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
