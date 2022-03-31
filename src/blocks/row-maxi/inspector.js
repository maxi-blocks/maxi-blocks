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
	SelectControl,
	SettingTabsControl,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsRow, categoriesRow } from './custom-css';

/**
 * External dependencies
 */

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes, clientId } = props;
	const { horizontalAlign, verticalAlign } = attributes;

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
												<>
													<ColumnPattern
														clientId={clientId}
														{...getGroupAttributes(
															attributes,
															'rowPattern'
														)}
														removeColumnGap={
															attributes.removeColumnGap
														}
														onChange={obj =>
															maxiSetAttributes(
																obj
															)
														}
														breakpoint={deviceType}
													/>
													<SelectControl
														label={__(
															'Horizontal align',
															'maxi-blocks'
														)}
														value={horizontalAlign}
														options={[
															{
																label: __(
																	'Flex-start',
																	'maxi-blocks'
																),
																value: 'flex-start',
															},
															{
																label: __(
																	'Flex-end',
																	'maxi-blocks'
																),
																value: 'flex-end',
															},
															{
																label: __(
																	'Center',
																	'maxi-blocks'
																),
																value: 'center',
															},
															{
																label: __(
																	'Space between',
																	'maxi-blocks'
																),
																value: 'space-between',
															},
															{
																label: __(
																	'Space around',
																	'maxi-blocks'
																),
																value: 'space-around',
															},
														]}
														onChange={horizontalAlign =>
															maxiSetAttributes({
																horizontalAlign,
															})
														}
													/>
													<SelectControl
														label={__(
															'Vertical align',
															'maxi-blocks'
														)}
														value={verticalAlign}
														options={[
															{
																label: __(
																	'Stretch',
																	'maxi-blocks'
																),
																value: 'stretch',
															},
															{
																label: __(
																	'Flex-start',
																	'maxi-blocks'
																),
																value: 'flex-start',
															},
															{
																label: __(
																	'Flex-end',
																	'maxi-blocks'
																),
																value: 'flex-end',
															},
															{
																label: __(
																	'Center',
																	'maxi-blocks'
																),
																value: 'center',
															},
															{
																label: __(
																	'Space between',
																	'maxi-blocks'
																),
																value: 'space-between',
															},
															{
																label: __(
																	'Space around',
																	'maxi-blocks'
																),
																value: 'space-around',
															},
														]}
														onChange={verticalAlign =>
															maxiSetAttributes({
																verticalAlign,
															})
														}
													/>
												</>
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
