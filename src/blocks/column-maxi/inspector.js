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
	AdvancedNumberControl,
	SelectControl,
	SettingTabsControl,
} from '../../components';
import {
	getGroupAttributes,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getColumnDefaultValue } from '../../extensions/column-templates';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsColumn, categoriesColumn } from './custom-css';

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
												<>
													<AdvancedNumberControl
														label={__(
															'Column Size (%)',
															'maxi-blocks'
														)}
														value={getLastBreakpointAttribute(
															{
																target: 'column-size',
																breakpoint:
																	deviceType,
																attributes,
															}
														)}
														onChangeValue={val => {
															maxiSetAttributes({
																[`column-size-${deviceType}`]:
																	val !==
																		undefined &&
																	val !== ''
																		? val.toString()
																		: '',
															});
														}}
														min={0}
														max={100}
														step={0.1}
														onReset={() =>
															maxiSetAttributes({
																[`column-size-${deviceType}`]:
																	getColumnDefaultValue(
																		rowPattern,
																		{
																			...getGroupAttributes(
																				attributes,
																				'columnSize'
																			),
																		},
																		clientId,
																		deviceType
																	),
															})
														}
														initialPosition={getDefaultAttribute(
															`column-size-${deviceType}`,
															clientId
														)}
														enableAuto
														autoLabel={__(
															'Fit content',
															'maxi-blocks'
														)}
													/>
													<SelectControl
														label={__(
															'Vertical align',
															'maxi-blocks'
														)}
														value={
															attributes.verticalAlign
														}
														options={[
															{
																label: __(
																	'Top',
																	'maxi-blocks'
																),
																value: 'flex-start',
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
																	'Bottom',
																	'maxi-blocks'
																),
																value: 'flex-end',
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
											disableVideo: true,
										}),
										...inspectorTabs.border({
											props,
										}),
										...inspectorTabs.boxShadow({
											props,
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
