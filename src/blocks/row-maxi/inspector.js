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
	FlexGapControl,
	FlexWrapControl,
	ResponsiveTabsControl,
	SettingTabsControl,
} from '../../components';
import { ColumnPattern } from './components';
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { customCss } from './data';
import { withMaxiInspector } from '../../extensions/inspector';

function ColumnPicker(props) {
	const {
		clientId,
		attributes,
		deviceType,
		repeaterStatus,
		repeaterRowClientId,
		getInnerBlocksPositions,
		maxiSetAttributes,
	} = props;

	return (
		<>
			<ColumnPattern
				clientId={clientId}
				{...getGroupAttributes(attributes, 'rowPattern')}
				onChange={obj => maxiSetAttributes(obj)}
				breakpoint={deviceType}
				repeaterStatus={repeaterStatus}
				repeaterRowClientId={repeaterRowClientId}
				getInnerBlocksPositions={getInnerBlocksPositions}
			/>
			<FlexGapControl
				{...getGroupAttributes(attributes, 'flex')}
				onChange={maxiSetAttributes}
				breakpoint={deviceType}
			/>
			<FlexWrapControl
				{...getGroupAttributes(attributes, 'flex')}
				onChange={maxiSetAttributes}
				breakpoint={deviceType}
			/>
		</>
	);
}

/**
 * Inspector
 */
const Inspector = props => {
	const { deviceType, isRepeaterInherited, updateInnerBlocksPositions } =
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
											'Column picker',
											'maxi-blocks'
										),
										content: (
											<ResponsiveTabsControl
												breakpoint={deviceType}
											>
												<ColumnPicker {...props} />
											</ResponsiveTabsControl>
										),
										ignoreIndicator: [
											'row-pattern-general',
											'row-pattern-m',
										],
										extraIndicators: [
											'verticalAlign',
											'horizontalAlign',
										],
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
										contentType: 'row',
									}),
									...inspectorTabs.repeater({
										props,
										isRepeaterInherited,
										updateInnerBlocksPositions,
									}),
								]}
							/>
						),
						ignoreIndicator: [
							'row-pattern-general',
							'row-pattern-m',
						],
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
