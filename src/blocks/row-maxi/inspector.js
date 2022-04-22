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
	ColumnPattern,
	FlexGapControl,
	FlexWrapControl,
	SettingTabsControl,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsRow, categoriesRow } from './custom-css';

const ColumnPicker = props => {
	const { clientId, attributes, deviceType, maxiSetAttributes } = props;

	return (
		<>
			<ColumnPattern
				clientId={clientId}
				{...getGroupAttributes(attributes, 'rowPattern')}
				onChange={obj => maxiSetAttributes(obj)}
				breakpoint={deviceType}
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
};

/**
 * Inspector
 */
const Inspector = props => {
	const { deviceType } = props;

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
												'Column picker',
												'maxi-blocks'
											),
											content: (
												<ColumnPicker {...props} />
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
										selectors: selectorsRow,
										categories: categoriesRow,
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
